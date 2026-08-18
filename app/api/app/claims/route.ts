/**
 * Claim management for the signed-in user. Clerk-authenticated; the user_id
 * written is always the CALLER's app.users row — the client never chooses
 * whose claim it is, only which public-record owner to attach.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/user";
import { createClaim, requestCountyLoad } from "@/lib/claims";
import { searchOwners } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  // Owner search inside the claim-attach flow: detail-loaded counties only,
  // because a claim needs a core.owners row to attach to.
  const term = (req.nextUrl.searchParams.get("q") || "").trim();
  if (term.length < 3) return NextResponse.json({ hits: [] });
  const hits = await searchOwners(term);
  return NextResponse.json({ hits });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const appUser = await getOrCreateUser();
  if (!appUser) return NextResponse.json({ error: "no-account" }, { status: 401 });

  let body: { ownerId?: number; county?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  // Two request shapes: attach a claim to a loaded owner, or ask for a
  // county that is only indexed to be detail-loaded.
  if (body.county && !body.ownerId) {
    const county = String(body.county).slice(0, 40);
    await requestCountyLoad(county, appUser.user_id);
    return NextResponse.json({ ok: true, queued: county });
  }
  const ownerId = Number(body.ownerId);
  if (!Number.isInteger(ownerId) || ownerId <= 0) {
    return NextResponse.json({ error: "bad-owner" }, { status: 400 });
  }
  const res = await createClaim(appUser.user_id, ownerId);
  if (!res.ok) return NextResponse.json({ error: res.reason }, { status: 409 });
  return NextResponse.json({ ok: true, claimId: res.claimId, already: res.already });
}
