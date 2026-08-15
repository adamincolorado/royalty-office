import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeck, ownerPositions } from "@/lib/data";
import { forecastNet, historyNet, sumNet } from "@/lib/cashflow";
import { money, num } from "@/lib/format";

export const metadata = { title: "Offer RO-2026-0001" };

/** The offer presentation — disclosure first, then both offers, then the
 *  math. All figures computed live from the same model the rest of the app
 *  uses, so the offer can never drift from the numbers the owner already
 *  trusts. */
export default function OfferPage({ params }: { params: { id: string } }) {
  if (params.id !== "RO-2026-0001") notFound();

  const deck = getDeck();
  const pos = ownerPositions().filter((p) => p.well.lease === "RANCHERO STATE UNIT");
  const next12 = pos.reduce((s, p) => s + sumNet(forecastNet(p.well, p.interest, deck, 12)), 0);
  const next36 = pos.reduce((s, p) => s + sumNet(forecastNet(p.well, p.interest, deck, 36)), 0);
  const ttm = pos.reduce((s, p) => s + sumNet(historyNet(p.well, p.interest, deck, 12)), 0);

  const theirs = Math.round((next12 * 2.6) / 500) * 500;
  const ours = Math.round((next12 * 4.0) / 500) * 500;
  const diff = ours - theirs;
  const mult = (v: number, base: number) => (v / base).toFixed(1) + "×";

  return (
    <div>
      <p className="text-[13px]">
        <Link href="/app/offers" className="text-pine hover:underline">← Offers</Link>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Offer <span className="figures">RO-2026-0001</span>
        </h1>
        <span className="rounded-full bg-pine-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-pine">
          Open · valid 30 days
        </span>
      </div>
      <p className="mt-1.5 text-[14px] text-ink-2">
        Purchase of your {pos.length} RANCHERO STATE UNIT interests · Reeves
        County · Wolfcamp A
      </p>

      {/* DISCLOSURE FIRST — non-negotiable placement */}
      <div className="card relative mt-5 overflow-hidden border-brass/60 p-5 ring-1 ring-brass/30 sm:mt-6">
        <div className="hairline-brass absolute inset-x-0 top-0" aria-hidden="true" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brass-deep">
          Who is making this offer
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          This competing offer is made by <strong className="text-ink">Alamo
          Exploration LLC</strong>, an affiliate of Royalty Office.{" "}
          <strong className="text-ink">We are the buyer.</strong> We do not
          represent you, we are not your advisor, and this page is not a
          valuation of your property or a recommendation to sell. This is an
          arms-length indication of interest, subject to title verification
          and a definitive purchase agreement. <strong className="text-ink">
          We encourage you to shop this bid</strong> — to other buyers, and to
          your own attorney or advisor — before deciding anything.
        </p>
      </div>

      {/* the two offers */}
      <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
            The offer you received
          </p>
          <p className="figures mt-2 text-3xl font-semibold text-ink">{money(theirs)}</p>
          <p className="mt-1.5 text-[13px] text-ink-3">
            {mult(theirs, next12)} your next-12-month cashflow at strip
          </p>
        </div>
        <div className="card relative overflow-hidden border-pine p-5 ring-1 ring-pine/40 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brass-deep">
            Alamo Exploration competing offer
          </p>
          <p className="figures mt-2 text-3xl font-semibold text-pine">{money(ours)}</p>
          <p className="mt-1.5 text-[13px] text-ink-2">
            {mult(ours, next12)} your next-12-month cashflow at strip ·{" "}
            <strong className="text-pine">{money(diff)} more</strong>
          </p>
        </div>
      </div>

      {/* the math */}
      <div className="card mt-5 p-5 sm:mt-6 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl font-semibold">The math, side by side</h2>
          <p className="text-[12px] text-ink-3">
            same model as your dashboard · deck as of {deck.asOf}
          </p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse">
            <thead>
              <tr>
                <th className="table-th">Your position ({pos.length} interests)</th>
                <th className="table-th text-right">Model figure</th>
                <th className="table-th text-right">Their offer implies</th>
                <th className="table-th text-right">Our offer implies</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-td">Trailing 12 mo net (modeled)</td>
                <td className="table-td figures text-right">{money(ttm)}</td>
                <td className="table-td figures text-right">{mult(theirs, ttm)}</td>
                <td className="table-td figures text-right font-semibold text-pine">{mult(ours, ttm)}</td>
              </tr>
              <tr>
                <td className="table-td">Next 12 mo at strip</td>
                <td className="table-td figures text-right">{money(next12)}</td>
                <td className="table-td figures text-right">{mult(theirs, next12)}</td>
                <td className="table-td figures text-right font-semibold text-pine">{mult(ours, next12)}</td>
              </tr>
              <tr>
                <td className="table-td">Next 36 mo at strip</td>
                <td className="table-td figures text-right">{money(next36)}</td>
                <td className="table-td figures text-right">{mult(theirs, next36)}</td>
                <td className="table-td figures text-right font-semibold text-pine">{mult(ours, next36)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">
          Multiples are the offer divided by each model figure. The model is
          the same decline-curve, strip-priced estimate shown throughout your
          account — an estimate, not a valuation. A &ldquo;fair&rdquo;
          multiple depends on decline, development upside, and your own
          situation; that judgment is yours and your advisors&rsquo;, not ours.
        </p>
      </div>

      {/* next steps */}
      <div className="card mt-5 flex flex-wrap items-center justify-between gap-4 p-5 sm:mt-6 sm:p-6">
        <div className="max-w-xl">
          <h2 className="font-display text-xl font-semibold">No pressure — that&rsquo;s the point</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
            This offer stands for 30 days. Take it to another buyer, your
            attorney, your family. If we&rsquo;re outbid, good — that&rsquo;s
            the market working, and your subscription is unaffected either way.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a href="mailto:desk@royaltyoffice.com?subject=Offer RO-2026-0001" className="btn-primary">
            Talk to the desk
          </a>
          <button className="btn-secondary cursor-not-allowed opacity-60" disabled>
            Decline (demo)
          </button>
        </div>
      </div>

      <p className="mt-6 text-[11.5px] leading-relaxed text-ink-3">
        Demo transaction on fictional interests. In production: both offers,
        every disclosure render, and your consent are permanently ledgered;
        the desk cannot see your submission until the consent on the request
        was recorded; and closing runs through a title company with a
        definitive agreement — never sight drafts.
      </p>
    </div>
  );
}
