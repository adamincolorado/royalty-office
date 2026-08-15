/**
 * Cashflow math: gross volumes × price deck × owner decimal, less burdens.
 *
 * Everything is transparent on purpose — every number in the UI can point at
 * this file. Net revenue per month:
 *
 *   oil$ = oil_bbl × (WTI + basis) × (1 − sev_oil − deducts_oil)
 *   gas$ = gas_mcf × (HH × basisPct) × (1 − sev_gas − deducts_gas)
 *   net  = (oil$ + gas$) × decimal
 *
 * Texas severance: 4.6% oil, 7.5% gas (statutory). Deducts are modeled until
 * the owner uploads statements, at which point actuals win.
 */
import type { Deck, MonthVol, CashMonth, Well, Interest } from "./types";
import { forecastGross, trailing } from "./arps";

export function priceFor(deck: Deck, month: string): { oil: number; gas: number } {
  const row =
    deck.months.find((m) => m.month === month) ??
    deck.months[deck.months.length - 1];
  return {
    oil: Math.max(row.wti + deck.basis.oil, 0),
    gas: Math.max(row.hh * deck.basis.gasPct, 0),
  };
}

export function netMonth(
  vol: MonthVol, deck: Deck, decimal: number,
): CashMonth {
  const px = priceFor(deck, vol.month);
  const oilD = 1 - deck.severance.oil - deck.deducts.oil;
  const gasD = 1 - deck.severance.gas - deck.deducts.gas;
  const gross = vol.oil * px.oil * oilD + vol.gas * px.gas * gasD;
  return {
    month: vol.month,
    grossOil: vol.oil,
    grossGas: vol.gas,
    netRevenue: gross * decimal,
  };
}

/** Forward net cashflow for one interest. */
export function forecastNet(
  well: Well, interest: Interest, deck: Deck, months: number,
): CashMonth[] {
  return forecastGross(well, months).map((v) => netMonth(v, deck, interest.decimal));
}

/** Historical net cashflow (modeled at the deck's flat prices — labeled as
 *  modeled in the UI; statement upload replaces these with actuals). */
export function historyNet(
  well: Well, interest: Interest, deck: Deck, months: number,
): CashMonth[] {
  return trailing(well, months).map((v) => netMonth(v, deck, interest.decimal));
}

export function sumNet(rows: CashMonth[]): number {
  return rows.reduce((s, r) => s + r.netRevenue, 0);
}

/** Merge several CashMonth series month-by-month. */
export function mergeSeries(series: CashMonth[][]): CashMonth[] {
  const map = new Map<string, CashMonth>();
  for (const s of series) {
    for (const r of s) {
      const cur = map.get(r.month);
      if (cur) {
        cur.grossOil += r.grossOil;
        cur.grossGas += r.grossGas;
        cur.netRevenue += r.netRevenue;
      } else {
        map.set(r.month, { ...r });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export const HORIZONS = [
  { key: "3", months: 3, label: "Next 3 months" },
  { key: "6", months: 6, label: "Next 6 months" },
  { key: "12", months: 12, label: "Next 12 months" },
  { key: "36", months: 36, label: "Next 36 months" },
] as const;
export type HorizonKey = (typeof HORIZONS)[number]["key"];
