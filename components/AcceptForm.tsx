"use client";

/**
 * The assent control itself.
 *
 * UNBUNDLED and UNCHECKED BY DEFAULT, because a pre-ticked box is not
 * assent and a bundled one ("agree to everything") is the first thing an
 * opposing brief attacks. The user must take an affirmative action, and the
 * exact sentence they tick is what gets hashed into app.consents.
 */
import { useState } from "react";

export function AcceptForm({
  consentText,
  version,
}: {
  consentText: string;
  version: string;
}) {
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!checked || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/app/accept", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      window.location.href = "/app";
    } catch {
      setError("Could not record your acceptance — please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="card mt-6 p-6">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-pine"
        />
        <span className="text-[14px] leading-relaxed text-ink">
          {consentText.replace(
            "Terms of Service and Privacy Policy",
            "Terms of Service and Privacy Policy",
          )}
        </span>
      </label>
      <p className="mt-3 pl-7 text-[12.5px] text-ink-3">
        Read the{" "}
        <a href="/legal/terms" target="_blank" className="font-medium text-pine hover:underline">
          Terms of Service
        </a>
        ,{" "}
        <a href="/legal/privacy" target="_blank" className="font-medium text-pine hover:underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/legal/disclosures" target="_blank" className="font-medium text-pine hover:underline">
          Disclosures
        </a>{" "}
        (version {version}). We record what you accept, when, and from where.
      </p>
      {error && <p className="mt-3 text-[13px] font-medium text-clay">{error}</p>}
      <button
        onClick={submit}
        disabled={!checked || busy}
        className="btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Recording…" : "Accept and continue"}
      </button>
    </div>
  );
}
