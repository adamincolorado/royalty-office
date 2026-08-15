import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";
import { Sparkline } from "@/components/charts/Sparkline";
import { getDeck, ownerPositions } from "@/lib/data";
import { forecastNet, historyNet, sumNet } from "@/lib/cashflow";
import { money } from "@/lib/format";

const boe12 = (hist: { oil: number; gas: number }[]) =>
  hist.slice(-12).map((m) => m.oil + m.gas / 6);

export const metadata = { title: "Your wells" };

export default function WellsPage() {
  const deck = getDeck();
  const rows = ownerPositions()
    .map((p) => ({
      ...p,
      ttm: sumNet(historyNet(p.well, p.interest, deck, 12)),
      next12: sumNet(forecastNet(p.well, p.interest, deck, 12)),
    }))
    .sort((a, b) => b.next12 - a.next12);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Your wells</h1>
        <p className="text-[13px] text-ink-3">{rows.length} interests, ranked by forward value</p>
      </div>
      <div className="card mt-6 overflow-x-auto p-2">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="table-th">Well</th>
              <th className="table-th">Operator</th>
              <th className="table-th">County</th>
              <th className="table-th">Status</th>
              <th className="table-th">12-mo trend</th>
              <th className="table-th text-right">Your decimal</th>
              <th className="table-th text-right">Trailing 12 mo</th>
              <th className="table-th text-right">Next 12 mo, modeled</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.interest.id} className="hover:bg-paper-deep">
                <td className="table-td">
                  <Link href={`/app/wells/${r.well.api}`} className="font-medium text-pine hover:underline">
                    {r.well.name}
                  </Link>
                  <span className="block text-[11.5px] text-ink-3">
                    API {r.well.api} · {r.well.formation}
                  </span>
                </td>
                <td className="table-td text-[13.5px]">
                  <Link href={`/app/operators/${r.well.operatorSlug}`} className="text-pine hover:underline">
                    {r.well.operatorSlug.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join(" ")}
                  </Link>
                </td>
                <td className="table-td text-[13.5px] text-ink-2">{r.well.county}</td>
                <td className="table-td"><StatusPill status={r.well.status} /></td>
                <td className="table-td"><Sparkline vals={boe12(r.well.hist)} /></td>
                <td className="table-td figures text-right text-[13px]">{r.interest.decimal.toFixed(8)}</td>
                <td className="table-td figures text-right">{money(r.ttm)}</td>
                <td className="table-td figures text-right font-semibold text-pine">{money(r.next12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12.5px] text-ink-3">
        Trailing figures are modeled from reported production at the demo deck;
        forward figures are decline forecasts priced at the published deck. Upload statements
        (Owner plan) to replace models with actuals.
      </p>
    </div>
  );
}
