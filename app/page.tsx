import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import { Seal } from "@/components/Brand";
import { PLATFORM_STATS } from "@/lib/data";

export default function Home() {
  return (
    <MarketingShell>
      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-wrap items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:pt-20">
          <div>
            <p className="eyebrow">Texas mineral &amp; royalty owners</p>
            <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
              You own the wells.
              <br />
              Now <em className="text-pine">see</em> them.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-2">
              Royalty Office shows you what professionals see — your wells,
              your cashflow, and what your checks should look like next — built
              from the public record and explained in plain English.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/claim" className="btn-primary">
                Claim your owner card
              </Link>
              <Link href="/login" className="btn-secondary">
                See the live demo
              </Link>
            </div>
            <p className="mt-5 text-[13px] text-ink-3">
              We've already indexed {PLATFORM_STATS.interests} Texas mineral
              interests. Your file probably exists — come claim it.
            </p>
          </div>

          {/* CSS-composed product frame — no screenshot assets */}
          <div className="relative">
            <div className="card rotate-[0.4deg] p-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Seal size={22} />
                  <span className="text-[13px] font-semibold">Hargrove Family Mineral Trust</span>
                </div>
                <span className="rounded-full bg-pine-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-pine">
                  20 interests · 3 counties
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 py-4">
                {[
                  ["Trailing 12 mo", "$120,262"],
                  ["Next 12 mo at strip", "$104,403"],
                  ["Producing wells", "19 of 20"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-sm border border-line-soft bg-paper px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">{k}</p>
                    <p className="figures mt-1 text-xl font-semibold text-pine">{v}</p>
                  </div>
                ))}
              </div>
              {/* mini ledger bars */}
              <svg viewBox="0 0 400 110" className="w-full" aria-hidden="true">
                {[38, 44, 41, 52, 47, 43, 49, 45, 40, 46, 42, 39].map((h, i) => (
                  <rect key={i} x={8 + i * 20} y={100 - h} width="13" height={h} fill="#14342B" opacity="0.9" />
                ))}
                <rect x={252} y={0} width={148} height={104} fill="#A87B2F" opacity="0.06" />
                <line x1={252} y1={0} x2={252} y2={104} stroke="#A87B2F" strokeDasharray="4 3" />
                {[36, 34, 33, 31, 30, 29, 28].map((h, i) => (
                  <rect key={i} x={258 + i * 20} y={100 - h} width="13" height={h} fill="none" stroke="#8A6323" strokeWidth="1.3" />
                ))}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#41524A" strokeWidth="1.2" />
                <text x="258" y="12" fontSize="8" fill="#8A6323" fontWeight="600" letterSpacing="1">FORECAST</text>
              </svg>
              <p className="mt-2 text-right text-[10px] text-ink-3">
                Modeled from RRC production · demo data
              </p>
            </div>
            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-sm border border-line bg-paper-deep" aria-hidden="true" />
          </div>
        </div>

        {/* stat band */}
        <div className="border-y border-line bg-paper-deep">
          <div className="mx-auto grid max-w-wrap grid-cols-2 gap-6 px-5 py-6 md:grid-cols-4">
            {[
              [PLATFORM_STATS.interests, "Texas mineral interests indexed"],
              [PLATFORM_STATS.owners, "distinct owners on file"],
              [PLATFORM_STATS.wellLinks, "interest-to-well links resolved"],
              [PLATFORM_STATS.counties, "Texas counties covered"],
            ].map(([v, k]) => (
              <div key={k as string}>
                <p className="figures text-2xl font-semibold text-pine">{v}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-3">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- THE THREE THINGS ---- */}
      <section className="mx-auto max-w-wrap px-5 py-16">
        <p className="eyebrow">What you get</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight">
          Three questions, answered on one page
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              t: "What do I own?",
              d: "Every well tied to your name on the county mineral rolls — operator, status, formation, and your decimal in each one. No typing in your interests; we already built the file.",
            },
            {
              t: "What has it paid?",
              d: "Monthly production for every well, priced and netted to your decimal. Upload a check stub and we'll show modeled vs. actual — and flag the gaps worth a phone call.",
            },
            {
              t: "What's coming next?",
              d: "Engineering-grade decline forecasts priced at the futures strip — never speculation. Three months, six, twelve, or three years out, per well or across everything you own.",
            },
          ].map((c, i) => (
            <div key={c.t} className="card p-6">
              <p className="figures text-sm font-semibold text-brass-deep">0{i + 1}</p>
              <h3 className="mt-2 font-display text-xl font-semibold">{c.t}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="border-y border-line bg-pine text-paper">
        <div className="mx-auto max-w-wrap px-5 py-16">
          <p className="eyebrow !text-brass">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Your file is already on the shelf
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Search your name",
                d: "We've indexed the mineral ownership rolls of all 254 Texas counties. Search the name your checks come in — yours, a family trust, an LLC.",
              },
              {
                n: "2",
                t: "Verify it's you",
                d: "We mail a code to the address on file with the county — the same address your tax statements go to. Enter it and the card is yours. Moved? A check stub works too.",
              },
              {
                n: "3",
                t: "See everything",
                d: "Wells, cashflow history, and forward projections at strip prices. In plain English by default — with a pro mode when you want the full detail.",
              },
            ].map((s) => (
              <div key={s.n} className="border-l-2 border-brass pl-5">
                <p className="figures text-3xl font-semibold text-brass">{s.n}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/75">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/claim" className="inline-flex items-center gap-2 rounded-sm bg-brass px-5 py-2.5 text-sm font-semibold text-pine transition-colors hover:bg-[#C29344]">
              Start with your name →
            </Link>
          </div>
        </div>
      </section>

      {/* ---- HONESTY / TRUST ---- */}
      <section className="mx-auto max-w-wrap px-5 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Built on the public record</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Every number can explain itself
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-2">
              Our data comes from the Texas Railroad Commission, county
              appraisal mineral rolls, and other public sources — the same
              records professionals pay analysts to read. Every figure in the
              product carries a &ldquo;how was this computed?&rdquo; trail:
              the production month, the allocation method, the price, the
              deduction assumptions, your decimal.
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-2">
              Where the data has limits, we say so — Texas reports oil by
              lease, not by well, and production arrives on a two-to-four
              month lag. Products that hide that are guessing. We label it.
            </p>
          </div>
          <div className="card self-start p-6">
            <p className="eyebrow">Our commitments</p>
            <ul className="mt-4 space-y-4">
              {[
                ["Public sources only", "RRC, county rolls, GLO, FracFocus — never private data about you."],
                ["Strip prices, not speculation", "Forecasts are priced at the published futures curve, clearly dated. We never predict prices."],
                ["Your activity stays yours", "Royalty Office is operated by Alamo Exploration LLC. What you view here is never used for acquisition outreach — in writing, in our disclosures."],
                ["Not investment advice", "We show you the math. Decisions — and the professionals you hire for them — are yours."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold">{t}</p>
                    <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-2">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- PRICING TEASER ---- */}
      <section className="border-t border-line bg-paper-deep">
        <div className="mx-auto max-w-wrap px-5 py-16 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            One missed well pays for a decade of this
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            Free to claim your card and see your wells. Cashflow and forecasts
            from $9 a month; full monitoring — permits, status changes, and
            satellite watch over your acreage — on the Sentinel plan.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/pricing" className="btn-primary">See pricing</Link>
            <Link href="/login" className="btn-secondary">Tour the demo</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
