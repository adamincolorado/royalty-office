/**
 * Public claim-funnel search. Pre-signup by design — the funnel's whole job
 * is to answer "do we have you" before asking for anything — so there is no
 * auth here, and the response carries only what the index itself holds:
 * public-record aggregates. Never detail, never a forecast, never a price.
 */
import { NextRequest, NextResponse } from "next/server";
import { searchIndex } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 3) {
    return NextResponse.json({ hits: [], reason: "min-3-chars" });
  }
  try {
    const hits = await searchIndex(q);
    return NextResponse.json({ hits });
  } catch (err) {
    console.error("claim search failed", err);
    return NextResponse.json(
      { hits: [], reason: "search-unavailable" },
      { status: 503 },
    );
  }
}
