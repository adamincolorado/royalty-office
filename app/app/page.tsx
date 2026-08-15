import Link from "next/link";
import { CashflowChart } from "@/components/charts/CashflowChart";
import { StatusPill } from "@/components/StatusPill";
import { getAlerts, getDeck, getOperators, getOwner, ownerPositions } from "@/lib/data";
import { forecastNet, historyNet, mergeSeries, sumNet } from "@/lib/cashflow";
import { money, monthLabel } from "@/lib/format";

export default function Dashboard() {
  const owner = getOwner();
  const deck = getDeck();
  const positions = ownerPositions();
  const operators = getOperators();

  const histSeries = mergeSeries(
    positions.map((p) => historyNet(p.well, p.interest, deck, 24)),
  );
  const fcSeries = mergeSeries(
    positions.map((p) => forecastNet(p.well, p.interest, deck, 12)),
  );
  const ttm = sumNet(histSeries.slice(-12));
  const next12 = sumNet(fcSeries);
  const producing = positions.filter((p) => p.well.status === "producing").length;
  const alerts = getAlerts();

  // biggest positions by next-12 value
  const ranked = positions
    .map((p) => ({ ...p, next12: sumNet(forecastNet(p.well, p.interest, deck, 12)) }))
    .sort((a, b) => b.next12 - a.next12)
    .slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {owner.name}
        </h1>
        <p className="text-[13px] text-ink-3">
          {positions.length} interests · 3 counties · {operators.length} operators
        </p>
      </div>

      {/* stat row — forward value leads, and is the hero on phones */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-4">
        <div className="card col-span-3 border-brass/60 px-5 py-4 ring-1 ring-brass/30 lg:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brass-deep">
            Next 12 months at strip
          </p>
          <p className="figures mt-1.5 text-[34px] font-semibold leading-none text-pine lg:text-[26px]">
            {money(next12)}
          </p>
          <p className="mt-1.5 text-[12px] text-ink-3">deck as of {deck.asOf}</p>
        </div>
        {[
          { k: "Trailing 12 mo", v: money(ttm), d: "modeled, demo deck" },
          { k: "Producing", v: `${producing}/${positions.length}`, d: "1 shut-in" },
          { k: "Alerts", v: String(alerts.length), d: "this month" },
        ].map((s) => (
          <div key={s.k} className="card px-3 py-3 sm:px-5 sm:py-4">
            <p className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-ink-3 sm:text-[11px]">
              {s.k}
            </p>
            <p className="figures mt-1.5 text-[19px] font-semibold leading-none text-pine sm:text-[26px]">
              {s.v}
            </p>
            <p className="mt-1.5 truncate text-[11px] text-ink-3 sm:text-[12px]">{s.d}</p>
          </div>
        ))}
      </div>

      {/* cashflow chart — full history on desktop, readable 12+6 on phones */}
      <div className="card mt-5 p-4 sm:mt-6 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-semibold sm:text-xl">Monthly net cashflow</h2>
          <p className="hidden text-[12px] text-ink-3 sm:block">
            24 months history · 12 months forecast · net to your decimals
          </p>
          <p className="text-[11.5px] text-ink-3 sm:hidden">12 mo history · 6 mo forecast</p>
        </div>
        <div className="mt-4 hidden sm:block">
          <CashflowChart history={histSeries} forecast={fcSeries} />
        </div>
        <div className="mt-3 sm:hidden">
          <CashflowChart compact history={histSeries.slice(-12)} forecast={fcSeries.slice(0, 6)} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="hidden text-[12.5px] text-ink-3 sm:block">
            Solid: modeled from reported production. Outlined: decline forecast
            priced at the {deck.label.toLowerCase()} ({deck.asOf}).
          </p>
          <Link href="/app/cashflow" className="text-[13px] font-semibold text-pine hover:underline">
            Open forecast center →
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* top positions — table on desktop, tappable card list on phones */}
        <div className="card p-4 sm:p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold sm:text-xl">Your biggest positions</h2>
            <Link href="/app/wells" className="text-[13px] font-semibold text-pine hover:underline">
              All wells →
            </Link>
          </div>

          {/* phone list */}
          <ul className="mt-2 divide-y divide-line-soft sm:hidden">
            {ranked.map((p) => (
              <li key={p.interest.id}>
                <Link
                  href={`/app/wells/${p.well.api}`}
                  className="flex items-center justify-between gap-3 py-3 active:bg-paper-deep"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-pine">{p.well.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-3">
                      <span className="truncate">{p.well.county} · {p.well.formation}</span>
                      {p.well.status !== "producing" && <StatusPill status={p.well.status} />}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="figures text-[16px] font-semibold text-pine">{money(p.next12)}</p>
                    <p className="text-[10.5px] uppercase tracking-wide text-ink-3">next 12 mo</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* desktop table */}
          <table className="mt-3 hidden w-full border-collapse sm:table">
            <thead>
              <tr>
                <th className="table-th">Well</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Your decimal</th>
                <th className="table-th text-right">Next 12 mo</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((p) => (
                <tr key={p.interest.id} className="hover:bg-paper-deep">
                  <td className="table-td">
                    <Link href={`/app/wells/${p.well.api}`} className="font-medium text-pine hover:underline">
                      {p.well.name}
                    </Link>
                    <span className="block text-[11.5px] text-ink-3">{p.well.county} · {p.well.formation}</span>
                  </td>
                  <td className="table-td"><StatusPill status={p.well.status} /></td>
                  <td className="table-td figures text-right text-[13px]">{p.interest.decimal.toFixed(8)}</td>
                  <td className="table-td figures text-right font-semibold text-pine">{money(p.next12)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* alerts */}
        <div className="card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold sm:text-xl">Watching for you</h2>
          <ul className="mt-3 space-y-4">
            {alerts.map((a) => (
              <li key={a.id} className="border-l-2 border-brass pl-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brass-deep">
                  {a.kind} · {monthLabel(a.date.slice(0, 7))}
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-snug">{a.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
