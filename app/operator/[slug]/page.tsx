import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import { StatusPill } from "@/components/StatusPill";
import { getOperator, getOperators, wellsByOperator, getCounty } from "@/lib/data";
import { num } from "@/lib/format";



export function generateStaticParams() {
  return getOperators().map((o) => ({ slug: o.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  // FIXTURE_NOINDEX — renders demo records today. Keep it out of the index
  // until it reads from core.*; an invented well or operator page indexed
  // under this domain is a credibility problem, not just an SEO one.
  const noindex = { robots: { index: false, follow: false } };
  const o = getOperator(params.slug);
  return { ...noindex, title: o ? `${o.name} — operator profile` : "Operator" };
}

export default function OperatorPage({ params }: { params: { slug: string } }) {
  const op = getOperator(params.slug);
  if (!op) notFound();
  const wells = wellsByOperator(op.slug);
  const county = getCounty(op.county);
  const producing = wells.filter((w) => w.status === "producing").length;
  const lastYear = wells.reduce((s, w) => {
    return s + w.hist.slice(-12).reduce((a, m) => a + m.oil + m.gas / 6, 0);
  }, 0);

  return (
    <MarketingShell>
      <section className="mx-auto max-w-wrap px-5 py-14">
        <p className="eyebrow">Operator profile · demo data</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{op.name}</h1>
        <p className="mt-2 text-ink-2">
          {op.hq} · {op.phone} · owner relations:{" "}
          <span className="figures text-[14px]">{op.ownerRelations}</span>
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-2">{op.profile}</p>

        <div className="mt-8 grid grid-cols-3 gap-4 md:max-w-xl">
          {[
            [num(wells.length), "wells in demo set"],
            [num(producing), "producing"],
            [num(Math.round(lastYear)), "BOE, trailing 12 mo"],
          ].map(([v, k]) => (
            <div key={k} className="card px-4 py-3">
              <p className="figures text-2xl font-semibold text-pine">{v}</p>
              <p className="text-[12px] text-ink-3">{k}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold">Wells</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="table-th">Well</th>
                <th className="table-th">API</th>
                <th className="table-th">County</th>
                <th className="table-th">Status</th>
                <th className="table-th">Formation</th>
                <th className="table-th">First prod</th>
              </tr>
            </thead>
            <tbody>
              {wells.map((w) => (
                <tr key={w.api} className="hover:bg-paper-deep">
                  <td className="table-td font-medium">
                    <Link href={`/well/${w.api}`} className="text-pine hover:underline">{w.name}</Link>
                  </td>
                  <td className="table-td figures text-[13px]">{w.api}</td>
                  <td className="table-td">
                    {county ? (
                      <Link href={`/texas/${county.slug}`} className="text-pine hover:underline">{w.county}</Link>
                    ) : w.county}
                  </td>
                  <td className="table-td"><StatusPill status={w.status} /></td>
                  <td className="table-td text-ink-2">{w.formation}</td>
                  <td className="table-td figures text-[13px]">{w.firstProd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 card flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="font-display text-xl font-semibold">Paid by {op.name}?</h2>
            <p className="mt-1 text-[14px] text-ink-2">
              See every well behind your checks, and what they should pay next.
            </p>
          </div>
          <Link href="/claim" className="btn-primary">Claim your card</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
