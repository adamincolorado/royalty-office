import Link from "next/link";
import { CashflowChart } from "@/components/charts/CashflowChart";
import { StatusPill } from "@/components/StatusPill";
import { getAlerts, getDeck, getOperators, getOwner, ownerPositions } from "@/lib/data";
import { forecastNet, historyNet, mergeSeries, sumNet } from "@/lib/cashflow";
import { money, monthLabel, num } from "@/lib/format";

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
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {owner.name}
        </h1>
        <p className="text-[13px] text-ink-3">
          {positions.length} interests · 3 counties · {operators.length} operators
        </p>
      </div>

      {/* stat row */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            k: "Net cashflow, trailing 12 mo", v: money(ttm),
            d: "modeled at the demo deck",
          },
          {
            k: "Next 12 months at strip", v: money(next12),
            d: `deck as of ${deck.asOf}`,
          },
          { k: "Producing wells", v: `${producing} of ${positions.length}`, d: "1 shut-in — see alerts" },
          { k: "Alerts this month", v: String(alerts.length), d: "permit · status · operator" },
        ].map((s) => (
          <div key={s.k} className="card px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{s.k}</p>
            <p className="figures mt-1.5 text-[26px] font-semibold leading-none text-pine">{s.v}</p>
            <p className="mt-1.5 text-[12px] text-ink-3">{s.d}</p>
          </div>
        ))}
      </div>

      {/* cashflow chart */}
      <div className="card mt-6 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl font-semibold">Monthly net cashflow</h2>
          <p className="text-[12px] text-ink-3">
            24 months history · 12 months forecast · net to your decimals
          </p>
        </div>
        <div className="mt-4">
          <CashflowChart history={histSeries} forecast={fcSeries} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12.5px] text-ink-3">
            Solid: modeled from reported production. Outlined: decline forecast
            priced at the {deck.label.toLowerCase()} ({deck.asOf}).
          </p>
          <Link href="/app/cashflow" className="text-[13px] font-semibold text-pine hover:underline">
            Open forecast center →
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* top positions */}
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">Your biggest positions</h2>
            <Link href="/app/wells" className="text-[13px] font-semibold text-pine hover:underline">
              All wells →
            </Link>
          </div>
          <table className="mt-3 w-full border-collapse">
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
        <div className="card p-5">
          <h2 className="font-display text-xl font-semibold">Watching for you</h2>
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
