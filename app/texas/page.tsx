import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import { getCounties } from "@/lib/data";
import { num } from "@/lib/format";

export const metadata = { title: "Texas counties" };

export default function TexasIndex() {
  const counties = getCounties();
  return (
    <MarketingShell>
      <section className="mx-auto max-w-wrap px-5 py-14">
        <p className="eyebrow">Public record</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Texas, county by county
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Production, operators, and permitting activity for the counties in
          our beta. Statewide coverage — all 254 counties — ships with public
          launch.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {counties.map((c) => (
            <Link key={c.slug} href={`/texas/${c.slug}`} className="card group p-6 no-underline">
              <p className="eyebrow">{c.basin}</p>
              <h2 className="mt-1.5 font-display text-2xl font-semibold group-hover:text-pine">
                {c.name} County
              </h2>
              <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-ink-2">{c.blurb}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line-soft pt-3">
                {[
                  [num(c.producingWells), "producing wells"],
                  [num(c.activeOperators), "operators"],
                  [num(c.permitsLast12), "permits, 12 mo"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="sr-only">{k}</dt>
                    <dd className="figures text-lg font-semibold text-pine">{v}</dd>
                    <dd className="text-[11px] leading-tight text-ink-3">{k}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-[13px] text-ink-3">
          Beta counties shown with demonstration statistics. County pages at
          launch are generated from live RRC and appraisal-roll data.
        </p>
      </section>
    </MarketingShell>
  );
}
