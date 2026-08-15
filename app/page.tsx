import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import { Seal } from "@/components/Brand";
import { SurveyGrid, ContourLines } from "@/components/Backdrops";
import { Reveal, CountUp } from "@/components/Motion";

export default function Home() {
  return (
    <MarketingShell>
      {/* ================= HERO — the survey-map night board ================ */}
      <section className="relative overflow-hidden bg-pine-deep text-paper">
        <SurveyGrid className="text-paper opacity-[0.14]" />
        {/* brass glow behind the product frame */}
        <div
          className="pointer-events-none absolute -right-40 top-8 h-[560px] w-[560px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #A87B2F55, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-wrap items-center gap-14 px-5 pb-20 pt-16 md:grid-cols-[1.02fr_0.98fr] md:pb-24 md:pt-24">
          <div>
            <p className="eyebrow anim !text-brass">Texas mineral &amp; royalty owners</p>
            <h1 className="anim d1 mt-4 font-display text-[clamp(2.7rem,5.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.025em]">
              You own the wells.
              <br />
              Now <em className="text-brass">see</em> them.
            </h1>
            <p className="anim d2 mt-6 max-w-lg text-lg leading-relaxed text-paper/75">
              Royalty Office shows you what professionals see — your wells,
              your cashflow, and what your checks should look like next — built
              from the public record and explained in plain English.
            </p>
            <div className="anim d3 mt-8 flex flex-wrap items-center gap-3.5">
              <Link href="/claim" className="btn-brass !px-6 !py-3">
                Claim your owner card
              </Link>
              <Link href="/login" className="btn-ghost-paper !px-6 !py-3">
                See the live demo
              </Link>
            </div>
            <p className="anim d4 mt-6 text-[13px] text-paper/50">
              We&rsquo;ve already indexed 7.9 million Texas mineral interests.
              Your file probably exists — come claim it.
            </p>
          </div>

          {/* product frame — floating over the survey board */}
          <div className="anim d3 relative">
            <div
              className="absolute -inset-3 rounded-lg border border-paper/10 bg-paper/[0.03]"
              aria-hidden="true"
            />
            <div className="card-float relative rotate-[0.4deg] p-4 text-ink ring-1 ring-brass/40">
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
                  <div key={k} className="rounded-[4px] border border-line-soft bg-paper px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">{k}</p>
                    <p className="figures mt-1 text-lg font-semibold text-pine sm:text-xl">{v}</p>
                  </div>
                ))}
              </div>
              <svg viewBox="0 0 400 110" className="w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="hero-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1D4A3C" />
                    <stop offset="100%" stopColor="#14342B" />
                  </linearGradient>
                </defs>
                {[38, 44, 41, 52, 47, 43, 49, 45, 40, 46, 42, 39].map((h, i) => (
                  <rect key={i} x={8 + i * 20} y={100 - h} width="13" height={h} rx="1" fill="url(#hero-bar)" />
                ))}
                <rect x={252} y={0} width={148} height={104} fill="#A87B2F" opacity="0.07" />
                <line x1={252} y1={0} x2={252} y2={104} stroke="#A87B2F" strokeDasharray="4 3" />
                {[36, 34, 33, 31, 30, 29, 28].map((h, i) => (
                  <rect key={i} x={258 + i * 20} y={100 - h} width="13" height={h} rx="1" fill="none" stroke="#8A6323" strokeWidth="1.3" />
                ))}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#41524A" strokeWidth="1.2" />
                <text x="258" y="12" fontSize="8" fill="#8A6323" fontWeight="600" letterSpacing="1">FORECAST</text>
              </svg>
              <p className="mt-2 text-right text-[10px] text-ink-3">
                Modeled from RRC production · demo data
              </p>
            </div>
          </div>
        </div>

        {/* stat band, inside the dark board */}
        <div className="relative border-t border-paper/10">
          <div className="mx-auto grid max-w-wrap grid-cols-2 gap-x-6 gap-y-8 px-5 py-9 md:grid-cols-4">
            {[
              { n: 7.9, d: 1, suffix: " million", k: "Texas mineral interests indexed" },
              { n: 965, d: 0, suffix: ",000", k: "distinct owners on file" },
              { n: 548, d: 0, suffix: ",000", k: "interest-to-well links resolved" },
              { n: 254, d: 0, suffix: "", k: "Texas counties covered" },
            ].map((s) => (
              <div key={s.k}>
                <p className="figures text-[28px] font-semibold leading-none text-brass">
                  <CountUp to={s.n} decimals={s.d} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[12.5px] leading-snug text-paper/55">{s.k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOURCES ================= */}
      <section className="border-b border-line bg-paper-deep">
        <div className="mx-auto flex max-w-wrap flex-wrap items-center justify-between gap-4 px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Built from the public record
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            {["Texas Railroad Commission", "County Appraisal Rolls", "FracFocus", "Copernicus Sentinel-2", "Texas GLO"].map((s) => (
              <span key={s} className="rounded-full border border-line bg-paper-card px-3 py-1 text-[11.5px] font-medium text-ink-2">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= THE THREE QUESTIONS ================= */}
      <section className="mx-auto max-w-wrap px-5 py-20">
        <Reveal>
          <p className="eyebrow">What you get</p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-tight">
            Three questions, answered on one page
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
            <Reveal key={c.t} delay={i * 90}>
              <div className="card lift group relative h-full overflow-hidden p-7">
                <div className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-gradient-to-r from-brass to-brass/30 transition-transform duration-300 group-hover:scale-x-100" style={{ transformOrigin: "left" }} aria-hidden="true" />
                <p className="figures text-sm font-semibold text-brass-deep">0{i + 1}</p>
                <h3 className="mt-2.5 font-display text-[22px] font-semibold">{c.t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative overflow-hidden border-y border-line bg-pine text-paper">
        <ContourLines className="text-brass opacity-[0.16]" />
        <div className="relative mx-auto max-w-wrap px-5 py-20">
          <Reveal>
            <p className="eyebrow !text-brass">How it works</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-semibold tracking-tight">
              Your file is already on the shelf
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
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
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 110}>
                <div className="border-l-2 border-brass pl-6">
                  <p className="figures text-4xl font-semibold text-brass">{s.n}</p>
                  <h3 className="mt-3 font-display text-[22px] font-semibold">{s.t}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-paper/70">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-12">
              <Link href="/claim" className="btn-brass !px-6 !py-3">
                Start with your name →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="mx-auto max-w-wrap px-5 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Built on the public record</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-tight">
              Every number can explain itself
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-ink-2">
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
          </Reveal>
          <Reveal delay={120}>
            <div className="card-float self-start p-7">
              <p className="eyebrow">Our commitments</p>
              <ul className="mt-5 space-y-5">
                {[
                  ["Public sources only", "RRC, county rolls, GLO, FracFocus — never private data about you."],
                  ["Strip prices, not speculation", "Forecasts are priced at the published futures curve, clearly dated. We never predict prices."],
                  ["Straight about who we are", "Royalty Office is operated by Alamo Exploration LLC, whose affiliates buy and lease minerals. We never sell your data to third parties, and our disclosures say exactly how we use it."],
                  ["Not investment advice", "We show you the math. Decisions — and the professionals you hire for them — are yours."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3.5">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass-soft text-[11px] font-bold text-brass-deep"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t}</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= PRICING TEASER ================= */}
      <section className="relative overflow-hidden border-t border-line bg-paper-deep">
        <ContourLines className="text-ink opacity-[0.05]" />
        <div className="relative mx-auto max-w-wrap px-5 py-20 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-tight">
              One missed well pays for a decade of this
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-2">
              Free to claim your card and see your wells. Cashflow and forecasts
              from $9 a month; full monitoring — permits, status changes, and
              satellite watch over your acreage — on the Sentinel plan.
            </p>
            <div className="mt-8 flex justify-center gap-3.5">
              <Link href="/pricing" className="btn-primary !px-6 !py-3">See pricing</Link>
              <Link href="/login" className="btn-secondary !px-6 !py-3">Tour the demo</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
