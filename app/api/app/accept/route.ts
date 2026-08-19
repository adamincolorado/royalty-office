import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/user";
import { recordAcceptance, hasAccepted } from "@/lib/consent";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const appUser = await getOrCreateUser();
  if (!appUser) return NextResponse.json({ error: "no-account" }, { status: 401 });

  if (await hasAccepted(appUser.user_id)) return NextResponse.json({ ok: true, already: true });

  // x-forwarded-for is a list; the first entry is the client per Vercel.
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  await recordAcceptance(appUser.user_id, {
    ip,
    userAgent: req.headers.get("user-agent"),
    sourceUrl: new URL(req.url).origin + "/accept",
  });
  return NextResponse.json({ ok: true });
}
