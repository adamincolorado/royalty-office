import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import { StatusPill } from "@/components/StatusPill";
import { getCounties, getCounty, getOperators, wellsByCounty } from "@/lib/data";
import { num } from "@/lib/format";



export function generateStaticParams() {
  return getCounties().map((c) => ({ county: c.slug }));
}

export function generateMetadata({ params }: { params: { county: string } }) {
  // FIXTURE_NOINDEX — renders demo records today. Keep it out of the index
  // until it reads from core.*; an invented well or operator page indexed
  // under this domain is a credibility problem, not just an SEO one.
  const noindex = { robots: { index: false, follow: false } };
  const c = getCounty(params.county);
  return { ...noindex, title: c ? `${c.name} County, Texas — wells & operators` : "County" };
}

export default function CountyPage({ params }: { params: { county: string } }) {
  const county = getCounty(params.county);
  if (!county) notFound();
  const wells = wellsByCounty(county.slug);
  const ops = getOperators().filter((o) => o.county === county.slug);

  return (
    <MarketingShell>
      <section className="mx-auto max-w-wrap px-5 py-14">
        <p className="eyebrow">{county.basin} · {county.region}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          {county.name} County, Texas
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">{county.blurb}</p>

        <div className="mt-8 grid grid-cols-3 gap-4 md:max-w-xl">
          {[
            [num(county.producingWells), "producing wells"],
            [num(county.activeOperators), "active operators"],
            [num(county.permitsLast12), "permits, last 12 mo"],
          ].map(([v, k]) => (
            <div key={k} className="card px-4 py-3">
              <p className="figures text-2xl font-semibold text-pine">{v}</p>
              <p className="text-[12px] text-ink-3">{k}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold">Featured operators</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {ops.map((o) => (
            <Link key={o.slug} href={`/operator/${o.slug}`} className="card group p-5 no-underline">
              <h3 className="font-display text-xl font-semibold group-hover:text-pine">{o.name}</h3>
              <p className="mt-1 text-[13px] text-ink-3">{o.hq}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{o.profile}</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold">Sample wells</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                <th className="table-th">Well</th>
                <th className="table-th">API</th>
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
                    <StatusPill status={w.status} />
                  </td>
                  <td className="table-td text-ink-2">{w.formation}</td>
                  <td className="table-td figures text-[13px]">{w.firstProd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 card flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="font-display text-xl font-semibold">Own minerals in {county.name} County?</h2>
            <p className="mt-1 text-[14px] text-ink-2">Your interests are probably already on our shelf. Search your name and see.</p>
          </div>
          <Link href="/claim" className="btn-primary">Claim your card</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
