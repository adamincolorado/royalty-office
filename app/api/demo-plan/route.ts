import { NextRequest, NextResponse } from "next/server";

/** Demo plan switcher — lets the tour flip between Owner and Sentinel to see
 *  the monitoring gate. Production replaces this with Stripe webhooks. */
function safePath(to: string | null): string {
  if (!to || !to.startsWith("/") || to.startsWith("//")) return "/app/settings";
  return to;
}

export function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") === "owner" ? "owner" : "sentinel";
  const to = safePath(req.nextUrl.searchParams.get("to"));
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const res = NextResponse.redirect(`${proto}://${host}${to}`, 302);
  res.cookies.set("ro_demo_plan", plan, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
