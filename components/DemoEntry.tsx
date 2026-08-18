/**
 * The Hargrove demo tour, offered only where it exists.
 *
 * The demo mints a session for anyone who hits /api/demo-session, so in
 * production it would be an unauthenticated door into the app shell. Those
 * routes refuse outside development; this link hides itself to match, so the
 * sign-in page never advertises a button that 404s.
 */
export function DemoEntry() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="mt-8 rounded-md border border-dashed border-line bg-paper-deep p-4 text-center">
      <p className="text-[12px] leading-relaxed text-ink-3">
        Development only — tour the product as the Hargrove Family Mineral
        Trust, a fictional owner with twenty interests across three counties.
      </p>
      <a href="/api/demo-session?to=/app" className="btn-secondary mt-3 inline-block">
        Enter the demo
      </a>
    </div>
  );
}
