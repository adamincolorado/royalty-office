/**
 * Who is looking at /app, and what may they see?
 *
 * Three viewer kinds, resolved server-side on every /app request:
 *   demo  — the dev-only Hargrove tour (cookie, never in production).
 *   user  — a real Clerk account. Their data scope is their CLAIMS: rows in
 *           app.owner_claims joining core.owners. No claim, no data.
 *
 * ENTITLEMENT, RESTATED (DESIGN.md 1.2): a pending claim shows the public
 * record — the interest list, gross lease production, county context. Net
 * figures and forecasts unlock at 'verified'. A Clerk session is identity,
 * never entitlement; everything here re-reads app.owner_claims each time.
 */
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { q } from "./db";
import { getOrCreateUser, type AppUser } from "./user";

export interface Claim {
  claimId: number;
  ownerId: number;
  ownerName: string;
  counties: string[];
  status: "pending" | "verified" | "rejected" | "revoked";
  requestedAt: string;
}

export type Viewer =
  | { kind: "demo" }
  | { kind: "user"; appUser: AppUser; claims: Claim[] };

/** Claims that grant any visibility at all. Rejected/revoked grant nothing. */
export function activeClaims(v: Viewer): Claim[] {
  if (v.kind !== "user") return [];
  return v.claims.filter((c) => c.status === "pending" || c.status === "verified");
}

export function verifiedClaims(v: Viewer): Claim[] {
  if (v.kind !== "user") return [];
  return v.claims.filter((c) => c.status === "verified");
}

export async function getViewer(): Promise<Viewer | null> {
  const { userId } = await auth();
  if (userId) {
    const appUser = await getOrCreateUser();
    if (!appUser) return null;
    const rows = await q(
      `SELECT oc.claim_id, oc.owner_id, oc.status, oc.requested_at,
              o.name AS owner_name,
              array_remove(array_agg(DISTINCT c.name), NULL) AS counties
         FROM app.owner_claims oc
         JOIN core.owners o ON o.owner_id = oc.owner_id
         LEFT JOIN core.mineral_interests mi ON mi.owner_id = o.owner_id
         LEFT JOIN core.counties c ON c.county_id = mi.county_id
        WHERE oc.user_id = $1::bigint
        GROUP BY oc.claim_id, oc.owner_id, oc.status, oc.requested_at, o.name
        ORDER BY oc.requested_at`,
      [appUser.user_id],
    );
    return {
      kind: "user",
      appUser,
      claims: rows.map((r) => ({
        claimId: Number(r.claim_id),
        ownerId: Number(r.owner_id),
        ownerName: String(r.owner_name),
        counties: (r.counties as string[]) ?? [],
        status: r.status as Claim["status"],
        requestedAt: String(r.requested_at),
      })),
    };
  }
  if (process.env.NODE_ENV !== "production" && cookies().get("ro_demo_session")) {
    return { kind: "demo" };
  }
  return null;
}
