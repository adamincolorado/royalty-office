/**
 * Claim operations — linking an account to public-record ownership.
 *
 * A claim is NOT a title determination (ToS §6): overlapping claims are
 * allowed by design (heirs are messy), every claim is logged, and claims
 * are revocable. Claims are created 'pending'; verification (mailed PIN to
 * the roll address, or a check stub) moves them to 'verified' and unlocks
 * cashflow. Verification itself is operated out-of-band for the beta.
 *
 * Claims can only attach to owners in DETAIL-LOADED counties (core.owners).
 * For a county that is merely indexed, we enqueue a county_load job on
 * bridge.jobs — the on-demand build path (mig 017) — and the funnel tells
 * the owner what they'll see meanwhile.
 */
import { q, q1 } from "./db";

export type ClaimResult =
  | { ok: true; claimId: number; already: boolean }
  | { ok: false; reason: "owner-not-found" | "not-claimable" };

export async function createClaim(
  appUserId: string,
  ownerId: number,
): Promise<ClaimResult> {
  const owner = await q1<{ owner_id: string; barred: boolean | null }>(
    `SELECT o.owner_id,
            bool_or(NOT oi.is_claimable) AS barred
       FROM core.owners o
       LEFT JOIN core.owner_identities oi ON oi.owner_id = o.owner_id
      WHERE o.owner_id = $1
      GROUP BY o.owner_id`,
    [ownerId],
  );
  if (!owner) return { ok: false, reason: "owner-not-found" };
  if (owner.barred) return { ok: false, reason: "not-claimable" };

  // UNIQUE (user_id, owner_id): a double-click or a re-run attaches to the
  // existing claim instead of erroring or duplicating.
  const row = await q1<{ claim_id: string; inserted: boolean }>(
    `INSERT INTO app.owner_claims (user_id, owner_id, status, method)
          VALUES ($1::bigint, $2, 'pending', 'mail_pin')
     ON CONFLICT (user_id, owner_id) DO UPDATE SET user_id = app.owner_claims.user_id
     RETURNING claim_id, (xmax = 0) AS inserted`,
    [appUserId, ownerId],
  );
  return { ok: true, claimId: Number(row!.claim_id), already: !row!.inserted };
}

/**
 * Ask for a county to be detail-loaded. Queued jobs are consumed by
 * ops/royalty_office/etl/worker.py; a duplicate request for the same county
 * is folded into the existing queued job rather than queued again.
 */
export async function requestCountyLoad(
  county: string,
  appUserId: string | null,
): Promise<void> {
  const existing = await q1(
    `SELECT job_id FROM bridge.jobs
      WHERE kind = 'county_load' AND status = 'queued'
        AND payload->>'county' = $1`,
    [county],
  );
  if (existing) return;
  await q(
    `INSERT INTO bridge.jobs (kind, user_id, payload)
     VALUES ('county_load', $1::bigint, jsonb_build_object('county', $2::text))`,
    [appUserId, county],
  );
}
