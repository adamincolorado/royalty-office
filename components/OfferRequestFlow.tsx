"use client";

/**
 * The owner-initiated offer request — the consent screen IS the feature.
 * Demo: state is client-side; production posts to bridge.offer_requests with
 * the consent record (version hash, UTC timestamp, IP, UA) ledgered.
 */
import { useState } from "react";
import { cn } from "@/lib/format";

type Step = "details" | "consent" | "done";

export function OfferRequestFlow() {
  const [step, setStep] = useState<Step>("details");
  const [kind, setKind] = useState<"purchase" | "lease">("purchase");
  const [scope, setScope] = useState("RANCHERO STATE UNIT — Reeves Co.");
  const [amount, setAmount] = useState("");
  const [buyer, setBuyer] = useState("");
  const [consented, setConsented] = useState(false);

  if (step === "done") {
    return (
      <div className="rounded-[4px] border border-pine/30 bg-pine-soft px-5 py-5">
        <h3 className="font-display text-lg font-semibold text-pine">✓ Request submitted</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
          Our desk reviews your submission and typically responds with a
          competing offer — or a plain explanation of why we are passing —
          within 3 business days. You will see it on this page and by email.
        </p>
        <div className="mt-3 rounded-[3px] border border-line bg-paper-card px-3.5 py-2.5">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-3">
            Consent recorded (demo)
          </p>
          <p className="figures mt-1 text-[12px] text-ink-2">
            {kind} request · scope: {scope} · consent v2026-08-15 · stamped to
            your account&rsquo;s offer ledger
          </p>
        </div>
        <button
          onClick={() => { setStep("details"); setConsented(false); setAmount(""); setBuyer(""); }}
          className="mt-4 text-[13px] font-semibold text-pine hover:underline"
        >
          Start another request
        </button>
      </div>
    );
  }

  if (step === "consent") {
    return (
      <div>
        <div className="rounded-[4px] border border-brass bg-brass-soft px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brass-deep">
            Your consent — read before submitting
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-pine"
            />
            <span className="text-[13px] leading-relaxed text-ink-2">
              I am voluntarily submitting this information for the specific
              purpose of requesting a competing offer from Alamo Exploration
              LLC or its affiliates. I understand that: (1) Alamo is a
              prospective <strong>buyer</strong> and does not represent me or
              advise me; (2) the information I submit through this request —
              and only this request — will be used to prepare that offer;
              (3) any offer is an arms-length indication subject to title and
              a definitive agreement; (4) I may decline any offer, or seek
              competing bids anywhere, with no effect on my subscription; and
              (5) I am encouraged to consult my own attorney or advisor before
              any transaction.
            </span>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => consented && setStep("done")}
            disabled={!consented}
            className={cn("btn-primary", !consented && "cursor-not-allowed opacity-40 hover:!transform-none")}
          >
            Submit request
          </button>
          <button onClick={() => setStep("details")} className="text-[13px] font-medium text-ink-2 hover:text-ink">
            ← Back
          </button>
        </div>
        {!consented && (
          <p className="mt-2 text-[12px] text-ink-3">
            The box above is required — it is the consent that lets us prepare an offer.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setStep("consent"); }}
      className="space-y-4"
    >
      <div>
        <p className="text-sm font-semibold">What did you receive?</p>
        <div className="mt-2 flex gap-2">
          {([["purchase", "An offer to buy my minerals"], ["lease", "A lease proposal"]] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "rounded-[4px] border px-3.5 py-2 text-[13px] font-semibold transition-colors",
                kind === k ? "border-pine bg-pine-soft text-pine" : "border-line bg-paper text-ink-2 hover:border-pine/50",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="of-scope" className="text-sm font-semibold">Which interests?</label>
        <select
          id="of-scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="mt-2 w-full rounded-[4px] border border-line bg-paper px-3.5 py-2.5 text-[14px] outline-none focus:border-pine focus:ring-1 focus:ring-pine"
        >
          <option>RANCHERO STATE UNIT — Reeves Co.</option>
          <option>All Reeves County interests</option>
          <option>All Karnes County interests</option>
          <option>All Atascosa County interests</option>
          <option>My whole portfolio</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="of-amount" className="text-sm font-semibold">
            The {kind === "purchase" ? "offer" : "bonus/terms"} you received <span className="font-normal text-ink-3">(optional)</span>
          </label>
          <input
            id="of-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={kind === "purchase" ? "$178,000" : "$500/ac, 3 yr, 1/5th"}
            className="figures mt-2 w-full rounded-[4px] border border-line bg-paper px-3.5 py-2.5 text-[14px] outline-none focus:border-pine focus:ring-1 focus:ring-pine"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="of-buyer" className="text-sm font-semibold">
            From whom <span className="font-normal text-ink-3">(optional)</span>
          </label>
          <input
            id="of-buyer"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            placeholder="Buyer or lessee name"
            className="mt-2 w-full rounded-[4px] border border-line bg-paper px-3.5 py-2.5 text-[14px] outline-none focus:border-pine focus:ring-1 focus:ring-pine"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="rounded-[4px] border border-dashed border-line bg-paper px-4 py-3 text-[12.5px] text-ink-3">
        Have the offer letter? In production you can attach it here — it is
        used only for this request, under the consent on the next screen.
        (Upload disabled in the demo.)
      </div>

      <button type="submit" className="btn-primary">
        Continue to consent →
      </button>
    </form>
  );
}
