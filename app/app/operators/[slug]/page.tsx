import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/StatusPill";
import { CashflowChart } from "@/components/charts/CashflowChart";
import { getDeck, getOperator, ownerPositions } from "@/lib/data";
import { forecastNet, historyNet, mergeSeries, sumNet } from "@/lib/cashflow";
import { money } from "@/lib/format";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const o = getOperator(params.slug);
  return { title: o ? `${o.name} — your position` : "Operator" };
}

export default async function AppOperatorPage({ params }: { params: { slug: string } }) {
  // Demo-only surface: nothing real behind it yet. A signed-in owner is
  // routed home rather than shown fiction.
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind !== "demo") redirect("/app");

  const op = getOperator(params.slug);
  if (!op) notFound();
  const deck = getDeck();
  const mine = ownerPositions().filter((p) => p.well.operatorSlug === op.slug);
  if (mine.length === 0) notFound();

  const hist = mergeSeries(mine.map((p) => historyNet(p.well, p.interest, deck, 24)));
  const fc = mergeSeries(mine.map((p) => forecastNet(p.well, p.interest, deck, 12)));
  const rows = mine
    .map((p) => ({ ...p, next12: sumNet(forecastNet(p.well, p.interest, deck, 12)) }))
    .sort((a, b) => b.next12 - a.next12);

  return (
    <div>
      <p className="text-[13px]">
        <Link href="/app/operators" className="text-pine hover:underline">← Your operators</Link>
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">{op.name}</h1>
      <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-2">{op.profile}</p>
      <div className="mt-3 card inline-block px-4 py-2.5 text-[13px] text-ink-2">
        Owner relations: <span className="figures">{op.ownerRelations}</span> · {op.phone}
      </div>

      <div className="card mt-6 p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">Net cashflow from {op.name}</h2>
          <p className="text-[12px] text-ink-3">your {mine.length} wells with this operator</p>
        </div>
        <div className="mt-4 hidden sm:block">
          <CashflowChart history={hist} forecast={fc} height={200} />
        </div>
        <div className="mt-3 sm:hidden">
          <CashflowChart compact history={hist.slice(-12)} forecast={fc.slice(0, 6)} />
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto p-2">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              <th className="table-th">Well</th>
              <th className="table-th">Status</th>
              <th className="table-th text-right">Your decimal</th>
              <th className="table-th text-right">Next 12 mo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.interest.id} className="hover:bg-paper-deep">
                <td className="table-td">
                  <Link href={`/app/wells/${r.well.api}`} className="font-medium text-pine hover:underline">
                    {r.well.name}
                  </Link>
                  <span className="block text-[11.5px] text-ink-3">{r.well.county} · {r.well.formation}</span>
                </td>
                <td className="table-td"><StatusPill status={r.well.status} /></td>
                <td className="table-td figures text-right text-[13px]">{r.interest.decimal.toFixed(8)}</td>
                <td className="table-td figures text-right font-semibold text-pine">{money(r.next12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
