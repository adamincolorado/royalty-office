import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import Link from "next/link";
import { OfferRequestFlow } from "@/components/OfferRequestFlow";
import { getDeck, ownerPositions } from "@/lib/data";
import { forecastNet, sumNet } from "@/lib/cashflow";
import { money } from "@/lib/format";

export const metadata = { title: "Offers" };

export default async function OffersPage() {
  // Demo-only surface: nothing real behind it yet. A signed-in owner is
  // routed home rather than shown fiction.
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind !== "demo") redirect("/app");

  const deck = getDeck();
  const ranchero = ownerPositions().filter((p) => p.well.lease === "RANCHERO STATE UNIT");
  const next12 = ranchero.reduce((s, p) => s + sumNet(forecastNet(p.well, p.interest, deck, 12)), 0);
  const competing = Math.round((next12 * 4.0) / 500) * 500;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Offers</h1>
        <p className="text-[13px] text-ink-3">competing bids, on your initiative only</p>
      </div>

      {/* the standing disclosure — first, always */}
      <div className="card relative mt-5 overflow-hidden border-brass/60 p-5 ring-1 ring-brass/30 sm:mt-6 sm:p-6">
        <div className="hairline-brass absolute inset-x-0 top-0" aria-hidden="true" />
        <p className="eyebrow">Read this first</p>
        <h2 className="mt-2 font-display text-xl font-semibold">How the offer desk works — and who we are</h2>
        <div className="mt-3 grid gap-4 text-[14px] leading-relaxed text-ink-2 md:grid-cols-3">
          <p>
            <strong className="text-ink">Offers here come from Alamo Exploration LLC</strong> and
            its affiliates — the corporate family that operates Royalty Office.
            When we make you an offer, <strong className="text-ink">we are the buyer</strong>.
            We do not represent you, and nothing here is advice.
          </p>
          <p>
            <strong className="text-ink">Nothing happens unless you start it.</strong> We never
            prepare an offer from your portal activity or your uploads. An offer
            is prepared only when you submit a request through this page, with
            your per-request consent, for that stated purpose.
          </p>
          <p>
            <strong className="text-ink">Shop every bid — including ours.</strong> Our offers
            come with the math shown and a validity window, never pressure.
            Declining an offer — or all of them — never affects your
            subscription or your data.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* existing demo offer */}
        <div className="card p-5 sm:p-6">
          <p className="eyebrow">Your offers</p>
          <div className="mt-4 rounded-[4px] border border-line bg-paper px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="figures text-[13px] font-semibold text-ink-3">RO-2026-0001</p>
              <span className="rounded-full bg-pine-soft px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-pine">
                Competing offer ready
              </span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold">
              Purchase — your RANCHERO STATE UNIT interests
            </h3>
            <p className="mt-1 text-[13px] text-ink-2">
              You submitted a third-party offer for comparison. Our desk has
              prepared a competing bid of{" "}
              <span className="figures font-semibold text-pine">{money(competing)}</span>.
            </p>
            <Link href="/app/offers/RO-2026-0001" className="btn-primary mt-4 !px-4 !py-2 !text-[13px]">
              Review both offers, with the math →
            </Link>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
            Demo: this request and offer are pre-seeded so you can tour the
            full flow. In production this list is your complete, permanent
            offer history — every request, consent, disclosure, and offer
            version, timestamped.
          </p>
        </div>

        {/* new request flow */}
        <div className="card p-5 sm:p-6">
          <p className="eyebrow">Start a request</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Request a competing offer</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
            Received an offer to buy your minerals, or a lease proposal? Submit
            it and our desk will prepare a competing bid — with our valuation
            model shown right beside it.
          </p>
          <div className="mt-4">
            <OfferRequestFlow />
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11.5px] leading-relaxed text-ink-3">
        Offers are indications of interest, subject to title verification and a
        definitive purchase or lease agreement; they are not valuations of your
        property and create no obligation on you. See Disclosures and Terms.
      </p>
    </div>
  );
}
