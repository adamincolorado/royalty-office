import { ForecastCenter } from "@/components/ForecastCenter";
import { getDeck, ownerPositions } from "@/lib/data";
import { forecastNet } from "@/lib/cashflow";

export const metadata = { title: "Cashflow & forecast" };

/** Server component precomputes 36 months of per-position forecast once;
 *  the client picks horizons out of it — no refits, no recalcs. */
export default function CashflowPage() {
  const deck = getDeck();
  const positions = ownerPositions();
  const perPosition = positions.map((p) => ({
    id: p.interest.id,
    well: p.well.name,
    api: p.well.api,
    county: p.well.county,
    operatorSlug: p.well.operatorSlug,
    status: p.well.status,
    decimal: p.interest.decimal,
    months: forecastNet(p.well, p.interest, deck, 36).map((m) => ({
      month: m.month,
      net: +m.netRevenue.toFixed(2),
    })),
  }));

  return (
    <ForecastCenter
      positions={perPosition}
      deck={{
        label: deck.label,
        asOf: deck.asOf,
        note: deck.note,
        months: deck.months.slice(0, 12),
      }}
    />
  );
}
