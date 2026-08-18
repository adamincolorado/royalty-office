import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import { StatusPill } from "@/components/StatusPill";
import { ProductionChart } from "@/components/charts/ProductionChart";
import { getWell, getWells, getOperator } from "@/lib/data";
import { forecastGross } from "@/lib/arps";
import { num } from "@/lib/format";



export function generateStaticParams() {
  return getWells().map((w) => ({ api: w.api }));
}

export function generateMetadata({ params }: { params: { api: string } }) {
  // FIXTURE_NOINDEX — renders demo records today. Keep it out of the index
  // until it reads from core.*; an invented well or operator page indexed
  // under this domain is a credibility problem, not just an SEO one.
  const noindex = { robots: { index: false, follow: false } };
  const w = getWell(params.api);
  return { ...noindex, title: w ? `${w.name} · API ${w.api}` : "Well" };
}

export default function PublicWellPage({ params }: { params: { api: string } }) {
  const well = getWell(params.api);
  if (!well) notFound();
  const op = getOperator(well.operatorSlug);
  const cum = well.hist.reduce(
    (s, m) => ({ oil: s.oil + m.oil, gas: s.gas + m.gas }),
    { oil: 0, gas: 0 },
  );

  return (
    <MarketingShell>
      <section className="mx-auto max-w-wrap px-5 py-14">
        <p className="eyebrow">Well record · public data (demo)</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-semibold tracking-tight">{well.name}</h1>
          <StatusPill status={well.status} />
        </div>
        <p className="mt-2 text-ink-2">
          API <span className="figures">{well.api}</span> ·{" "}
          {op && (
            <Link href={`/operator/${op.slug}`} className="text-pine hover:underline">{op.name}</Link>
          )}{" "}
          · <Link href={`/texas/${well.countySlug}`} className="text-pine hover:underline">{well.county} County</Link>
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            [well.formation, "formation"],
            [well.drillType === "H" ? `Horizontal · ${num(well.lateralFt ?? 0)} ft` : "Vertical", "wellbore"],
            [well.firstProd, "first production"],
            [`${num(Math.round(cum.oil))} bbl / ${num(Math.round(cum.gas))} mcf`, "cumulative oil / gas"],
          ].map(([v, k]) => (
            <div key={k as string} className="card px-4 py-3">
              <p className="figures text-[15px] font-semibold text-pine">{v}</p>
              <p className="mt-0.5 text-[11.5px] text-ink-3">{k}</p>
            </div>
          ))}
        </div>

        <div className="card mt-8 p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">Production history</h2>
            <p className="text-[12px] text-ink-3">data through {well.lastReported} · lease-allocated</p>
          </div>
          <div className="mt-4">
            <ProductionChart hist={well.hist} forecast={forecastGross(well, 12)} />
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">
            Dashed line: fitted decline projected 12 months (modified Arps,{" "}
            b = {well.params.b}, terminal {Math.round(well.params.terminal * 100)}%/yr;
            fit quality: {well.params.fitQuality}). Texas reports oil by lease;
            monthly well volumes are allocations.
          </p>
        </div>

        <div className="mt-10 card flex flex-wrap items-center justify-between gap-4 border-brass p-6 ring-1 ring-brass/40">
          <div>
            <h2 className="font-display text-xl font-semibold">Own a piece of this well?</h2>
            <p className="mt-1 max-w-xl text-[14px] text-ink-2">
              Subscribers see this same record netted to their decimal — what it
              has paid, month by month, and what it should pay next at published reference prices.
            </p>
          </div>
          <Link href="/claim" className="btn-primary">Claim your card</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
