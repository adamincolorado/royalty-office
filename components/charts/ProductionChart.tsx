/**
 * Well production chart: monthly gross BOE as a line over dots, with the
 * fitted decline shown forward as a dashed curve and an uncertainty band.
 */
import type { MonthVol } from "@/lib/types";
import { monthLabel, num } from "@/lib/format";

const boe = (v: MonthVol) => v.oil + v.gas / 6;

export function ProductionChart({
  hist,
  forecast,
  height,
  band = 0.2,
  compact = false,
}: {
  hist: MonthVol[];
  forecast: MonthVol[];
  height?: number;
  band?: number;
  /** Compact: ~400-unit viewBox for phones; pass sliced series. */
  compact?: boolean;
}) {
  const all = [...hist, ...forecast];
  if (all.length === 0) return null;
  const W = compact ? 400 : 900;
  const H = height ?? (compact ? 200 : 240);
  const padL = compact ? 42 : 56;
  const padB = compact ? 22 : 26;
  const padT = compact ? 14 : 12;
  const fs = compact ? 10.5 : 10;
  const n = all.length;
  const peak = Math.max(...all.map(boe), 1) * 1.08;
  const x = (i: number) => padL + (i / Math.max(n - 1, 1)) * (W - padL - 10);
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / peak);

  const histPath = hist
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(boe(v)).toFixed(1)}`)
    .join(" ");
  const fcStart = hist.length - 1;
  const fcPath = forecast
    .map((v, i) => `${i === 0 ? `M${x(fcStart).toFixed(1)} ${y(boe(hist[fcStart])).toFixed(1)} L` : "L"}${x(fcStart + 1 + i).toFixed(1)} ${y(boe(v)).toFixed(1)}`)
    .join(" ");
  const bandPath =
    forecast.length > 0
      ? forecast
          .map((v, i) => `${i === 0 ? "M" : "L"}${x(fcStart + 1 + i).toFixed(1)} ${y(boe(v) * (1 + band)).toFixed(1)}`)
          .join(" ") +
        " " +
        [...forecast]
          .reverse()
          .map((v, i) => `L${x(fcStart + forecast.length - i).toFixed(1)} ${y(boe(v) * (1 - band)).toFixed(1)}`)
          .join(" ") +
        " Z"
      : "";

  const grids = (compact ? [0.33, 0.66, 1] : [0.25, 0.5, 0.75, 1]).map((f) => peak * f);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly production with fitted decline forecast">
      {grids.map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - 6} y1={y(v)} y2={y(v)} stroke="#DCD5C2" strokeWidth="1" strokeDasharray="1 3" />
          <text x={padL - 6} y={y(v) + 3.5} textAnchor="end" fontSize={fs} fill="#71817A" fontFamily="var(--font-mono)">
            {num(Math.round(v))}
          </text>
        </g>
      ))}
      <line x1={padL} x2={W - 6} y1={y(0)} y2={y(0)} stroke="#41524A" strokeWidth="1.25" />

      {bandPath && <path d={bandPath} fill="#A87B2F" opacity="0.14" />}
      <path d={histPath} fill="none" stroke="#14342B" strokeWidth="2" strokeLinejoin="round" />
      {hist.map((v, i) => (
        <circle key={v.month} cx={x(i)} cy={y(boe(v))} r="2.1" fill="#14342B">
          <title>{`${monthLabel(v.month)} — ${num(Math.round(boe(v)))} BOE`}</title>
        </circle>
      ))}
      {fcPath && <path d={fcPath} fill="none" stroke="#8A6323" strokeWidth="2" strokeDasharray="5 4" />}

      <text x={x(0)} y={H - 7} fontSize={fs} fill="#71817A" fontFamily="var(--font-mono)">
        {monthLabel(all[0].month)}
      </text>
      <text x={W - 8} y={H - 7} textAnchor="end" fontSize={fs} fill="#71817A" fontFamily="var(--font-mono)">
        {monthLabel(all[n - 1].month)}
      </text>
      <text x={padL} y={padT - 3} fontSize={compact ? 9 : 9.5} fill="#71817A" fontFamily="var(--font-sans)" letterSpacing="1">
        {compact ? "BOE / MONTH (GROSS)" : "BOE / MONTH (GROSS, LEASE-ALLOCATED)"}
      </text>
    </svg>
  );
}
