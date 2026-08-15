/**
 * Real queries against the public-record store.
 *
 * These mirror ops/royalty_office/etl/owner_card.py exactly, so a number on
 * the site can always be reproduced from the database by hand. Where that
 * script carries a caveat, so does this file.
 *
 * NUMERIC COMES BACK AS A STRING. node-postgres returns Postgres `numeric`
 * as a JS string, because a float64 cannot hold it losslessly. Every
 * revenue_decimal, royalty_rate and per-month volume below is numeric, so
 * arithmetic on the raw value silently yields NaN or string concatenation —
 * "0.0016" * 12 is fine but "0.0016" + 1 is "0.00161". Everything is passed
 * through num() at the boundary; nothing downstream sees a string.
 *
 * WHAT THE NUMBERS MEAN (verified — see migrations 005-008):
 *   decimal   a true revenue decimal for royalty rows. RI+ORRI sums per
 *             lease have a median of 0.2494 across the beta counties.
 *   basis     'exact' when the RRC lease maps to one appraisal tract (92.1%
 *             of leases); 'allocated' when production is split between
 *             tracts by appraised royalty value. Surfaced, never hidden.
 *   volumes   per-month rates from core.lease_production_rate, which
 *             normalizes each lease by its own period_months. NEVER sum
 *             period_months across leases to derive a rate — that divides
 *             by rows x months and understates by orders of magnitude.
 *   revenue   GROSS to the owner, before severance tax and post-production
 *             deductions. Runs HIGH against a real check.
 */
import { q, q1 } from "./db";

/** Reference prices. Replaced by core.price_deck_months once an EIA key is
 *  configured; kept flat and labelled rather than invented. */
export const REFERENCE_PRICE = { oil: 60.0, gas: 2.5, label: "placeholder" };

export type RevenueBasis = "exact" | "allocated" | "stream_unknown" | "unavailable";

export interface OwnerHit {
  ownerId: number;
  name: string;
  county: string;
  city: string | null;
  state: string | null;
  interests: number;
  similarity: number;
}

export interface OwnerPosition {
  interestId: number;
  propertyId: number | null;
  propertyName: string;
  county: string;
  rrcLeaseNo: string | null;
  operator: string | null;
  interestType: "RI" | "ORRI";
  decimal: number;
  basis: RevenueBasis;
  tracts: number;
  royaltyRate: number | null;
  assessedValue: number | null;
  oilBblPerMonth: number;
  gasMcfPerMonth: number;
  grossRevenuePerMonth: number;
  monthsCovered: number;
}

export interface OwnerSummary {
  ownerId: number;
  name: string;
  city: string | null;
  state: string | null;
  counties: string[];
  interests: number;
  properties: number;
  assessedValue: number;
  oilBblPerMonth: number;
  gasMcfPerMonth: number;
  grossRevenuePerMonth: number;
  allocatedCount: number;
  unpricedCount: number;
}

/** Postgres numeric/bigint arrive as strings; coerce once, at the edge. */
function num(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}
function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

/**
 * Fuzzy owner search for the claim flow. Uses the trigram index on
 * core.owners.name_norm (idx_owners_name_trgm). pg_trgm lives in `public`
 * as of migration 009 — before that it was installed into `core` and the %
 * operator was invisible to an ordinary connection, which failed outright
 * rather than merely running slowly.
 */
export async function searchOwners(term: string, limit = 25): Promise<OwnerHit[]> {
  const needle = term.trim().toUpperCase();
  if (needle.length < 3) return [];
  const rows = await q(
    `SELECT o.owner_id, o.name, o.mail_city, o.mail_state,
            c.name AS county,
            count(mi.interest_id)::int AS interests,
            similarity(o.name_norm, $1) AS sim
       FROM core.owners o
       JOIN core.mineral_interests mi ON mi.owner_id = o.owner_id
       JOIN core.counties c ON c.county_id = mi.county_id
      WHERE o.name_norm % $1
      GROUP BY o.owner_id, o.name, o.mail_city, o.mail_state, c.name
      ORDER BY sim DESC, interests DESC
      LIMIT $2`,
    [needle, limit],
  );
  return rows.map((r) => ({
    ownerId: num(r.owner_id),
    name: String(r.name),
    county: String(r.county),
    city: (r.mail_city as string) ?? null,
    state: (r.mail_state as string) ?? null,
    interests: num(r.interests),
    similarity: num(r.sim),
  }));
}

/**
 * Everything an owner holds, one row per interest, priced where the basis
 * allows it. Royalty rows only: working-interest rows are operators, and
 * their decimals are net revenue interests that would swamp the list.
 */
export async function getOwnerPositions(ownerId: number): Promise<OwnerPosition[]> {
  const rows = await q(
    `SELECT mi.interest_id, l.property_id,
            COALESCE(p.name, l.name)              AS property_name,
            c.name                                AS county,
            l.rrc_lease_no,
            COALESCE(op.name, mi.operator_name)   AS operator,
            mi.interest_type,
            b.revenue_decimal, b.revenue_basis, b.tracts,
            rr.royalty_rate, mi.market_value,
            COALESCE(lr.oil_bbl_per_month, 0)     AS oil_bbl_per_month,
            COALESCE(lr.gas_mcf_per_month, 0)     AS gas_mcf_per_month,
            COALESCE(lr.months_covered, 0)        AS months_covered
       FROM core.mineral_interests mi
       JOIN core.counties   c  ON c.county_id = mi.county_id
       LEFT JOIN core.leases     l  ON l.lease_id    = mi.lease_id
       LEFT JOIN core.properties p  ON p.property_id = l.property_id
       LEFT JOIN core.operators  op ON op.operator_id = l.operator_id
       LEFT JOIN core.interest_revenue_basis   b  ON b.interest_id = mi.interest_id
       LEFT JOIN core.property_royalty_rate    rr ON rr.property_id = l.property_id
       LEFT JOIN core.lease_production_rate    lr ON lr.lease_id = mi.lease_id
      WHERE mi.owner_id = $1
        AND mi.interest_type IN ('RI','ORRI')
      ORDER BY COALESCE(lr.oil_bbl_per_month, 0) * COALESCE(b.revenue_decimal, 0)
               DESC NULLS LAST`,
    [ownerId],
  );

  return rows.map((r) => {
    const decimal = num(r.revenue_decimal);
    const oil = num(r.oil_bbl_per_month);
    const gas = num(r.gas_mcf_per_month);
    return {
      interestId: num(r.interest_id),
      propertyId: numOrNull(r.property_id),
      propertyName: String(r.property_name ?? "(unnamed)"),
      county: String(r.county),
      rrcLeaseNo: (r.rrc_lease_no as string) ?? null,
      operator: (r.operator as string) ?? null,
      interestType: r.interest_type as "RI" | "ORRI",
      decimal,
      basis: (r.revenue_basis as RevenueBasis) ?? "unavailable",
      tracts: num(r.tracts),
      royaltyRate: numOrNull(r.royalty_rate),
      assessedValue: numOrNull(r.market_value),
      oilBblPerMonth: oil * decimal,
      gasMcfPerMonth: gas * decimal,
      grossRevenuePerMonth:
        oil * decimal * REFERENCE_PRICE.oil + gas * decimal * REFERENCE_PRICE.gas,
      monthsCovered: num(r.months_covered),
    };
  });
}

/** Header figures for the owner card, aggregated in the database. */
export async function getOwnerSummary(ownerId: number): Promise<OwnerSummary | null> {
  const r = await q1(
    `SELECT o.owner_id, o.name, o.mail_city, o.mail_state,
            count(*)::int                                    AS interests,
            count(DISTINCT l.property_id)::int               AS properties,
            COALESCE(sum(mi.market_value), 0)                AS assessed_value,
            COALESCE(sum(lr.oil_bbl_per_month * b.revenue_decimal), 0) AS oil,
            COALESCE(sum(lr.gas_mcf_per_month * b.revenue_decimal), 0) AS gas,
            count(*) FILTER (WHERE b.revenue_basis = 'allocated')::int AS allocated,
            count(*) FILTER (WHERE b.revenue_decimal IS NULL)::int     AS unpriced,
            array_remove(array_agg(DISTINCT c.name), NULL)   AS counties
       FROM core.mineral_interests mi
       JOIN core.owners   o USING (owner_id)
       JOIN core.counties c ON c.county_id = mi.county_id
       LEFT JOIN core.leases l ON l.lease_id = mi.lease_id
       LEFT JOIN core.interest_revenue_basis b ON b.interest_id = mi.interest_id
       LEFT JOIN core.lease_production_rate  lr ON lr.lease_id = mi.lease_id
      WHERE mi.owner_id = $1 AND mi.interest_type IN ('RI','ORRI')
      GROUP BY o.owner_id, o.name, o.mail_city, o.mail_state`,
    [ownerId],
  );
  if (!r) return null;
  const oil = num(r.oil);
  const gas = num(r.gas);
  return {
    ownerId: num(r.owner_id),
    name: String(r.name),
    city: (r.mail_city as string) ?? null,
    state: (r.mail_state as string) ?? null,
    counties: (r.counties as string[]) ?? [],
    interests: num(r.interests),
    properties: num(r.properties),
    assessedValue: num(r.assessed_value),
    oilBblPerMonth: oil,
    gasMcfPerMonth: gas,
    grossRevenuePerMonth: oil * REFERENCE_PRICE.oil + gas * REFERENCE_PRICE.gas,
    allocatedCount: num(r.allocated),
    unpricedCount: num(r.unpriced),
  };
}

/** Coverage figures for the marketing surface — real, not asserted. */
export async function getPlatformStats(): Promise<{
  interests: number; owners: number; leases: number; counties: number;
}> {
  const r = await q1(
    `SELECT (SELECT count(*) FROM core.mineral_interests) AS interests,
            (SELECT count(*) FROM core.owners)            AS owners,
            (SELECT count(*) FROM core.leases)            AS leases,
            (SELECT count(DISTINCT county_id)
               FROM core.mineral_interests)               AS counties`,
  );
  return {
    interests: num(r?.interests),
    owners: num(r?.owners),
    leases: num(r?.leases),
    counties: num(r?.counties),
  };
}
