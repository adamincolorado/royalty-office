import Link from "next/link";
import { getDeck, getOperators, ownerPositions } from "@/lib/data";
import { forecastNet, historyNet, sumNet } from "@/lib/cashflow";
import { money, num } from "@/lib/format";

export const metadata = { title: "Your operators" };

export default function OperatorsPage() {
  const deck = getDeck();
  const positions = ownerPositions();
  const rows = getOperators().map((op) => {
    const mine = positions.filter((p) => p.well.operatorSlug === op.slug);
    return {
      op,
      wells: mine.length,
      producing: mine.filter((p) => p.well.status === "producing").length,
      ttm: mine.reduce((s, p) => s + sumNet(historyNet(p.well, p.interest, deck, 12)), 0),
      next12: mine.reduce((s, p) => s + sumNet(forecastNet(p.well, p.interest, deck, 12)), 0),
    };
  }).sort((a, b) => b.next12 - a.next12);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your operators</h1>
      <p className="mt-1 text-[13px] text-ink-3">
        Who pays you, how many of your wells they run, and what to expect from each.
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {rows.map((r) => (
          <Link key={r.op.slug} href={`/app/operators/${r.op.slug}`} className="card group p-6 no-underline">
            <h2 className="font-display text-xl font-semibold group-hover:text-pine">{r.op.name}</h2>
            <p className="mt-0.5 text-[12.5px] text-ink-3">{r.op.hq}</p>
            <dl className="mt-4 space-y-2 border-t border-line-soft pt-3">
              {[
                ["Your wells", `${num(r.wells)} (${num(r.producing)} producing)`],
                ["Trailing 12 mo, net", money(r.ttm)],
                ["Next 12 mo, modeled", money(r.next12)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between">
                  <dt className="text-[12.5px] text-ink-3">{k}</dt>
                  <dd className="figures text-[14.5px] font-semibold text-pine">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{r.op.profile}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
