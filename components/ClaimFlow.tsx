"use client";

/**
 * The claim funnel, on the real statewide index.
 *
 * Searches /api/claim/search → core.v_owner_search: 1.28M owner names from
 * 207 county appraisal rolls. Every number shown here is the county's own
 * public record (interest counts, assessed value) — never a forecast, never
 * a price, never anything of ours.
 *
 * The earlier version of this component searched a fictional fixture and
 * "verified" identity against the hardcoded string 1874. Real verification
 * is a PIN mailed to the address on the county roll AFTER account creation
 * (app.owner_claims, method 'mail_pin'); this component now ends at signup,
 * carrying the picked identity in localStorage for onboarding to read.
 */
import { useState } from "react";

type Hit = {
  name: string;
  county: string;
  interests: number;
  leases: number;
  operators: number;
  assessedValue: number | null;
  claimable: boolean;
  countyStatus: string;
  readyNow: boolean;
};

type Group = { name: string; rows: Hit[] };

type Stage = "search" | "results" | "account";

function money(v: number | null): string {
  if (v == null || v <= 0) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${Math.round(v / 1e3)}K`;
  return `$${v}`;
}

function groupByName(hits: Hit[]): Group[] {
  const m = new Map<string, Hit[]>();
  for (const h of hits) {
    const list = m.get(h.name) ?? [];
    list.push(h);
    m.set(h.name, list);
  }
  return Array.from(m.entries()).map(([name, rows]) => ({ name, rows }));
}

export function ClaimFlow() {
  const [stage, setStage] = useState<Stage>("search");
  const [q, setQ] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [picked, setPicked] = useState<Group | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 3 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/claim/search?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { hits: Hit[] };
      setGroups(groupByName(data.hits ?? []));
      setStage("results");
    } catch {
      setError("Search is unavailable right now — please try again in a minute.");
    } finally {
      setBusy(false);
    }
  }

  function pick(g: Group) {
    setPicked(g);
    setStage("account");
    // Onboarding reads this after signup and starts the real claim
    // (mailed-PIN verification). Public-record aggregates only.
    try {
      localStorage.setItem(
        "ro_claim_intent",
        JSON.stringify({ name: g.name, counties: g.rows.map((r) => r.county), at: Date.now() }),
      );
    } catch {
      /* storage unavailable — onboarding just asks again */
    }
  }

  return (
    <div className="card p-6">
      {stage === "search" && (
        <form onSubmit={runSearch}>
          <label htmlFor="claim-q" className="text-sm font-semibold">
            Owner name
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="claim-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Surname first — as it appears on your check stub"
              className="w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-[15px] outline-none focus:border-pine focus:ring-1 focus:ring-pine"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary shrink-0" disabled={busy}>
              {busy ? "Searching…" : "Search"}
            </button>
          </div>
          <p className="mt-2.5 text-[12.5px] text-ink-3">
            County rolls file names surname-first (&ldquo;SMITH JOHN&rdquo;). Trusts and
            LLCs appear under the entity name.
          </p>
          {error && <p className="mt-2 text-[13px] font-medium text-clay">{error}</p>}
        </form>
      )}

      {stage === "results" && (
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">
              {groups.length > 0
                ? `${groups.length} name${groups.length > 1 ? "s" : ""} on the rolls`
                : "No matches found"}
            </h2>
            <button
              onClick={() => setStage("search")}
              className="text-[13px] font-medium text-pine hover:underline"
            >
              Search again
            </button>
          </div>
          {groups.length === 0 && (
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              Nothing under that spelling. County rolls misspell names
              constantly — try the surname alone, or the name exactly as it
              appears on a royalty check or tax statement.
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {groups.map((g) => {
              const claimable = g.rows.some((r) => r.claimable);
              const interests = g.rows.reduce((s, r) => s + r.interests, 0);
              const assessed = g.rows.reduce((s, r) => s + (r.assessedValue ?? 0), 0);
              return (
                <li key={g.name}>
                  <button
                    onClick={() => claimable && pick(g)}
                    disabled={!claimable}
                    className={
                      "w-full rounded-sm border border-line bg-paper px-4 py-3 text-left transition-colors " +
                      (claimable
                        ? "hover:border-pine hover:bg-pine-soft"
                        : "cursor-not-allowed opacity-60")
                    }
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-semibold">{g.name}</p>
                      <p className="figures shrink-0 text-[13px] text-ink-2">{money(assessed)} assessed</p>
                    </div>
                    <p className="mt-0.5 text-[13px] text-ink-2">
                      {interests.toLocaleString()} recorded interest{interests === 1 ? "" : "s"} ·{" "}
                      {g.rows.map((r) => r.county).join(", ")} Count{g.rows.length === 1 ? "y" : "ies"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {g.rows.map((r) => (
                        <span
                          key={r.county}
                          className={
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                            (r.readyNow ? "bg-pine-soft text-pine" : "bg-paper-deep text-ink-3")
                          }
                        >
                          {r.county} — {r.readyNow ? "full dashboard ready" : "records indexed"}
                        </span>
                      ))}
                      {!claimable && (
                        <span className="rounded-full bg-paper-deep px-2 py-0.5 text-[11px] font-semibold text-ink-3">
                          institutional record — not claimable
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {groups.length > 0 && (
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-3">
              &ldquo;Full dashboard ready&rdquo; counties have production linked today.
              &ldquo;Records indexed&rdquo; counties show ownership and the county&rsquo;s own
              assessed value now; production detail follows as the county comes
              online.
            </p>
          )}
        </div>
      )}

      {stage === "account" && picked && (
        <div>
          <h2 className="font-display text-xl font-semibold">Claim {picked.name}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            Create a free account and we&rsquo;ll start verification: a one-time code
            mailed to the address the county has on file for this owner —
            usually 3–5 business days. Moved recently? A recent check stub
            verifies instantly instead.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
            Ownership rolls are public record. Cashflow detail unlocks only
            after verification, and claiming here never changes title — it
            links your account to the public record.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="/signup" className="btn-primary">Create your free account</a>
            <button
              onClick={() => setStage("results")}
              className="text-[13px] font-medium text-pine hover:underline"
            >
              Back to results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
