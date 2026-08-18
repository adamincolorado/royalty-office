/**
 * Clerk identity → our own user row.
 *
 * Clerk answers "who is this person". It does NOT answer "what may they
 * see" — entitlement is the verification ladder in app.users / claims
 * (unverified → address-verified by postcard PIN → document-verified), and
 * that stays in Postgres where it is logged, revocable and auditable. Never
 * treat a Clerk session as proof of an entitlement.
 *
 * Keyed on app.users.auth_sub, which 002_app_bridge.sql already defines as
 * "Clerk subject id" with a UNIQUE index — no new column needed.
 *
 * The row is created lazily on first authenticated request rather than by a
 * webhook: a webhook that is late, retried or lost would leave a signed-in
 * user with no row, and every page here needs the row to render. A
 * user.deleted webhook is still worth adding later for cleanup.
 */
import { auth, currentUser } from "@clerk/nextjs/server";
import { q1 } from "./db";

export type AppUser = {
  user_id: string;
  auth_sub: string | null;
  email: string | null;
  full_name: string | null;
};

const SELECT_COLS = "user_id::text, auth_sub, email::text, full_name";

/** The signed-in user's row, creating it on first sight. Null when signed out. */
export async function getOrCreateUser(): Promise<AppUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await q1<AppUser>(
    `SELECT ${SELECT_COLS} FROM app.users WHERE auth_sub = $1`,
    [userId],
  );
  if (existing) return existing;

  const cu = await currentUser();
  const email = cu?.primaryEmailAddress?.emailAddress ?? null;
  const fullName = [cu?.firstName, cu?.lastName].filter(Boolean).join(" ") || null;

  // Someone may already exist from the email side — a win-back offer or an
  // unsubscribe row is created without a login. Attach this Clerk identity to
  // that row instead of forking a second account and stranding their history.
  // email is citext, so the match is case-insensitive. There is no unique
  // index on email, so this is a deliberate lookup rather than ON CONFLICT.
  if (email) {
    const claimed = await q1<AppUser>(
      `UPDATE app.users
          SET auth_sub  = $1,
              full_name = COALESCE(full_name, $3)
        WHERE email = $2 AND auth_sub IS NULL AND deleted_at IS NULL
        RETURNING ${SELECT_COLS}`,
      [userId, email, fullName],
    );
    if (claimed) return claimed;
  }

  // ON CONFLICT (auth_sub): two requests from one fresh sign-in can race here
  // (Next renders layout and page concurrently), and the loser must read the
  // winner's row rather than raise.
  const row = await q1<AppUser>(
    `INSERT INTO app.users (auth_sub, email, full_name)
          VALUES ($1, $2, $3)
     ON CONFLICT (auth_sub) DO UPDATE
          SET full_name = COALESCE(app.users.full_name, EXCLUDED.full_name)
     RETURNING ${SELECT_COLS}`,
    [userId, email, fullName],
  );
  return row ?? null;
}
