import MarketingShell from "@/components/MarketingShell";
import { ClaimFlow } from "@/components/ClaimFlow";

export const metadata = { title: "Claim your owner card" };

export default function ClaimPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-2xl px-5 py-16">
        <p className="eyebrow">Claim your card</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Search the name your checks come in
        </h1>
        <p className="mt-3 leading-relaxed text-ink-2">
          A person, a family trust, an LLC — whatever name the county has on
          its mineral rolls. We'll show what's on the shelf; verifying it's
          you takes one mailed code.
        </p>
        <div className="mt-8">
          <ClaimFlow />
        </div>
        <p className="mt-10 text-[12.5px] leading-relaxed text-ink-3">
          This demo searches a small fictional index. The live beta searches
          31,331 owner names from the mineral appraisal rolls of Martin and
          Karnes counties — if your minerals are elsewhere in Texas, we do not
          have you on file yet. Ownership rolls are public records; cashflow
          detail unlocks only after verification.
        </p>
      </section>
    </MarketingShell>
  );
}
