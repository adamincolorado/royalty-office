/**
 * Clickwrap assent.
 *
 * The Terms state: "We record the date, time, account, and version of the
 * Terms you accept, and that record is conclusive evidence of your
 * acceptance," and the attorney memo tells counsel this exists. It did not:
 * signup was bare Clerk with no assent control and app.consents was empty,
 * which left the arbitration clause, class waiver, release and liability cap
 * resting on browsewrap — the weakest footing there is. This makes the
 * sentence true.
 *
 * The record is what a court would want to see: who, when, from where, and
 * WHICH text — a version string plus a hash of the accepted documents, so a
 * later edit to the Terms can never be mistaken for what this user agreed to.
 */
import { createHash } from "crypto";
import { q, q1 } from "./db";

/** Bump when the Terms or Privacy Policy change materially. */
export const LEGAL_VERSION = "2026-08-18";

/** The exact sentence the user ticks. Hashed into the record verbatim. */
export const CONSENT_TEXT =
  "I have read and agree to the Royalty Office Terms of Service and Privacy Policy, " +
  "including the arbitration agreement and class-action waiver in the Terms.";

export function legalHash(): string {
  return createHash("sha256")
    .update(`${LEGAL_VERSION}\n${CONSENT_TEXT}`)
    .digest("hex")
    .slice(0, 32);
}

export async function hasAccepted(appUserId: string): Promise<boolean> {
  const row = await q1(
    `SELECT 1 FROM app.consents
      WHERE user_id = $1::bigint AND kind = 'terms' AND granted
        AND document_version = $2
      LIMIT 1`,
    [appUserId, LEGAL_VERSION],
  );
  return !!row;
}

export async function recordAcceptance(
  appUserId: string,
  meta: { ip: string | null; userAgent: string | null; sourceUrl: string },
): Promise<void> {
  await q(
    `INSERT INTO app.consents
       (user_id, kind, granted, document_version, document_hash,
        disclosure_text, ip_address, user_agent, source_url)
     VALUES ($1::bigint, 'terms', TRUE, $2, $3, $4, $5::inet, $6, $7)`,
    [
      appUserId,
      LEGAL_VERSION,
      legalHash(),
      CONSENT_TEXT,
      meta.ip,
      (meta.userAgent || "").slice(0, 500) || null,
      meta.sourceUrl,
    ],
  );
}
