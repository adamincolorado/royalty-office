"use client";

import { useState } from "react";
import { searchClaims } from "@/lib/data";
import type { ClaimHit } from "@/lib/types";

type Stage = "search" | "results" | "verify" | "done";

export function ClaimFlow() {
  const [stage, setStage] = useState<Stage>("search");
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<ClaimHit[]>([]);
  const [picked, setPicked] = useState<ClaimHit | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  function runSearch(e: React.FormEvent) {
    e.preventDefault();
    setHits(searchClaims(q));
    setStage("results");
  }

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === "1874") {
      setCodeError(false);
      setStage("done");
    } else {
      setCodeError(true);
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
              placeholder='Try "Hargrove"'
              className="w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-[15px] outline-none focus:border-pine focus:ring-1 focus:ring-pine"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary shrink-0">Search</button>
          </div>
          <p className="mt-2.5 text-[12.5px] text-ink-3">
            Demo tip: search <span className="figures">Hargrove</span> to walk the full flow.
          </p>
        </form>
      )}

      {stage === "results" && (
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">
              {hits.length > 0 ? `${hits.length} match${hits.length > 1 ? "es" : ""} on the rolls` : "No matches found"}
            </h2>
            <button onClick={() => setStage("search")} className="text-[13px] font-medium text-pine hover:underline">
              Search again
            </button>
          </div>
          {hits.length === 0 && (
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              No luck in the demo index — try <span className="figures">Hargrove</span>.
              In production, misses fall back to fuzzy and historical-name search,
              because county rolls misspell names constantly.
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {hits.map((h) => (
              <li key={h.name}>
                <button
                  onClick={() => { setPicked(h); setStage("verify"); }}
                  className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-left transition-colors hover:border-pine hover:bg-pine-soft"
                >
                  <p className="font-semibold">{h.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink-2">
                    {h.interests} recorded interests · {h.county}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stage === "verify" && picked && (
        <form onSubmit={submitCode}>
          <h2 className="font-display text-xl font-semibold">Verify {picked.name}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            We've mailed a one-time code to the address the county has on file
            for this owner. It usually arrives in 3–5 business days. Moved
            recently? You can verify instantly with a recent check stub instead.
          </p>
          <label htmlFor="claim-code" className="mt-5 block text-sm font-semibold">
            Mailed code
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="claim-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••"
              inputMode="numeric"
              className="figures w-36 rounded-sm border border-line bg-paper px-3.5 py-2.5 text-lg tracking-[0.3em] outline-none focus:border-pine focus:ring-1 focus:ring-pine"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary shrink-0">Verify</button>
          </div>
          {codeError && (
            <p className="mt-2 text-[13px] font-medium text-clay">
              That code doesn't match. Demo code: <span className="figures">1874</span>
            </p>
          )}
          {!codeError && (
            <p className="mt-2 text-[12.5px] text-ink-3">
              Demo code: <span className="figures">1874</span>
            </p>
          )}
        </form>
      )}

      {stage === "done" && picked && (
        <div>
          <h2 className="font-display text-xl font-semibold text-pine">
            ✓ Card claimed
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            <strong>{picked.name}</strong> is verified. {picked.interests} interests
            are now on your card — head to the demo dashboard to see them priced
            and projected.
          </p>
          <a href="/api/demo-session?to=/app" className="btn-primary mt-5">
            Open the dashboard
          </a>
        </div>
      )}
    </div>
  );
}
