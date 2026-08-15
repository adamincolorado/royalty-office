/**
 * Postgres client.
 *
 * Connects as `ro_app`, which holds SELECT ONLY on `core` — the structural
 * guarantee that a compromised web tier cannot corrupt the public-record
 * store. Verified against the live database: INSERT/UPDATE/DELETE on core
 * and on bridge.job_results are refused; app.* and bridge.jobs are writable.
 * Never point this at `DATABASE_URL`, which authenticates as the project
 * owner and can write everything.
 *
 * POOLING. Vercel runs each request in its own short-lived instance, so this
 * must use Neon's `-pooler` host (PgBouncer). `RO_APP_DATABASE_URL` is
 * expected to carry it. `max: 1` because the serverless instance handles one
 * request at a time — a larger local pool multiplies connections against the
 * pooler's own limit for no gain. The module-level singleton survives warm
 * invocations; the `globalThis` stash keeps `next dev` from opening a new
 * pool on every hot reload.
 */
import { Pool } from "pg";

const CONNECTION_ENV = "RO_APP_DATABASE_URL";

declare global {
  // eslint-disable-next-line no-var
  var __roPool: Pool | undefined;
}

function makePool(): Pool {
  const connectionString = process.env[CONNECTION_ENV];
  if (!connectionString) {
    throw new Error(
      `${CONNECTION_ENV} is not set. The site reads the database as the ` +
        `least-privilege role ro_app; see ops/royalty_office/db/003_roles_grants.sql.`,
    );
  }
  if (!connectionString.includes("-pooler")) {
    // Not fatal — a direct connection works — but on Vercel it exhausts the
    // connection limit under any real traffic, and that failure appears as
    // random 500s rather than anything pointing back here.
    console.warn(
      `[db] ${CONNECTION_ENV} is not the pooled Neon endpoint; serverless ` +
        `functions should use the -pooler host.`,
    );
  }
  return new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    // Neon terminates idle sessions; a query that outlives the request is
    // never useful to a viewer who has already been served an error.
    statement_timeout: 15_000,
  });
}

export function pool(): Pool {
  if (!global.__roPool) global.__roPool = makePool();
  return global.__roPool;
}

/** Run a parameterised query. Callers never build SQL by concatenation. */
export async function q<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await pool().query(text, params as never[]);
  return res.rows as T[];
}

/** First row or null. */
export async function q1<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await q<T>(text, params);
  return rows.length ? rows[0] : null;
}

/** True when a database is configured at all — lets pages fall back to the
 *  demo dataset in local development instead of failing to render. */
export function hasDatabase(): boolean {
  return Boolean(process.env[CONNECTION_ENV]);
}
