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
    price: "$24",
    cadence: "/month · $199/yr",
    blurb: "The full picture, in plain English.",
    features: [
      "Everything in Claimed",
      "Net cashflow history, priced to your decimal",
      "Forecasts at strip — 3, 6, 12, 36 months",
      "Well detail with decline models",
      "Check-stub upload: modeled vs. actual",
      "Permit, status & operator alerts",
      "PDF statements & summaries",
    ],
    cta: { label: "Start with the demo", href: "/login" },
    featured: true,
  },
  {
    name: "Family Office",
    price: "$199",
    cadence: "/month · billed annually",
    blurb: "Multiple entities, one ledger.",
    features: [
      "Everything in Owner",
      "Unlimited owner entities under one login",
      "Consolidated cross-entity rollups",
      "CSV / spreadsheet export",
      "Up to 10 seats",
      "Priority verification & support",
    ],
    cta: { label: "Talk to us", href: "/about#contact" },
    featured: false,
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

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={cn(
                "card flex flex-col p-6",
                t.featured && "border-brass ring-1 ring-brass",
              )}
            >
              {t.featured && (
                <p className="mb-2 w-fit rounded-full bg-brass-soft px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-brass-deep">
                  Most owners choose this
                </p>
              )}
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
              <Link
                href={t.cta.href}
                className={cn("mt-6", t.featured ? "btn-primary" : "btn-secondary")}
              >
                {t.cta.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-6">
          <h3 className="font-display text-xl font-semibold">Fair-terms promise</h3>
          <div className="mt-3 grid gap-6 text-[14px] leading-relaxed text-ink-2 md:grid-cols-3">
            <p>
              <strong className="text-ink">Cancel anytime.</strong> Monthly
              plans stop at the end of the cycle; annual plans pro-rate in the
              first 60 days. Your claimed card stays yours on the free tier.
            </p>
            <p>
              <strong className="text-ink">No selling, ever.</strong> Consent
              to a subscription is not consent to be solicited. Portal
              activity is never used for acquisition outreach.
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
