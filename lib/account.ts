/**
 * Account actions reachable from an email link, without a login.
 *
 * Both are keyed on app.users.unsubscribe_token — a uuid with a unique
 * index, unguessable, and the only credential a recipient has when they
 * are reading a message in a mail client. Requiring a login to unsubscribe
 * is exactly the pattern CAN-SPAM's "without any requirement other than
 * sending a reply" language exists to prevent.
 */
import { q, q1 } from "./db";

export type UnsubResult =
  | { ok: true; email: string; alreadyDone: boolean }
  | { ok: false; reason: "unknown-token" };

/**
 * Suppress an address. Keyed by ADDRESS, not user: a request to stop is a
 * fact about the mailbox, so the same address on a second account stays
 * suppressed. Idempotent — a mail client that prefetches the link, or a
 * second click, changes nothing.
 */
export async function unsubscribeByToken(token: string): Promise<UnsubResult> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return { ok: false, reason: "unknown-token" };

  const user = await q1<{ email: string }>(
    `SELECT email FROM app.users WHERE unsubscribe_token = $1 AND email IS NOT NULL`,
    [token],
  );
  if (!user) return { ok: false, reason: "unknown-token" };

  const rows = await q(
    `INSERT INTO app.email_suppressions (email, reason, detail)
     VALUES ($1, 'unsubscribed', 'one-click link')
     ON CONFLICT (email) DO NOTHING
     RETURNING email`,
    [user.email],
  );

  // Also drop anything already queued but not yet sent — an unsubscribe
  // that still lets tomorrow's queued nudge go out is not an unsubscribe.
  await q(
    `UPDATE app.email_sends SET failed_at = now(), last_error = 'unsubscribed'
      WHERE email = $1 AND sent_at IS NULL AND failed_at IS NULL`,
    [user.email],
  );

  return { ok: true, email: user.email, alreadyDone: rows.length === 0 };
}

export type AcceptResult =
  | { ok: true; days: number; expiresAt: string; alreadyActive: boolean }
  | { ok: false; reason: "unknown-token" | "bad-seq" };

const TRIAL_DAYS = 15;

/**
 * Take a win-back offer. The clock starts NOW, not when the offer was sent,
 * so a reply three days later is not silently shortened.
 *
 * UNIQUE (user_id, seq) means a second click cannot stack a second trial or
 * extend the window — the ON CONFLICT keeps the original dates.
 */
export async function acceptTrialByToken(
  token: string,
  seq: number,
): Promise<AcceptResult> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return { ok: false, reason: "unknown-token" };
  if (![2, 3].includes(seq)) return { ok: false, reason: "bad-seq" };

  const user = await q1<{ user_id: number }>(
    `SELECT user_id FROM app.users WHERE unsubscribe_token = $1 AND deleted_at IS NULL`,
    [token],
  );
  if (!user) return { ok: false, reason: "unknown-token" };

  const row = await q1<{ expires_at: string; inserted: boolean }>(
    `INSERT INTO app.trials (user_id, seq, plan, offered_at, started_at, expires_at)
     VALUES ($1, $2, 'owner', now(), now(), now() + ($3 || ' days')::interval)
     ON CONFLICT (user_id, seq) DO UPDATE
       SET started_at = COALESCE(app.trials.started_at, EXCLUDED.started_at),
           expires_at = COALESCE(app.trials.expires_at, EXCLUDED.expires_at)
     RETURNING expires_at, (xmax = 0) AS inserted`,
    [user.user_id, seq, TRIAL_DAYS],
  );

  return {
    ok: true,
    days: TRIAL_DAYS,
    expiresAt: String(row?.expires_at ?? ""),
    alreadyActive: !row?.inserted,
  };
}
