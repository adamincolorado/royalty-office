import { NextRequest, NextResponse } from "next/server";

/** Demo session: sets a cookie and redirects into the app. Replaced by real
 *  auth (Clerk) before public launch — the /app layout only checks this
 *  cookie, so the swap is one file there and one here. */
export function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get("to") ?? "/app";
  const res = NextResponse.redirect(new URL(to, req.url));
  res.cookies.set("ro_demo_session", "hargrove", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
