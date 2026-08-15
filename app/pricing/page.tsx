import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import { cn } from "@/lib/format";

export const metadata = { title: "Pricing" };

const tiers = [
  {
    name: "Claimed",
    price: "Free",
    cadence: "",
    blurb: "Claim your card. See what exists.",
    features: [
      "Your owner card, verified by mail",
      "Every well tied to your name",
      "Gross lease production history",
      "County & operator context pages",
    ],
    cta: { label: "Claim your card", href: "/claim" },
    featured: false,
  },
  {
    name: "Owner",
    price: "$9",
    cadence: "/month · $79/yr",
    blurb: "Your cashflow, past and future.",
    features: [
      "Everything in Claimed",
      "Net cashflow history, priced to your decimal",
      "Forecasts at strip — 3, 6, 12, 36 months",
      "Well detail with decline models",
      "Check-stub upload: modeled vs. actual",
      "Annual owner report (PDF)",
      "Monthly email summary",
    ],
    cta: { label: "Start with the demo", href: "/login" },
    featured: false,
  },
  {
    name: "Sentinel",
    price: "$29",
    cadence: "/month · $279/yr",
    blurb: "Know before the mail does.",
    features: [
      "Everything in Owner",
      "New permits on or near your acreage — daily",
      "Status changes: permit → pad → frac → completion → first production",
      "New wells added to your units",
      "Satellite change detection over your locations (~5-day passes)",
      "Shut-in watch with dollars-not-flowing",
      "First-check countdown with the statutory due date",
      "SMS alerts (arriving with public beta)",
    ],
    cta: { label: "Tour the monitoring demo", href: "/login" },
    featured: true,
  },
];

export default function Pricing() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-wrap px-5 py-16">
        <p className="eyebrow">Pricing</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Priced like a subscription.
          <br />
          Worth a phone call to your operator.
        </h1>
        <p className="mt-4 max-w-xl text-ink-2">
          The first time you catch a statement that doesn't match the
          production record — or learn about a new well before the division
          order arrives — the year has paid for itself.
        </p>

        <div className="mt-10 grid items-start gap-5 md:grid-cols-3">
          {tiers.map((t) =>
            t.featured ? (
              <div
                key={t.name}
                className="rounded-lg p-[1.5px] shadow-float md:-my-3"
                style={{ background: "linear-gradient(160deg, #CFA049 0%, #A87B2F 45%, #14342B 100%)" }}
              >
                <div className="flex h-full flex-col rounded-[7px] bg-paper-card p-6 md:p-7">
                  <p className="mb-2 w-fit rounded-full bg-brass-soft px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-brass-deep">
                    Most owners choose this
                  </p>
                  <h2 className="font-display text-2xl font-semibold">{t.name}</h2>
                  <p className="mt-1 text-sm text-ink-2">{t.blurb}</p>
                  <p className="mt-4">
                    <span className="figures text-4xl font-semibold text-pine">{t.price}</span>
                    <span className="ml-1 text-[13px] text-ink-3">{t.cadence}</span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[14px] leading-snug">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                        <span className="text-ink-2">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={t.cta.href} className="btn-primary mt-6">
                    {t.cta.label}
                  </Link>
                </div>
              </div>
            ) : (
              <div key={t.name} className="card lift flex flex-col p-6">
                <h2 className="font-display text-2xl font-semibold">{t.name}</h2>
                <p className="mt-1 text-sm text-ink-2">{t.blurb}</p>
                <p className="mt-4">
                  <span className="figures text-3xl font-semibold text-pine">{t.price}</span>
                  <span className="ml-1 text-[13px] text-ink-3">{t.cadence}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[14px] leading-snug">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                      <span className="text-ink-2">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={t.cta.href} className="btn-secondary mt-6">
                  {t.cta.label}
                </Link>
              </div>
            ),
          )}
        </div>

        <div className="mt-10 card flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h3 className="font-display text-xl font-semibold">Why Sentinel costs what it costs</h3>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-2">
              Satellite monitoring isn&rsquo;t a checkbox — it&rsquo;s a pipeline we run.
              Imagery is processed <strong className="text-ink">only for locations tied to
              active Sentinel subscriptions</strong>, plus ten public showcase sites. Your
              subscription funds the watching of your own acreage; nobody subsidizes
              acreage no one is watching.
            </p>
          </div>
        </div>

        <div className="mt-6 card p-6">
          <h3 className="font-display text-xl font-semibold">Family office?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            Multiple entities, consolidated rollups, CSV export, and seats are
            coming as a dedicated tier.{" "}
            <a href="/about#contact" className="font-medium text-pine underline decoration-brass underline-offset-2">
              Talk to us
            </a>{" "}
            and we&rsquo;ll set you up directly in the meantime.
          </p>
        </div>

        <div className="mt-6 card p-6">
          <h3 className="font-display text-xl font-semibold">Fair-terms promise</h3>
          <div className="mt-3 grid gap-6 text-[14px] leading-relaxed text-ink-2 md:grid-cols-3">
            <p>
              <strong className="text-ink">Cancel anytime.</strong> Monthly
              plans stop at the end of the cycle; annual plans pro-rate in the
              first 60 days. Your claimed card stays yours on the free tier.
            </p>
            <p>
              <strong className="text-ink">Your data is not for sale.</strong>{" "}
              We never sell your information to third parties. Marketing from
              our own corporate family always carries an opt-out that never
              affects your subscription.
            </p>
            <p>
              <strong className="text-ink">Heirs welcome.</strong> Multiple
              family members can each claim a card on the same interests —
              inheritance is messy and we don't referee it.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
