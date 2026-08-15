import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("ro_demo_session", "", { path: "/", maxAge: 0 });
  return res;
}
