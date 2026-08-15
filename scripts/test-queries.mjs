/**
 * Exercise the production SQL from lib/queries.ts against a real database.
 *
 * Runs the same statements the site will run, so a broken join or a missing
 * column fails here rather than in a rendered page. Reads RO_APP_DATABASE_URL
 * if set, otherwise falls back to the local dev database using the internal
 * stack's .env — that way this works before the Neon role passwords exist.
 *
 *   node scripts/test-queries.mjs
 */
import fs from "node:fs";
import pg from "pg";

function loadEnv(path) {
  const out = {};
  if (!fs.existsSync(path)) return out;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const master = loadEnv("C:/master_leasehold_database/.env");
const site = loadEnv("C:/royalty-office/.env");

const url = process.env.RO_APP_DATABASE_URL || site.RO_APP_DATABASE_URL;
const cfg = url
  ? { connectionString: url }
  : {
      host: master.DB_HOST,
      database: "royalty_office_dev",
      user: master.DB_USER,
      password: master.DB_PASSWORD,
    };
console.log(`target: ${url ? "RO_APP_DATABASE_URL" : `local ${cfg.host}/${cfg.database}`}\n`);

const client = new pg.Client(cfg);
await client.connect();

const num = (v) => (v === null || v === undefined ? 0 : Number(v));
let failures = 0;

async function step(label, fn) {
  try {
    const t = Date.now();
    const out = await fn();
    console.log(`  [PASS] ${label} (${Date.now() - t}ms)`);
    return out;
  } catch (e) {
    failures++;
    console.log(`  [FAIL] ${label}\n         ${String(e.message).split("\n")[0]}`);
    return null;
  }
}

// ---- 1. search -------------------------------------------------------
const hits = await step("searchOwners('CAMPBELL')", async () => {
  const { rows } = await client.query(
    `SELECT o.owner_id, o.name, o.mail_city, o.mail_state, c.name AS county,
            count(mi.interest_id)::int AS interests, similarity(o.name_norm,$1) AS sim
       FROM core.owners o
       JOIN core.mineral_interests mi ON mi.owner_id = o.owner_id
       JOIN core.counties c ON c.county_id = mi.county_id
      WHERE o.name_norm % $1
      GROUP BY o.owner_id, o.name, o.mail_city, o.mail_state, c.name
      ORDER BY sim DESC, interests DESC LIMIT $2`,
    ["CAMPBELL JOHN", 5],
  );
  if (!rows.length) throw new Error("no hits — trigram search returned nothing");
  return rows;
});
if (hits) {
  for (const h of hits.slice(0, 3)) {
    console.log(`         ${h.name} (${h.county}) — ${h.interests} interests, sim=${num(h.sim).toFixed(3)}`);
  }
}

// ---- 2. summary ------------------------------------------------------
const ownerId = hits?.[0]?.owner_id;
const summary = await step(`getOwnerSummary(${ownerId})`, async () => {
  const { rows } = await client.query(
    `SELECT o.owner_id, o.name, o.mail_city, o.mail_state,
            count(*)::int AS interests, count(DISTINCT l.property_id)::int AS properties,
            COALESCE(sum(mi.market_value),0) AS assessed_value,
            COALESCE(sum(lr.oil_bbl_per_month * b.revenue_decimal),0) AS oil,
            COALESCE(sum(lr.gas_mcf_per_month * b.revenue_decimal),0) AS gas,
            count(*) FILTER (WHERE b.revenue_basis='allocated')::int AS allocated,
            count(*) FILTER (WHERE b.revenue_decimal IS NULL)::int AS unpriced,
            array_remove(array_agg(DISTINCT c.name), NULL) AS counties
       FROM core.mineral_interests mi
       JOIN core.owners o USING (owner_id)
       JOIN core.counties c ON c.county_id = mi.county_id
       LEFT JOIN core.leases l ON l.lease_id = mi.lease_id
       LEFT JOIN core.interest_revenue_basis b ON b.interest_id = mi.interest_id
       LEFT JOIN core.lease_production_rate lr ON lr.lease_id = mi.lease_id
      WHERE mi.owner_id = $1 AND mi.interest_type IN ('RI','ORRI')
      GROUP BY o.owner_id, o.name, o.mail_city, o.mail_state`,
    [ownerId],
  );
  if (!rows.length) throw new Error("summary returned no row");
  return rows[0];
});
if (summary) {
  const rev = num(summary.oil) * 60 + num(summary.gas) * 2.5;
  console.log(
    `         ${summary.name}: ${summary.interests} interests / ${summary.properties} properties`,
  );
  console.log(
    `         ${num(summary.oil).toFixed(0)} bbl/mo, ${num(summary.gas).toFixed(0)} mcf/mo → $${rev.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo` +
      `  (${summary.allocated} allocated, ${summary.unpriced} unpriced)`,
  );
}

// ---- 3. positions ----------------------------------------------------
const positions = await step(`getOwnerPositions(${ownerId})`, async () => {
  const { rows } = await client.query(
    `SELECT mi.interest_id, l.property_id, COALESCE(p.name,l.name) AS property_name,
            c.name AS county, l.rrc_lease_no,
            COALESCE(op.name, mi.operator_name) AS operator,
            mi.interest_type, b.revenue_decimal, b.revenue_basis, b.tracts,
            rr.royalty_rate, mi.market_value,
            COALESCE(lr.oil_bbl_per_month,0) AS oil_bbl_per_month,
            COALESCE(lr.gas_mcf_per_month,0) AS gas_mcf_per_month,
            COALESCE(lr.months_covered,0) AS months_covered
       FROM core.mineral_interests mi
       JOIN core.counties c ON c.county_id = mi.county_id
       LEFT JOIN core.leases l ON l.lease_id = mi.lease_id
       LEFT JOIN core.properties p ON p.property_id = l.property_id
       LEFT JOIN core.operators op ON op.operator_id = l.operator_id
       LEFT JOIN core.interest_revenue_basis b ON b.interest_id = mi.interest_id
       LEFT JOIN core.property_royalty_rate rr ON rr.property_id = l.property_id
       LEFT JOIN core.lease_production_rate lr ON lr.lease_id = mi.lease_id
      WHERE mi.owner_id = $1 AND mi.interest_type IN ('RI','ORRI')
      ORDER BY COALESCE(lr.oil_bbl_per_month,0) * COALESCE(b.revenue_decimal,0) DESC NULLS LAST`,
    [ownerId],
  );
  if (!rows.length) throw new Error("no positions");
  return rows;
});
if (positions) {
  console.log(`         ${positions.length} positions; top 3:`);
  for (const p of positions.slice(0, 3)) {
    const d = num(p.revenue_decimal);
    const rev = num(p.oil_bbl_per_month) * d * 60 + num(p.gas_mcf_per_month) * d * 2.5;
    console.log(
      `           ${String(p.property_name).slice(0, 26).padEnd(27)} dec=${d.toFixed(8)} ` +
        `${String(p.revenue_basis).padEnd(10)} $${rev.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo`,
    );
  }
}

// ---- 4. the numeric-as-string trap -----------------------------------
await step("numeric columns are strings, and num() handles it", async () => {
  const { rows } = await client.query(
    `SELECT revenue_decimal, allocation_factor FROM core.interest_revenue_basis
      WHERE revenue_decimal IS NOT NULL LIMIT 1`,
  );
  const raw = rows[0].revenue_decimal;
  if (typeof raw !== "string") {
    throw new Error(`expected a string from numeric, got ${typeof raw} — the ` +
      `guard in queries.ts may be unnecessary, or a type parser is installed`);
  }
  if (raw + 1 === num(raw) + 1) throw new Error("string/number coercion is ambiguous here");
  return raw;
});

// ---- 5. platform stats ----------------------------------------------
await step("getPlatformStats()", async () => {
  const { rows } = await client.query(
    `SELECT (SELECT count(*) FROM core.mineral_interests) AS interests,
            (SELECT count(*) FROM core.owners) AS owners,
            (SELECT count(*) FROM core.leases) AS leases,
            (SELECT count(DISTINCT county_id) FROM core.mineral_interests) AS counties`,
  );
  const s = rows[0];
  console.log(
    `         ${num(s.interests).toLocaleString()} interests · ${num(s.owners).toLocaleString()} owners · ` +
      `${num(s.leases).toLocaleString()} leases · ${s.counties} counties`,
  );
  return s;
});

await client.end();
console.log(`\n  ${failures ? `${failures} FAILURE(S)` : "all query checks passed"}\n`);
process.exit(failures ? 1 : 0);
