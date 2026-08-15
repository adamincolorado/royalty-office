import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/StatusPill";
import { ProductionChart } from "@/components/charts/ProductionChart";
import { CashflowChart } from "@/components/charts/CashflowChart";
import { getDeck, getOperator, getWell, getOwner } from "@/lib/data";
import { forecastGross } from "@/lib/arps";
import { forecastNet, historyNet, sumNet } from "@/lib/cashflow";
import { money, monthLabel, num } from "@/lib/format";

export function generateMetadata({ params }: { params: { api: string } }) {
  const w = getWell(params.api);
  return { title: w ? w.name : "Well" };
}

export default function AppWellPage({ params }: { params: { api: string } }) {
  const well = getWell(params.api);
  if (!well) notFound();
  const owner = getOwner();
  const interest = owner.interests.find((i) => i.api === well.api);
  if (!interest) notFound();
  const deck = getDeck();
  const op = getOperator(well.operatorSlug);

  const histNet = historyNet(well, interest, deck, 24);
  const fcNet = forecastNet(well, interest, deck, 12);
  const ttm = sumNet(histNet.slice(-12));
  const next12 = sumNet(fcNet);

  return (
    <div>
      <p className="text-[13px]">
        <Link href="/app/wells" className="text-pine hover:underline">← Your wells</Link>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{well.name}</h1>
        <StatusPill status={well.status} />
      </div>
      <p className="mt-1.5 text-[14px] text-ink-2">
        API <span className="figures">{well.api}</span> · {op?.name} ·{" "}
        {well.county} County · {well.formation}
        {well.lateralFt ? ` · ${num(well.lateralFt)} ft lateral` : ""}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Your decimal", interest.decimal.toFixed(8), interest.type === "RI" ? "royalty interest" : "overriding royalty"],
          ["Trailing 12 mo, net", money(ttm), "modeled at demo deck"],
          ["Next 12 mo, modeled", money(next12), `deck as of ${deck.asOf}`],
          ["First production", monthLabel(well.firstProd), `data through ${monthLabel(well.lastReported)}`],
        ].map(([k, v, d]) => (
          <div key={k as string} className="card px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{k}</p>
            <p className="figures mt-1.5 text-[22px] font-semibold leading-none text-pine">{v}</p>
            <p className="mt-1.5 text-[12px] text-ink-3">{d}</p>
          </div>
        ))}
      </div>

      {well.status === "shut-in" && (
        <div className="mt-5 rounded-sm border border-brass bg-brass-soft px-5 py-4">
          <p className="text-sm font-semibold text-brass-deep">This well is shut in.</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">
            Zero volumes reported for 4 consecutive months. We forecast shut-in
            wells at zero — models describe what is, not what an operator might
            decide. If the rest of the lease is producing, your statements
            should still say so.
          </p>
        </div>
      )}

      <div className="card mt-6 p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">Production &amp; decline model</h2>
          <p className="text-[12px] text-ink-3">gross, lease-allocated</p>
        </div>
        <div className="mt-4 hidden sm:block">
          <ProductionChart hist={well.hist} forecast={forecastGross(well, 12)} />
        </div>
        <div className="mt-3 sm:hidden">
          <ProductionChart compact hist={well.hist.slice(-12)} forecast={forecastGross(well, 6)} />
        </div>
      </div>

      <div className="card mt-6 p-4 sm:p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold sm:text-xl">Your share, in dollars</h2>
          <p className="text-[12px] text-ink-3">net of severance &amp; modeled deducts</p>
        </div>
        <div className="mt-4 hidden sm:block">
          <CashflowChart history={histNet} forecast={fcNet} height={200} />
        </div>
        <div className="mt-3 sm:hidden">
          <CashflowChart compact history={histNet.slice(-12)} forecast={fcNet.slice(0, 6)} />
        </div>
      </div>

      <details className="card mt-6 p-5">
        <summary className="cursor-pointer font-display text-lg font-semibold text-pine">
          How was this computed?
        </summary>
        <div className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-ink-2">
          <p>
            <strong className="text-ink">Volumes.</strong> Monthly lease-level production
            from RRC filings, allocated to this well ({well.params.fitQuality} fit).
            Forward volumes follow a modified-Arps decline: b = {well.params.b},
            initial nominal decline {well.params.di}/mo, terminal{" "}
            {Math.round(well.params.terminal * 100)}%/yr, oil fraction{" "}
            {(well.params.oilFrac * 100).toFixed(0)}%.
          </p>
          <p>
            <strong className="text-ink">Prices.</strong> {deck.label} as of {deck.asOf}:
            WTI less ${Math.abs(deck.basis.oil).toFixed(2)} basis for oil;{" "}
            {Math.round(deck.basis.gasPct * 100)}% of Henry Hub for gas. Held flat
            beyond quoted tenors. {deck.note}
          </p>
          <p>
            <strong className="text-ink">Burdens.</strong> Texas severance
            ({(deck.severance.oil * 100).toFixed(1)}% oil, {(deck.severance.gas * 100).toFixed(1)}% gas)
            plus modeled post-production deducts ({(deck.deducts.oil * 100).toFixed(0)}% oil,{" "}
            {(deck.deducts.gas * 100).toFixed(0)}% gas). Upload statements to replace
            modeled deducts with your actuals.
          </p>
          <p>
            <strong className="text-ink">Your share.</strong> Net dollars ×{" "}
            <span className="figures">{interest.decimal.toFixed(8)}</span> ({interest.type}).
            Source: {interest.sourceRef}.
          </p>
        </div>
      </details>
    </div>
  );
}
