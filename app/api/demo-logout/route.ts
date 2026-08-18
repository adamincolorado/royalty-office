import { NextRequest, NextResponse } from "next/server";

/** Demo endpoints are development-only. In production they would hand an
 *  unauthenticated caller a session cookie for the app shell, so they refuse
 *  outright rather than relying on nobody guessing the URL. */
function demoDisabled() {
  return process.env.NODE_ENV === "production";
}

export function GET(req: NextRequest) {
  if (demoDisabled()) return new NextResponse("Not found", { status: 404 });
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const res = NextResponse.redirect(`${proto}://${host}/`, 302);
  res.cookies.set("ro_demo_session", "", { path: "/", maxAge: 0 });
  return res;
}
