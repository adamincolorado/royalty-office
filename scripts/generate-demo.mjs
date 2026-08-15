/**
 * Deterministic demo-data generator for Royalty Office.
 *
 * Everything here is FICTIONAL — owners, operators, leases and wells are
 * invented; counties and basins are real places with realistic (but invented)
 * statistics. The production profiles are generated from the same modified-Arps
 * decline math the app uses, plus seeded noise and downtime, so every chart in
 * the demo behaves like real Texas production without describing any real well.
 *
 * Regenerate with:  npm run generate-demo   (output is committed)
 */
import { writeFileSync } from "node:fs";

// ---- seeded PRNG (mulberry32) — same seed, same demo, forever --------------
let seed = 0x5eed2026;
function rand() {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const between = (a, b) => a + rand() * (b - a);

// ---- modified Arps (mirror of lib/arps.ts) ---------------------------------
function monthlyRate(qi, di, b, terminalAnnual, t) {
  const dmin = -Math.log(1 - terminalAnnual) / 12;
  if (b <= 0.001) return qi * Math.exp(-di * t);
  const dInst = di / (1 + b * di * t);
  if (dInst > dmin) return qi / Math.pow(1 + b * di * t, 1 / b);
  const tSw = (di / dmin - 1) / (b * di);
  const qSw = qi / Math.pow(1 + b * di * tSw, 1 / b);
  return qSw * Math.exp(-dmin * (t - tSw));
}

// ---- fixed clock: demo "today" is stable so the build is reproducible ------
const NOW = { y: 2026, m: 7 }; // 2026-07 = latest reported month (RRC lag baked in)
const ym = (y, m) => `${y}-${String(m).padStart(2, "0")}`;
function addMonths(y, m, k) {
  const idx = y * 12 + (m - 1) + k;
  return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
}

// ---- counties --------------------------------------------------------------
const counties = [
  {
    slug: "reeves", name: "Reeves", basin: "Delaware Basin (Permian)",
    seatedIn: "Pecos", region: "West Texas",
    blurb:
      "Reeves County sits in the heart of the Delaware Basin, the most active " +
      "slice of the Permian. Horizontal Wolfcamp and Bone Spring wells drilled " +
      "since 2016 dominate production, and new permits continue at a steady clip.",
    producingWells: 9840, activeOperators: 74, permitsLast12: 640,
  },
  {
    slug: "karnes", name: "Karnes", basin: "Eagle Ford Shale",
    seatedIn: "Karnes City", region: "South Texas",
    blurb:
      "Karnes County is the core of the Eagle Ford oil window. Wells here came " +
      "on hard in 2012–2015, decline steeply, and are increasingly candidates " +
      "for refracs — which can restart checks that had faded.",
    producingWells: 4310, activeOperators: 38, permitsLast12: 210,
  },
  {
    slug: "atascosa", name: "Atascosa", basin: "Eagle Ford Shale",
    seatedIn: "Jourdanton", region: "South Texas",
    blurb:
      "Atascosa County spans the Eagle Ford's oil window and its updip edge. " +
      "A mix of horizontal producers and older vertical wells means owner " +
      "checks vary widely lease to lease.",
    producingWells: 1610, activeOperators: 29, permitsLast12: 85,
  },
];

// ---- fictional operators ---------------------------------------------------
const operators = [
  {
    slug: "calloway-operating", name: "Calloway Operating Company",
    hq: "Midland, TX", phone: "(432) 555-0180",
    ownerRelations: "ownerrelations@calloway-demo.example",
    county: "reeves",
    profile:
      "A private Delaware Basin operator running a steady one-rig program. " +
      "Pays by the 25th; statements are detailed but dense.",
  },
  {
    slug: "bravo-ridge-resources", name: "Bravo Ridge Resources LLC",
    hq: "San Antonio, TX", phone: "(210) 555-0142",
    ownerRelations: "owners@bravoridge-demo.example",
    county: "karnes",
    profile:
      "Eagle Ford specialist focused on refrac candidates. Recently acquired " +
      "several legacy leases — ownership transfers are still settling.",
  },
  {
    slug: "pecan-creek-energy", name: "Pecan Creek Energy LLC",
    hq: "Corpus Christi, TX", phone: "(361) 555-0117",
    ownerRelations: "division.orders@pecancreek-demo.example",
    county: "atascosa",
    profile:
      "Small operator holding mature Atascosa County leases. Several wells " +
      "cycle between producing and shut-in with commodity prices.",
  },
];

// ---- wells -----------------------------------------------------------------
// Each entry: lease, operator, county, spec { vintage, class }.
const wellSpecs = [
  // Calloway / Reeves — modern Wolfcamp horizontals, two pads
  { lease: "RANCHERO STATE UNIT", op: "calloway-operating", county: "reeves", n: 4, drill: "H", formation: "Wolfcamp A", vintageY: 2022, qi: [17000, 26000], b: 1.05, d1: [0.62, 0.72], oilFrac: [0.72, 0.8], lateral: [9800, 10600] },
  { lease: "DELAWARE 44 UNIT", op: "calloway-operating", county: "reeves", n: 3, drill: "H", formation: "Bone Spring 3rd", vintageY: 2019, qi: [14000, 20000], b: 1.0, d1: [0.58, 0.68], oilFrac: [0.65, 0.74], lateral: [7300, 9900] },
  // Bravo Ridge / Karnes — 2013 vintage Eagle Ford + one 2024 refrac
  { lease: "HELENA GONZALES UNIT", op: "bravo-ridge-resources", county: "karnes", n: 5, drill: "H", formation: "Eagle Ford", vintageY: 2013, qi: [11000, 16000], b: 0.95, d1: [0.6, 0.7], oilFrac: [0.78, 0.86], lateral: [5200, 6800] },
  { lease: "CADDEL-SMYTH A", op: "bravo-ridge-resources", county: "karnes", n: 2, drill: "H", formation: "Eagle Ford (refrac 2024)", vintageY: 2024, qi: [9000, 12500], b: 1.0, d1: [0.55, 0.66], oilFrac: [0.8, 0.86], lateral: [6100, 6400] },
  // Pecan Creek / Atascosa — mature verticals + older horizontals
  { lease: "SANDOVAL RANCH", op: "pecan-creek-energy", county: "atascosa", n: 3, drill: "H", formation: "Eagle Ford (updip)", vintageY: 2015, qi: [6000, 9000], b: 0.9, d1: [0.5, 0.62], oilFrac: [0.82, 0.9], lateral: [4600, 5600] },
  { lease: "JBW HEIRS", op: "pecan-creek-energy", county: "atascosa", n: 3, drill: "V", formation: "Austin Chalk", vintageY: 2008, qi: [1400, 2400], b: 0.6, d1: [0.3, 0.42], oilFrac: [0.85, 0.95], lateral: null },
];

const wellNames = { 0: "1H", 1: "2H", 2: "3H", 3: "4H", 4: "5H" };
let apiSerial = 30001;
const wells = [];

for (const spec of wellSpecs) {
  for (let i = 0; i < spec.n; i++) {
    const county = counties.find((c) => c.slug === spec.county);
    const countyCode = { reeves: "389", karnes: "255", atascosa: "013" }[spec.county];
    const api = `42-${countyCode}-${apiSerial++}`;
    const firstY = spec.vintageY;
    const firstM = 1 + Math.floor(rand() * 11);
    const qi = between(spec.qi[0], spec.qi[1]);
    const d1 = between(spec.d1[0], spec.d1[1]);
    // effective-annual first-year decline -> nominal monthly Arps Di
    const b = spec.b;
    const di = b <= 0.001
      ? -Math.log(1 - d1) / 12
      : (Math.pow(1 - d1, -b) - 1) / (b * 12);
    const oilFrac = between(spec.oilFrac[0], spec.oilFrac[1]);
    const terminal = 0.07;

    // months of history from first prod through NOW
    const total = (NOW.y - firstY) * 12 + (NOW.m - firstM) + 1;
    const hist = [];
    let downtimeLeft = 0;
    for (let t = 0; t < total; t++) {
      const d = addMonths(firstY, firstM, t);
      let boe = monthlyRate(qi, di, b, terminal, t);
      // flowback ramp: first two months build up
      if (t === 0) boe *= 0.45;
      if (t === 1) boe *= 0.8;
      // occasional downtime (workover / weather), heavier on old verticals
      if (downtimeLeft > 0) { boe *= between(0, 0.25); downtimeLeft--; }
      else if (rand() < (spec.drill === "V" ? 0.05 : 0.025)) downtimeLeft = 1 + Math.floor(rand() * 2);
      // reporting noise
      boe *= between(0.93, 1.07);
      const oil = boe * oilFrac;
      const gas = boe * (1 - oilFrac) * 6.0; // mcf
      hist.push({ month: ym(d.y, d.m), oil: Math.round(oil), gas: Math.round(gas) });
    }

    // status: JBW HEIRS well #3 is shut-in; everything else producing
    let status = "producing";
    if (spec.lease === "JBW HEIRS" && i === 2) {
      status = "shut-in";
      for (let k = hist.length - 4; k < hist.length; k++) {
        hist[k].oil = 0; hist[k].gas = 0;
      }
    }

    wells.push({
      api,
      name: `${spec.lease} ${spec.drill === "V" ? `#${i + 1}` : wellNames[i]}`,
      lease: spec.lease,
      operatorSlug: spec.op,
      countySlug: spec.county,
      county: county.name,
      status,
      drillType: spec.drill,
      formation: spec.formation,
      lateralFt: spec.lateral ? Math.round(between(spec.lateral[0], spec.lateral[1])) : null,
      firstProd: ym(firstY, firstM),
      lastReported: ym(NOW.y, NOW.m),
      params: {
        qi: Math.round(qi),
        di: +di.toFixed(5),
        b,
        terminal,
        oilFrac: +oilFrac.toFixed(3),
        fitQuality: spec.vintageY >= 2024 ? "young — wide band" : "good",
      },
      hist,
    });
  }
}

// ---- the demo owner --------------------------------------------------------
// Decimals are realistic royalty-scale numbers.
const dec = () => +(between(0.0008, 0.0075)).toFixed(8);
const interests = wells.map((w, i) => ({
  id: `INT-${String(i + 1).padStart(3, "0")}`,
  api: w.api,
  decimal: dec(),
  type: rand() < 0.85 ? "RI" : "ORRI",
  sourceRef: `${w.county} CAD mineral roll 2026 · ${w.lease}`,
}));
// make the Ranchero position meaningfully larger (the "main family holding")
for (const it of interests) {
  const w = wells.find((x) => x.api === it.api);
  if (w.lease === "RANCHERO STATE UNIT") it.decimal = +(between(0.011, 0.016)).toFixed(8);
}

const owner = {
  name: "Hargrove Family Mineral Trust",
  shortName: "Hargrove Trust",
  mailingCity: "Boerne, TX",
  interests,
};

// ---- demo strip deck -------------------------------------------------------
// Fictional but shaped like a real curve: mild backwardation in oil, seasonal
// contango in gas. Labeled "demo" everywhere it appears.
const deckMonths = [];
let wti = 63.4, hh = 3.02;
for (let k = 0; k < 36; k++) {
  const d = addMonths(NOW.y, NOW.m, k + 1);
  deckMonths.push({
    month: ym(d.y, d.m),
    wti: +wti.toFixed(2),
    hh: +(hh + 0.28 * Math.sin(((d.m - 1) / 12) * Math.PI * 2 + 3.6)).toFixed(2),
  });
  wti = Math.max(59.5, wti - 0.11);
  hh = Math.min(3.55, hh + 0.012);
}
const deck = {
  label: "Demo strip — illustrative only",
  asOf: "2026-08-13",
  note:
    "Production deployment uses licensed NYMEX settlement prices. This demo " +
    "deck is fictional and exists so the forecast math can be shown working.",
  months: deckMonths,
  basis: { oil: -1.25, gasPct: 0.88 },
  severance: { oil: 0.046, gas: 0.075 },
  deducts: { oil: 0.02, gas: 0.1 },
};

// ---- alerts ----------------------------------------------------------------
const alerts = [
  {
    id: "AL-1", date: "2026-08-02", kind: "permit",
    title: "New well permitted on your RANCHERO STATE UNIT — 5H",
    body: "Calloway Operating filed a drilling permit for a fifth well on the Ranchero State Unit (Wolfcamp A, 10,400 ft planned lateral). You already collect on this unit, so a completed 5H would mean a new revenue stream. Follow its progress on the Monitoring tab.",
    api: null, county: "reeves",
  },
  {
    id: "AL-2", date: "2026-07-19", kind: "status",
    title: "JBW HEIRS #3 has stopped reporting production",
    body: "This well has reported zero volumes for 4 consecutive months. Older vertical wells are often shut in when prices soften — but if the rest of the lease is producing, your statements should say so. Worth watching.",
    api: null, county: "atascosa",
  },
  {
    id: "AL-3", date: "2026-07-08", kind: "operator",
    title: "Bravo Ridge Resources completed a refrac on CADDEL-SMYTH A",
    body: "The two Caddel-Smyth A wells were refractured in 2024 and are producing well above their pre-refrac trend. Your checks from Bravo Ridge should reflect the uplift — compare your statements against the modeled line.",
    api: null, county: "karnes",
  },
];

// ---- well events (the monitoring feed) -------------------------------------
// Detected events carry the public source and a match-confidence tier; the
// projected tail of a lifecycle is labeled projected and drawn dashed.
const events = [
  {
    id: "EV-1", api: null, wellName: "RANCHERO STATE UNIT 5H", county: "Reeves",
    date: "2026-08-02", kind: "permit_filed", source: "RRC W-1 (daily diff)",
    confidence: "unit", projected: false,
    title: "Drilling permit filed",
    detail: "Calloway Operating permitted a fifth Wolfcamp A well on your unit — 10,400 ft planned lateral.",
  },
  {
    id: "EV-2", api: null, wellName: "RANCHERO STATE UNIT 5H", county: "Reeves",
    date: "2026-08-12", kind: "pad_detected", source: "Sentinel-2 change detection",
    confidence: "unit", projected: false,
    title: "Pad construction detected from orbit",
    detail: "Cleared pad and new access road visible versus the Jul 28 pass. Ground work usually means a rig within weeks.",
  },
  {
    id: "EV-3", api: null, wellName: "JBW HEIRS #3", county: "Atascosa",
    date: "2026-07-19", kind: "shut_in", source: "RRC production diff",
    confidence: "unit", projected: false,
    title: "Well stopped reporting production",
    detail: "Zero volumes for 4 consecutive months — roughly $610 of your revenue not flowing while it stays down.",
  },
  {
    id: "EV-4", api: null, wellName: "CADDEL-SMYTH A 1H / 2H", county: "Karnes",
    date: "2024-09-15", kind: "completed", source: "RRC W-2 completion filing",
    confidence: "unit", projected: false,
    title: "Refrac completed",
    detail: "Both Caddel-Smyth A wells were refractured; production is running well above the pre-refrac trend.",
  },
];

// ---- the upcoming well: full permit -> first-check lifecycle ---------------
const upcoming = {
  id: "UP-1",
  name: "RANCHERO STATE UNIT 5H",
  lease: "RANCHERO STATE UNIT",
  operatorSlug: "calloway-operating",
  county: "Reeves",
  countySlug: "reeves",
  formation: "Wolfcamp A",
  permitDate: "2026-08-02",
  plannedLateralFt: 10400,
  expectedFirstCheckBy: "2027-06",
  firstCheckRule:
    "Texas Nat. Res. Code sec. 91.402: payment is due within ~120 days after " +
    "the end of the month of first sale. First production in Feb 2027 puts " +
    "your division order and first check no later than late June 2027.",
  timeline: [
    { date: "2026-08-02", kind: "permit_filed", title: "Permit filed", source: "RRC W-1", projected: false },
    { date: "2026-08-12", kind: "pad_detected", title: "Pad spotted from orbit", source: "Sentinel-2", projected: false },
    { date: "2026-11", kind: "frac_expected", title: "Frac job", source: "FracFocus disclosure", projected: true },
    { date: "2027-01", kind: "completion_expected", title: "Completion filed", source: "RRC W-2", projected: true },
    { date: "2027-02", kind: "first_production", title: "First production", source: "RRC production report", projected: true },
    { date: "2027-06", kind: "first_check", title: "Your first check due", source: "Tex. Nat. Res. Code 91.402", projected: true },
  ],
};

// ---- claim-search demo results ---------------------------------------------
const claimIndex = [
  { name: "Hargrove Family Mineral Trust", county: "Reeves, Karnes, Atascosa", interests: 20, match: ["hargrove", "hargrove family", "hargrove trust"] },
  { name: "Hargrove, Dolores Ann", county: "Karnes", interests: 3, match: ["hargrove", "dolores"] },
  { name: "Hargrave Minerals LP", county: "Reeves", interests: 11, match: ["hargrave", "hargrove"] },
];

const out = { generated: "deterministic — seed 0x5eed2026", now: ym(NOW.y, NOW.m), counties, operators, wells, owner, deck, alerts, events, upcoming, claimIndex };
writeFileSync(new URL("../data/demo.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(`wrote data/demo.json — ${wells.length} wells, ${interests.length} interests, ${deckMonths.length}-mo deck`);
