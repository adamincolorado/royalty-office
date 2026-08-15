/**
 * Modified-Arps decline forecast — the same convention as the internal
 * engineering stack: hyperbolic while the instantaneous decline exceeds the
 * terminal rate, exponential at the terminal rate thereafter.
 *
 * Volumes are BOE/month; t is months since first production.
 */
import type { Well, MonthVol } from "./types";

export function monthlyRate(
  qi: number, di: number, b: number, terminalAnnual: number, t: number,
): number {
  const dmin = -Math.log(1 - terminalAnnual) / 12;
  if (b <= 0.001) return qi * Math.exp(-di * t);
  const dInst = di / (1 + b * di * t);
  if (dInst > dmin) return qi / Math.pow(1 + b * di * t, 1 / b);
  const tSw = (di / dmin - 1) / (b * di);
  const qSw = qi / Math.pow(1 + b * di * tSw, 1 / b);
  return qSw * Math.exp(-dmin * (t - tSw));
}

export function addMonths(ymStr: string, k: number): string {
  const [y, m] = ymStr.split("-").map(Number);
  const idx = y * 12 + (m - 1) + k;
  return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`;
}

export function monthsBetween(a: string, b: string): number {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by * 12 + bm) - (ay * 12 + am);
}

/**
 * Forward GROSS volumes for a well, monthly, starting the month after
 * `lastReported`. A shut-in well forecasts zero (we model what is, not what
 * an operator might do).
 */
export function forecastGross(well: Well, months: number): MonthVol[] {
  const out: MonthVol[] = [];
  if (well.status !== "producing") {
    for (let k = 1; k <= months; k++) {
      out.push({ month: addMonths(well.lastReported, k), oil: 0, gas: 0 });
    }
    return out;
  }
  const { qi, di, b, terminal, oilFrac } = well.params;
  const age = monthsBetween(well.firstProd, well.lastReported);
  for (let k = 1; k <= months; k++) {
    const boe = monthlyRate(qi, di, b, terminal, age + k);
    out.push({
      month: addMonths(well.lastReported, k),
      oil: boe * oilFrac,
      gas: boe * (1 - oilFrac) * 6.0,
    });
  }
  return out;
}

/** Trailing-N-month gross volumes from history (missing months = 0). */
export function trailing(well: Well, n: number): MonthVol[] {
  return well.hist.slice(-n);
}
