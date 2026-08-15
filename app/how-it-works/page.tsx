import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";

export const metadata = { title: "How it works" };

export default function HowItWorks() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="eyebrow">How it works</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          From your name to your wells in one sitting
        </h1>

        <div className="mt-10 space-y-10">
          {[
            {
              t: "1. Search the name on your checks",
              d: "Texas county appraisal districts publish mineral ownership rolls — who owns a royalty interest in which lease, and what decimal share. We've indexed those rolls statewide: 7.9 million interests across 965,000 owners, matched to 548,000 wells in Railroad Commission records. Search your name, a family trust, or an LLC, and see the interests the counties have on file.",
            },
            {
              t: "2. Verify with a mailed code",
              d: "Cashflow tied to a decimal is financial information, so we verify before we show it. We mail a one-time code to the address the county has on file — the same place your tax statements go. If you've moved, upload a recent check stub instead; the operator, lease, and owner number on it do the same job. Entities and family offices verify with standard documentation.",
            },
            {
              t: "3. Read your wells like a statement",
              d: "Each well shows its production history, status, and operator — and your share of it, month by month, priced and netted to your decimal. Texas reports oil production by lease rather than by well, so where volumes are allocated we say so plainly, and pro mode shows the basis.",
            },
            {
              t: "4. See what's coming",
              d: "Every producing well carries an engineering-grade decline model — the same modified-Arps convention reserve engineers use. Forward volumes are priced at the published futures strip, dated, with severance tax and typical deductions netted out. Pick a horizon — three months to three years — per well, per operator, or across everything you own. We model volumes; we never predict prices.",
            },
            {
              t: "5. Let the alerts watch for you",
              d: "New permits near your acreage, wells that stop reporting, operator changes, completions on your lease. The things that change your checks, surfaced when they happen instead of when the mail arrives.",
            },
          ].map((s) => (
            <div key={s.t} className="border-l-2 border-brass pl-6">
              <h2 className="font-display text-2xl font-semibold">{s.t}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-6">
          <h2 className="font-display text-xl font-semibold">Honest limits</h2>
          <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-ink-2">
            <li>• RRC production arrives on a 2–4 month reporting lag. Every page is stamped with its data-through month.</li>
            <li>• Modeled cashflow is a model. Your operator's statements govern; upload them and we'll reconcile the two.</li>
            <li>• Forecasts carry uncertainty bands, and young wells carry wide ones. We show the band, not just the line.</li>
            <li>• Nothing here is investment, legal, or tax advice — it's the public record, organized.</li>
          </ul>
        </div>

        <div className="mt-10 flex gap-3">
          <Link href="/claim" className="btn-primary">Claim your card</Link>
          <Link href="/login" className="btn-secondary">Tour the demo</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
