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

// ---------------------------------------------------------------- history

export interface OwnerMonth {
  month: string;               // "YYYY-MM"
  oilBbl: number;              // owner's share (gross volume x decimal)
  gasMcf: number;
  grossRevenue: number;        // at REFERENCE_PRICE, before severance/deducts
}

/**
 * The owner's monthly production history, net to their decimals, summed
 * across every priced interest. TRUE months only (period_months = 1) — the
 * 12-month window rows exist for the revenue basis and would double-count
 * here. Gross revenue at the reference price: it runs HIGH against a real
 * check (severance and post-production deducts are not netted), and every
 * surface that shows it says so.
 */
export async function getOwnerHistory(ownerId: number, months = 24): Promise<OwnerMonth[]> {
  const rows = await q(
    `SELECT to_char(pm.month, 'YYYY-MM') AS ym,
            sum(pm.oil_bbl * b.revenue_decimal)  AS oil,
            sum(pm.gas_mcf * b.revenue_decimal)  AS gas
       FROM core.mineral_interests mi
       JOIN core.interest_revenue_basis b ON b.interest_id = mi.interest_id
       JOIN core.production_monthly pm ON pm.lease_id = mi.lease_id
      WHERE mi.owner_id = $1
        AND mi.interest_type IN ('RI','ORRI')
        AND pm.level = 'lease' AND pm.period_months = 1
        -- Anchored on the owner's OWN last reported month, not on now().
        -- RRC reporting lags 2-4 months, so a now()-anchored 12-month window
        -- returned 11 buckets for every owner in the database (10.1% low in
        -- aggregate) and returned NOTHING for gas owners, whose ledger is
        -- further behind — the same owner then showed $0 on Overview and
        -- $108 on Cashflow. One definition, used by both pages.
        AND pm.month > ((SELECT max(pm2.month)
                           FROM core.mineral_interests mi2
                           JOIN core.interest_revenue_basis b2 ON b2.interest_id = mi2.interest_id
                           JOIN core.production_monthly pm2 ON pm2.lease_id = mi2.lease_id
                          WHERE mi2.owner_id = $1
                            AND mi2.interest_type IN ('RI','ORRI')
                            AND pm2.level = 'lease' AND pm2.period_months = 1)
                        - ($2 || ' months')::interval)
      GROUP BY 1 ORDER BY 1`,
    [ownerId, months],
  );
  return rows.map((r) => {
    const oil = num(r.oil);
    const gas = num(r.gas);
    return {
      month: String(r.ym),
      oilBbl: oil,
      gasMcf: gas,
      grossRevenue: oil * REFERENCE_PRICE.oil + gas * REFERENCE_PRICE.gas,
    };
  });
}

// ---------------------------------------------------------------- forecast

export interface OwnerForecastMonth {
  month: string;
  oilBbl: number;              // owner's share
  grossRevenue: number;
}

export interface OwnerForecast {
  months: OwnerForecastMonth[];
  leasesForecast: number;      // leases with a publishable curve
  leasesHeldOut: number;       // owner's priced leases with NO publishable curve
  priceDeck: string;           // disclosure label, e.g. 'placeholder_flat'
  oilPrice: number;
}

/**
 * Forward cashflow, owner's share, built ONLY from core.publishable_forecasts
 * — the view that enforces the engineering standard (mig 015). A lease with
 * no publishable curve contributes NOTHING here and is counted in
 * leasesHeldOut so the page can say "N of your leases have no defensible
 * forecast" instead of quietly showing a smaller number. Oil stream only,
 * matching fit_declines_v2. Zero-decimal or unpriced interests contribute
 * nothing by construction.
 */
export async function getOwnerForecast(ownerId: number, months = 36): Promise<OwnerForecast> {
  const rows = await q(
    `SELECT f.lease_id, f.qi, f.di_nominal, f.b_factor, f.terminal_decline,
            to_char(f.t0, 'YYYY-MM')               AS t0,
            to_char(f.econ_limit_month, 'YYYY-MM') AS econ_limit,
            f.price_deck,
            sum(b.revenue_decimal)                 AS decimal
       FROM core.mineral_interests mi
       JOIN core.interest_revenue_basis b ON b.interest_id = mi.interest_id
       JOIN core.publishable_forecasts f ON f.lease_id = mi.lease_id
      WHERE mi.owner_id = $1 AND mi.interest_type IN ('RI','ORRI')
        AND f.stream = 'oil'
      GROUP BY f.lease_id, f.qi, f.di_nominal, f.b_factor, f.terminal_decline,
               f.t0, f.econ_limit_month, f.price_deck`,
    [ownerId],
  );
  const heldOut = await q1(
    `SELECT count(DISTINCT mi.lease_id)::int AS n
       FROM core.mineral_interests mi
       JOIN core.interest_revenue_basis b ON b.interest_id = mi.interest_id
      WHERE mi.owner_id = $1 AND mi.interest_type IN ('RI','ORRI')
        AND mi.lease_id IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM core.publishable_forecasts pf
                        WHERE pf.lease_id = mi.lease_id AND pf.stream = 'oil')`,
    [ownerId],
  );

  const now = new Date();
  const start = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const { monthlyRate, addMonths, monthsBetween } = await import("./arps");

  const out: OwnerForecastMonth[] = [];
  for (let k = 1; k <= months; k++) {
    const ym = addMonths(start, k);
    let oil = 0;
    for (const r of rows) {
      // The forecast stops at the ECONOMIC LIMIT, never runs to zero rate —
      // a curve past the limit overstates reserves, always (standard sec 2.5).
      if (String(r.econ_limit) && ym > String(r.econ_limit)) continue;
      const t = monthsBetween(String(r.t0), ym);
      if (t < 0) continue;
      oil +=
        monthlyRate(num(r.qi), num(r.di_nominal), num(r.b_factor),
                    num(r.terminal_decline), t) * num(r.decimal);
    }
    out.push({ month: ym, oilBbl: oil, grossRevenue: oil * REFERENCE_PRICE.oil });
  }
  return {
    months: out,
    leasesForecast: rows.length,
    leasesHeldOut: num((heldOut as Record<string, unknown>)?.n),
    priceDeck: rows.length ? String(rows[0].price_deck) : "none",
    oilPrice: REFERENCE_PRICE.oil,
  };
}

/** Coverage figures for the marketing surface — real, not asserted. */
export interface IndexHit {
  name: string;
  county: string;
  interests: number;
  leases: number;
  operators: number;
  assessedValue: number | null;
  claimable: boolean;
  countyStatus: string;    // 'live' | 'partial' | 'indexed' | 'queued' | 'building' | 'failed'
  readyNow: boolean;
}

/**
 * Statewide claim-funnel search — core.v_owner_search, the 1.28M-name index
 * built from the CAD rolls (mig 016). This is the tier-1 promise: "do we
 * have you, and roughly how much is there" for ~every mineral owner in
 * Texas, WITHOUT the county being loaded. It never carries a forecast, a
 * price, or a decimal — assessed value is the county's own public number.
 *
 * searchOwners() above stays for the post-claim world: it hits core.owners,
 * which only holds detail-loaded (live) counties.
 *
 * Match strategy: prefix on the normalized name (rolls are LAST FIRST, and
 * people type surnames) OR trigram similarity for the constant misspellings
 * in county data. Both arms are indexed (unique btree / gin_trgm).
 */
export async function searchIndex(term: string, limit = 60): Promise<IndexHit[]> {
  const needle = term.trim().toUpperCase().replace(/\s+/g, " ").slice(0, 80);
  if (needle.length < 3) return [];
  // ESCAPE LIKE METACHARACTERS. Unescaped, a visitor typing "%%%" turns the
  // indexed prefix scan into a parallel sequential scan of all 1.28M rows
  // (~2.6s and ~170MB of buffers per request, measured) on an endpoint that
  // needs no login — a free denial of service — and dumps the top of the
  // index besides. Escaped, the pattern can only ever match a literal.
  const likeNeedle = needle.replace(/[\%_]/g, (ch) => "\\" + ch);
  // The trigram arm needs the same protection by a different route: escaping
  // does nothing for `name_norm % $1`, and a term of pure punctuation ("%%%")
  // has no usable trigrams, so the planner falls back to a parallel seq scan
  // of the whole index (2.2s measured). A name search needs three real
  // characters; anything less is not a search, it is a scan.
  const alnum = needle.replace(/[^A-Z0-9]/g, "");
  if (alnum.length < 3) return [];
  const rows = await q(
    `SELECT name, county, interests, leases, operators, assessed_value,
            is_claimable, county_status, ready_now,
            greatest(similarity(name_norm, $1),
                     (name_norm LIKE $3 || '%' ESCAPE '\')::int,
                     -- an exact hit must outrank every longer prefix: someone
                     -- typing their full name should not be pushed off the
                     -- page by richer strangers who merely start the same way
                     (name_norm = $1)::int * 2) AS rank
       FROM core.v_owner_search
      WHERE name_norm LIKE $3 || '%' ESCAPE '\' OR name_norm % $1
      ORDER BY rank DESC, assessed_value DESC NULLS LAST, interests DESC
      LIMIT $2`,
    [needle, limit, likeNeedle],
  );
  return rows.map((r) => ({
    name: String(r.name),
    county: String(r.county),
    interests: num(r.interests),
    leases: num(r.leases),
    operators: num(r.operators),
    assessedValue: r.assessed_value == null ? null : num(r.assessed_value),
    claimable: Boolean(r.is_claimable),
    countyStatus: String(r.county_status),
    readyNow: Boolean(r.ready_now),
  }));
}

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
