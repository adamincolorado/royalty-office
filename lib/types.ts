/** Shared domain types. The demo JSON conforms to these; the future
 *  production data-plane API will return the same shapes. */

export type WellStatus = "producing" | "shut-in" | "plugged";

export interface MonthVol {
  month: string; // YYYY-MM
  oil: number;   // bbl (lease-allocated gross)
  gas: number;   // mcf
}

export interface WellParams {
  qi: number;        // BOE/mo at first production
  di: number;        // nominal monthly Arps decline
  b: number;
  terminal: number;  // terminal effective annual decline
  oilFrac: number;
  fitQuality: string;
}

export interface Well {
  api: string;
  name: string;
  lease: string;
  operatorSlug: string;
  countySlug: string;
  county: string;
  status: WellStatus;
  drillType: "H" | "V";
  formation: string;
  lateralFt: number | null;
  firstProd: string;
  lastReported: string;
  params: WellParams;
  hist: MonthVol[];
}

export interface Interest {
  id: string;
  api: string;
  decimal: number;
  type: "RI" | "ORRI";
  sourceRef: string;
}

export interface Owner {
  name: string;
  shortName: string;
  mailingCity: string;
  interests: Interest[];
}

export interface Operator {
  slug: string;
  name: string;
  hq: string;
  phone: string;
  ownerRelations: string;
  county: string;
  profile: string;
}

export interface County {
  slug: string;
  name: string;
  basin: string;
  seatedIn: string;
  region: string;
  blurb: string;
  producingWells: number;
  activeOperators: number;
  permitsLast12: number;
}

export interface DeckMonth {
  month: string;
  wti: number;
  hh: number;
}

export interface Deck {
  label: string;
  asOf: string;
  note: string;
  months: DeckMonth[];
  basis: { oil: number; gasPct: number };
  severance: { oil: number; gas: number };
  deducts: { oil: number; gas: number };
}

export interface Alert {
  id: string;
  date: string;
  kind: "permit" | "status" | "operator";
  title: string;
  body: string;
  api: string | null;
  county: string;
}

export type EventKind =
  | "permit_filed" | "permit_amended" | "pad_detected" | "frac_expected"
  | "frac_disclosed" | "completed" | "completion_expected"
  | "first_production" | "first_check" | "shut_in" | "plugged";

/** A detected (or projected) well-lifecycle event. `confidence` is the
 *  owner-match tier: unit = on a unit you collect on; abstract = same survey
 *  abstract; proximity = near your wells. */
export interface WellEvent {
  id: string;
  api: string | null;
  wellName: string;
  county: string;
  date: string;
  kind: EventKind;
  source: string;
  confidence: "unit" | "abstract" | "proximity";
  projected: boolean;
  title: string;
  detail: string;
}

export interface TimelineStep {
  date: string;
  kind: EventKind;
  title: string;
  source: string;
  projected: boolean;
}

/** A permitted-but-not-yet-producing well being tracked to first check. */
export interface UpcomingWell {
  id: string;
  name: string;
  lease: string;
  operatorSlug: string;
  county: string;
  countySlug: string;
  formation: string;
  permitDate: string;
  plannedLateralFt: number;
  expectedFirstCheckBy: string;
  firstCheckRule: string;
  timeline: TimelineStep[];
}

export interface ClaimHit {
  name: string;
  county: string;
  interests: number;
  match: string[];
}

export interface DemoData {
  generated: string;
  now: string;
  counties: County[];
  operators: Operator[];
  wells: Well[];
  owner: Owner;
  deck: Deck;
  alerts: Alert[];
  events: WellEvent[];
  upcoming: UpcomingWell;
  claimIndex: ClaimHit[];
}

/** One month of projected cashflow, net to a decimal. */
export interface CashMonth {
  month: string;
  grossOil: number;   // bbl
  grossGas: number;   // mcf
  netRevenue: number; // $ net to the decimal after burdens
}
