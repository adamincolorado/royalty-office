"use client";

/**
 * The house chart: monthly net cashflow, history + forecast, hand-rolled SVG —
 * now scrubbable. Drag or tap anywhere on the plot and a readout follows with
 * the month and dollars; horizontal drags scrub while vertical swipes still
 * scroll the page (`touch-action: pan-y`). No chart library, no deps.
 */
import { useCallback, useRef, useState } from "react";
import type { CashMonth } from "@/lib/types";
import { money, monthLabel } from "@/lib/format";

export function CashflowChart({
  history,
  forecast,
  height,
  band = 0.18,
  compact = false,
}: {
  history: CashMonth[];
  forecast: CashMonth[];
  height?: number;
  band?: number; // ± fraction shown as the forecast uncertainty envelope
  /** Compact mode: a ~400-unit viewBox so text renders near 1:1 on phones.
   *  Pass FEWER months (e.g. 12 hist + 6 fc) — the caller slices. */
  compact?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const all = [...history, ...forecast];
  const W = compact ? 400 : 900;
  const H = height ?? (compact ? 190 : 220);
  const padL = compact ? 40 : 54;
  const padB = compact ? 22 : 26;
  const padT = compact ? 14 : 14;
  const fs = compact ? 10.5 : 10;
  const n = all.length;
  const bw = n > 0 ? (W - padL - 8) / n : 0;

  const toIndex = useCallback(
    (clientX: number) => {
      const el = svgRef.current;
      if (!el || n === 0) return null;
      const r = el.getBoundingClientRect();
      const vx = ((clientX - r.left) / r.width) * W;
      const i = Math.floor((vx - padL) / bw);
      return i >= 0 && i < n ? i : null;
    },
    [W, padL, bw, n],
  );

  if (all.length === 0) return null;

  const peak = Math.max(...all.map((r) => r.netRevenue), 1) * (1 + band);
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / peak);
  const x = (i: number) => padL + i * bw;

  const step = niceStep(peak / (compact ? 3 : 4));
  const grids: number[] = [];
  for (let v = step; v <= peak; v += step) grids.push(v);

  const splitX = x(history.length) - bw * 0.15;

  // readout geometry (clamped inside the plot)
  const roW = compact ? 118 : 132;
  const roX = hover === null ? 0 : Math.min(Math.max(x(hover) + bw / 2 - roW / 2, padL), W - roW - 4);
  const isFc = hover !== null && hover >= history.length;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full touch-pan-y select-none"
      role="img"
      aria-label={`Monthly net cashflow: ${history.length} months of history and ${forecast.length} months of forecast. Drag to read values.`}
      onPointerDown={(e) => setHover(toIndex(e.clientX))}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" || e.buttons > 0) setHover(toIndex(e.clientX));
      }}
      onPointerLeave={() => setHover(null)}
    >
      {grids.map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - 4} y1={y(v)} y2={y(v)} stroke="#DCD5C2" strokeWidth="1" strokeDasharray="1 3" />
          <text x={padL - 6} y={y(v) + 3.5} textAnchor="end" fontSize={fs} fill="#71817A" fontFamily="var(--font-mono)">
            {shortMoney(v)}
          </text>
        </g>
      ))}
      <line x1={padL} x2={W - 4} y1={y(0)} y2={y(0)} stroke="#41524A" strokeWidth="1.25" />

      {/* forecast zone tint + divider */}
      {forecast.length > 0 && (
        <>
          <rect x={splitX} y={padT - 4} width={W - 4 - splitX} height={H - padT - padB + 8} fill="#A87B2F" opacity="0.05" />
          <line x1={splitX} x2={splitX} y1={padT - 4} y2={H - padB + 4} stroke="#A87B2F" strokeWidth="1" strokeDasharray="4 3" />
          <text x={splitX + 6} y={padT + 6} fontSize={compact ? 9 : 9.5} fill="#8A6323" fontWeight="600" letterSpacing="1.2" fontFamily="var(--font-sans)">
            {compact ? "FORECAST" : "MODELED FORECAST"}
          </text>
        </>
      )}

      {/* history bars */}
      {history.map((r, i) => (
        <rect
          key={r.month}
          x={x(i) + bw * 0.14}
          y={y(r.netRevenue)}
          width={bw * 0.72}
          height={Math.max(y(0) - y(r.netRevenue), 0)}
          fill={hover === i ? "#1D4A3C" : "#14342B"}
          opacity={hover === null || hover === i ? 0.92 : 0.45}
        />
      ))}

      {/* forecast band + outlined bars */}
      {forecast.map((r, i) => {
        const gi = history.length + i;
        const gx = x(gi);
        const hi = r.netRevenue * (1 + band);
        const lo = r.netRevenue * (1 - band);
        return (
          <g key={r.month} opacity={hover === null || hover === gi ? 1 : 0.45}>
            <rect x={gx + bw * 0.14} y={y(hi)} width={bw * 0.72} height={Math.max(y(lo) - y(hi), 0)} fill="#A87B2F" opacity="0.16" />
            <rect
              x={gx + bw * 0.14}
              y={y(r.netRevenue)}
              width={bw * 0.72}
              height={Math.max(y(0) - y(r.netRevenue), 0)}
              fill={hover === gi ? "#A87B2F22" : "none"}
              stroke="#8A6323"
              strokeWidth={hover === gi ? 2 : 1.4}
            />
          </g>
        );
      })}

      {/* x labels: first, split, last (compact drops the split label) */}
      <text x={x(0) + 2} y={H - 7} fontSize={fs} fill="#71817A" fontFamily="var(--font-mono)">
        {monthLabel(all[0].month)}
      </text>
      {!compact && forecast.length > 0 && (
        <text x={splitX + 4} y={H - 7} fontSize={fs} fill="#8A6323" fontFamily="var(--font-mono)">
          {monthLabel(forecast[0].month)}
        </text>
      )}
      <text x={W - 6} y={H - 7} textAnchor="end" fontSize={fs} fill="#71817A" fontFamily="var(--font-mono)">
        {monthLabel(all[n - 1].month)}
      </text>

      {/* scrub guide + readout */}
      {hover !== null && (
        <g pointerEvents="none">
          <line
            x1={x(hover) + bw / 2} x2={x(hover) + bw / 2}
            y1={padT - 2} y2={H - padB}
            stroke={isFc ? "#8A6323" : "#14342B"} strokeWidth="1" strokeDasharray="2 3"
          />
          <g transform={`translate(${roX}, ${padT - 2})`}>
            <rect width={roW} height={34} rx="4" fill="#17251F" opacity="0.94" />
            <text x={10} y={14} fontSize={compact ? 10 : 10.5} fill="#C9BFA0" fontFamily="var(--font-mono)">
              {monthLabel(all[hover].month)}{isFc ? " · forecast" : ""}
            </text>
            <text x={10} y={28} fontSize={compact ? 12 : 13} fontWeight="600" fill="#F7F4EC" fontFamily="var(--font-mono)">
              {money(all[hover].netRevenue)}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

function niceStep(raw: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  return step * mag;
}

function shortMoney(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(v < 10_000 ? 1 : 0)}k`;
  return `$${Math.round(v)}`;
}
