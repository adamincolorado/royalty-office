import { NextRequest, NextResponse } from "next/server";

/** Demo session: sets a cookie and redirects into the app. Replaced by real
 *  auth (Clerk) before public launch — the /app layout only checks this
 *  cookie, so the swap is one file there and one here.
 *
 *  The redirect is built from the request's Host header, NOT req.url: when
 *  the server binds 0.0.0.0 (dev over Tailscale), req.url carries the bind
 *  address and the browser would be redirected to http://0.0.0.0:3000. */
function safePath(to: string | null): string {
  if (!to || !to.startsWith("/") || to.startsWith("//")) return "/app";
  return to;
}

export function GET(req: NextRequest) {
  const to = safePath(req.nextUrl.searchParams.get("to"));
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const res = NextResponse.redirect(`${proto}://${host}${to}`, 302);
  res.cookies.set("ro_demo_session", "hargrove", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
