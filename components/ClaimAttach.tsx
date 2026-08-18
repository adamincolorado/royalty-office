"use client";

/**
 * The claim-attach step, run signed-in (onboarding or settings).
 *
 * Two data sources, deliberately different from the public funnel:
 *   /api/app/claims?q=  — core.owners, DETAIL-LOADED counties only, because
 *                         a claim needs a real owner row to attach to.
 *   The public funnel's pick (ro_claim_intent in localStorage) seeds the
 *   search box so the owner doesn't type their name twice.
 *
 * If their county isn't loaded yet, the funnel intent carries its name and
 * we offer the county-load request instead of a dead end.
 */
import { useEffect, useState } from "react";

type OwnerHit = {
  ownerId: number;
  name: string;
  county: string;
  city: string | null;
  state: string | null;
  interests: number;
};

type Intent = { name: string; counties: string[]; at: number } | null;

export function ClaimAttach() {
  const [q, setQ] = useState("");
  const [intent, setIntent] = useState<Intent>(null);
  const [hits, setHits] = useState<OwnerHit[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [queued, setQueued] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ro_claim_intent");
      if (raw) {
        const parsed = JSON.parse(raw) as Intent;
        if (parsed?.name) {
          setIntent(parsed);
          setQ(parsed.name);
        }
      }
    } catch {
      /* no intent — user types their name */
    }
  }, []);

  async function search(term: string) {
    if (term.trim().length < 3 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/app/claims?q=${encodeURIComponent(term.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { hits: OwnerHit[] };
      setHits(data.hits ?? []);
    } catch {
      setError("Search is unavailable right now — try again in a minute.");
    } finally {
      setBusy(false);
    }
  }

  async function claim(h: OwnerHit) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/app/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId: h.ownerId }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      try {
        localStorage.removeItem("ro_claim_intent");
      } catch { /* fine */ }
      setDone(h.name);
      // Server components re-read claims on navigation.
      window.location.href = "/app";
    } catch (e) {
      setError(
        e instanceof Error && e.message === "not-claimable"
          ? "That record is an institutional account and cannot be claimed."
          : "Could not create the claim — please try again.",
      );
      setBusy(false);
    }
  }

  async function askForCounty(county: string) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/app/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ county }),
      });
      if (res.ok) setQueued(county);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card p-6">
        <h2 className="font-display text-xl font-semibold text-pine">✓ Claim started</h2>
        <p className="mt-2 text-[14px] text-ink-2">
          <strong>{done}</strong> is attached to your account, pending
          verification. Opening your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(q);
        }}
      >
        <label htmlFor="attach-q" className="text-sm font-semibold">
          Owner name
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="attach-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Surname first — as the county files it"
            className="w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-[15px] outline-none focus:border-pine focus:ring-1 focus:ring-pine"
            autoComplete="off"
          />
          <button type="submit" className="btn-primary shrink-0" disabled={busy}>
            {busy ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {error && <p className="mt-3 text-[13px] font-medium text-clay">{error}</p>}

      {hits !== null && hits.length === 0 && (
        <div className="mt-4">
          <p className="text-[14px] leading-relaxed text-ink-2">
            No match in the detail-loaded counties yet.
            {intent && intent.counties.length > 0 && (
              <> Your earlier search found this name in{" "}
                <strong>{intent.counties.join(", ")}</strong> — we can queue
                that county for a full build and email you when your dashboard
                is ready.</>
            )}
          </p>
          {intent?.counties.map((c) => (
            <button
              key={c}
              onClick={() => askForCounty(c)}
              disabled={busy || queued === c}
              className="btn-secondary mt-3 mr-2"
            >
              {queued === c ? `✓ ${c} queued` : `Request ${c} County`}
            </button>
          ))}
        </div>
      )}

      {hits !== null && hits.length > 0 && (
        <ul className="mt-4 space-y-3">
          {hits.map((h) => (
            <li key={h.ownerId}>
              <button
                onClick={() => claim(h)}
                disabled={busy}
                className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-left transition-colors hover:border-pine hover:bg-pine-soft"
              >
                <p className="font-semibold">{h.name}</p>
                <p className="mt-0.5 text-[13px] text-ink-2">
                  {h.interests} recorded interest{h.interests === 1 ? "" : "s"} ·{" "}
                  {h.county} County
                  {h.city ? ` · mail address on file: ${h.city}${h.state ? `, ${h.state}` : ""}` : ""}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-5 text-[12px] leading-relaxed text-ink-3">
        Claiming links your account to the county&rsquo;s public record and never
        changes title. Multiple family members may claim the same record.
      </p>
    </div>
  );
}
