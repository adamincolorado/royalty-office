"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { money, monthLabel, cn } from "@/lib/format";

interface PosMonth { month: string; net: number }
interface Position {
  id: string;
  well: string;
  api: string;
  county: string;
  operatorSlug: string;
  status: string;
  decimal: number;
  months: PosMonth[];
}
interface DeckView {
  label: string;
  asOf: string;
  note: string;
  months: { month: string; wti: number; hh: number }[];
}

const HORIZONS = [
  { key: 3, label: "3 months", short: "3 mo" },
  { key: 6, label: "6 months", short: "6 mo" },
  { key: 12, label: "12 months", short: "12 mo" },
  { key: 36, label: "36 months", short: "36 mo" },
];

export function ForecastCenter({
  positions,
  deck,
}: {
  positions: Position[];
  deck: DeckView;
}) {
  const [horizon, setHorizon] = useState(12);

  const { total, rows, monthly } = useMemo(() => {
    const rows = positions
      .map((p) => ({
        ...p,
        value: p.months.slice(0, horizon).reduce((s, m) => s + m.net, 0),
      }))
      .sort((a, b) => b.value - a.value);
    const total = rows.reduce((s, r) => s + r.value, 0);
    const monthly = new Map<string, number>();
    for (const p of positions) {
      for (const m of p.months.slice(0, horizon)) {
        monthly.set(m.month, (monthly.get(m.month) ?? 0) + m.net);
      }
    }
    return { total, rows, monthly: [...monthly.entries()].sort() };
  }, [positions, horizon]);

  const peak = Math.max(...monthly.map(([, v]) => v), 1);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Cashflow &amp; forecast
          </h1>
          <p className="mt-1 text-[13px] text-ink-3">
            Decline-model volumes × published reference prices × your decimals. Nothing speculative.
          </p>
        </div>
        <div className="flex rounded-sm border border-line bg-paper-card p-1" role="tablist" aria-label="Forecast horizon">
          {HORIZONS.map((h) => (
            <button
              key={h.key}
              role="tab"
              aria-selected={horizon === h.key}
              onClick={() => setHorizon(h.key)}
              className={cn(
                "rounded-[2px] px-3 py-2 text-[13px] font-semibold transition-colors sm:px-3.5 sm:py-1.5",
                horizon === h.key ? "bg-pine text-paper" : "text-ink-2 hover:bg-paper-deep",
              )}
            >
              <span className="sm:hidden">{h.short}</span>
              <span className="hidden sm:inline">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 border-brass/60 p-6 ring-1 ring-brass/30">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
            Projected net to you, next {horizon} months
          </p>
          <p className="figures mt-1 text-4xl font-semibold text-pine">{money(total)}</p>
        </div>
        <p className="max-w-sm text-[12.5px] leading-relaxed text-ink-3">
          {deck.label} · as of {deck.asOf}. Modeled volumes carry uncertainty;
          treat this as the center of a range, not a promise.
        </p>
      </div>

      {/* monthly bars */}
      <div className="card mt-6 p-5">
        <h2 className="font-display text-xl font-semibold">Month by month</h2>
        <div className="mt-4 flex items-end gap-[3px]" style={{ height: 160 }} role="img"
          aria-label={`Projected monthly net cashflow for the next ${horizon} months`}>
          {monthly.map(([m, v]) => (
            <div key={m} className="group relative flex-1">
              <div
                className="w-full rounded-t-[2px] bg-pine/15 transition-colors group-hover:bg-brass"
                style={{ height: `${Math.max((v / peak) * 150, 3)}px` }}
              />
              <div className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 text-[11px] font-medium text-paper group-hover:block">
                {monthLabel(m)} · {money(v)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-ink-3">
          <span className="figures">{monthly.length > 0 ? monthLabel(monthly[0][0]) : ""}</span>
          <span className="figures">{monthly.length > 0 ? monthLabel(monthly[monthly.length - 1][0]) : ""}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* per-well table */}
        <div className="card overflow-x-auto p-2">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <th className="table-th">Well</th>
                <th className="table-th text-right">Next {horizon} mo</th>
                <th className="table-th text-right">Share of total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-paper-deep">
                  <td className="table-td">
                    <Link href={`/app/wells/${r.api}`} className="font-medium text-pine hover:underline">
                      {r.well}
                    </Link>
                    <span className="block text-[11.5px] text-ink-3">{r.county}</span>
                  </td>
                  <td className="table-td figures text-right font-semibold text-pine">{money(r.value)}</td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line-soft">
                        <div className="h-full bg-brass" style={{ width: `${total > 0 ? (r.value / total) * 100 : 0}%` }} />
                      </div>
                      <span className="figures w-11 text-right text-[12px] text-ink-2">
                        {total > 0 ? ((r.value / total) * 100).toFixed(1) : "0.0"}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* the deck */}
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">The price deck</h2>
            <p className="text-[11.5px] text-ink-3">as of {deck.asOf}</p>
          </div>
          <table className="mt-3 w-full border-collapse">
            <thead>
              <tr>
                <th className="table-th">Month</th>
                <th className="table-th text-right">WTI $/bbl</th>
                <th className="table-th text-right">Henry Hub $/mcf</th>
              </tr>
            </thead>
            <tbody>
              {deck.months.map((m) => (
                <tr key={m.month}>
                  <td className="table-td figures text-[13px]">{monthLabel(m.month)}</td>
                  <td className="table-td figures text-right text-[13px]">{m.wti.toFixed(2)}</td>
                  <td className="table-td figures text-right text-[13px]">{m.hh.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">{deck.note}</p>
        </div>
      </div>
    </div>
  );
}
