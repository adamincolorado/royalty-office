/**
 * Data access layer.
 *
 * Today this reads the committed demo dataset. In production it becomes a
 * thin client over the Royalty Office data-plane API (FastAPI) — the
 * function signatures are the contract, so swapping the source touches this
 * file only.
 */
import demoJson from "@/data/demo.json";
import type {
  DemoData, Well, Operator, County, Interest, Owner, Deck, Alert, ClaimHit,
  WellEvent, UpcomingWell,
} from "./types";

const db = demoJson as unknown as DemoData;

export function getOwner(): Owner { return db.owner; }
export function getDeck(): Deck { return db.deck; }
export function getAlerts(): Alert[] { return db.alerts; }
export function getEvents(): WellEvent[] { return db.events; }
export function getUpcoming(): UpcomingWell { return db.upcoming; }
export function getCounties(): County[] { return db.counties; }
export function getOperators(): Operator[] { return db.operators; }
export function getWells(): Well[] { return db.wells; }
export function latestMonth(): string { return db.now; }

export function getCounty(slug: string): County | undefined {
  return db.counties.find((c) => c.slug === slug);
}
export function getOperator(slug: string): Operator | undefined {
  return db.operators.find((o) => o.slug === slug);
}
export function getWell(api: string): Well | undefined {
  return db.wells.find((w) => w.api === api);
}
export function wellsByOperator(slug: string): Well[] {
  return db.wells.filter((w) => w.operatorSlug === slug);
}
export function wellsByCounty(slug: string): Well[] {
  return db.wells.filter((w) => w.countySlug === slug);
}

/** The demo owner's interests joined to wells. */
export function ownerPositions(): { interest: Interest; well: Well }[] {
  return db.owner.interests
    .map((interest) => {
      const well = getWell(interest.api);
      return well ? { interest, well } : null;
    })
    .filter((x): x is { interest: Interest; well: Well } => x !== null);
}

export function searchClaims(q: string): ClaimHit[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 3) return [];
  return db.claimIndex.filter((hit) =>
    hit.match.some((m) => m.includes(needle) || needle.includes(m)) ||
    hit.name.toLowerCase().includes(needle),
  );
}

/** Portfolio-level roll-up statistics used across the app. */
export const PLATFORM_STATS = {
  interests: "7.9 million",
  owners: "965,000",
  wellLinks: "548,000",
  counties: "254",
};
