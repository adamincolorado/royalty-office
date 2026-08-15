import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const res = NextResponse.redirect(`${proto}://${host}/`, 302);
  res.cookies.set("ro_demo_session", "", { path: "/", maxAge: 0 });
  return res;
}
