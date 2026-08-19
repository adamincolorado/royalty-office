import { redirect } from "next/navigation";
import { getViewer, activeClaims, selectedClaim, unlocksMoney } from "@/lib/viewer";
import { ClaimSwitcher } from "@/components/ClaimSwitcher";
import { getOwnerHistory, getOwnerForecast } from "@/lib/queries";
import { money } from "@/lib/format";
import { DemoCashflow } from "./_demo";

export const metadata = { title: "Cashflow & forecast" };
export const dynamic = "force-dynamic";

/**
 * History is reported volumes × the owner's decimals. The forward table is
 * built ONLY from curves that clear the publication standard (mig 015) and
 * stops at each lease's economic limit. Verified claims only — this page is
 * the paywall's reason to exist and the ladder's top rung.
 */
export default async function CashflowPage(
  { searchParams }: { searchParams?: { claim?: string } },
) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "demo") return <DemoCashflow />;

  const claims = activeClaims(viewer);
  if (claims.length === 0) redirect("/onboarding");
  const claim = selectedClaim(viewer, Number(searchParams?.claim) || undefined);
  if (!claim) redirect("/onboarding");

  if (!unlocksMoney(claim)) {
    return (
      <div className="mx-auto max-w-xl">
        <ClaimSwitcher claims={claims} current={claim.claimId} />
        <h1 className="font-display text-2xl font-semibold tracking-tight">Cashflow &amp; forecast</h1>
        <div className="card mt-5 border-brass p-6">
          <h2 className="font-display text-lg font-semibold">Unlocks at verification</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            Cashflow-to-you is effectively a financial statement, so we show it only to a
            verified claimant of <strong>{claim.ownerName}</strong>. Verification is a one-time
            code mailed to the address on the county roll (3–5 business days), or a recent check
            stub for instant verification. Your recorded interests and their public-record
            details are already open under Holdings.
          </p>
        </div>
      </div>
    );
  }

  const history = await getOwnerHistory(claim.ownerId, 24);
  const forecast = await getOwnerForecast(claim.ownerId, 36);
  const through = history.length ? history[history.length - 1].month : null;
  // Trailing twelve by MONTH BOUNDARY. slice(-12) takes the last 12 ROWS, so
  // a gap in the store (2024-08 and 2025-04 are absent database-wide) silently
  // widens the window past a year and disagrees with Overview.
  const cutoff = through
    ? (() => {
        const [y, m] = through.split("-").map(Number);
        const idx = y * 12 + (m - 1) - 11;
        return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`;
      })()
    : null;
  const h12 = history
    .filter((m) => !cutoff || m.month >= cutoff)
    .reduce((s, m) => s + m.grossRevenue, 0);
  const f12 = forecast.months.slice(0, 12).reduce((s, m) => s + m.grossRevenue, 0);
  const f36 = forecast.months.reduce((s, m) => s + m.grossRevenue, 0);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Cashflow &amp; forecast</h1>
        <p className="text-[13px] text-ink-3">
          gross to your decimals · ${forecast.oilPrice}/bbl held flat {forecast.priceDeck !== "none" ? " (" + forecast.priceDeck + ")" : ""}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-[12px] font-semibold text-ink-3">
            {through ? "12 reported months to " + through + ", gross" : "Reported, gross"}
          </p>
          <p className="figures mt-1 text-2xl font-semibold">{money(h12)}</p>
        </div>
        <div className="card p-4">
          <p className="text-[12px] font-semibold text-ink-3">
            Projected next 12, gross{forecast.hasGasRevenue ? " (oil only)" : ""}
          </p>
          <p className="figures mt-1 text-2xl font-semibold">
            {forecast.revenueCoverage >= 0.35 ? money(f12) : "—"}
          </p>
          <p className="text-[11px] text-ink-3">
            covers {Math.round(forecast.revenueCoverage * 100)}% of your reported royalty
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[12px] font-semibold text-ink-3">
            Projected next 36, gross{forecast.hasGasRevenue ? " (oil only)" : ""}
          </p>
          <p className="figures mt-1 text-2xl font-semibold">
            {forecast.revenueCoverage >= 0.35 ? money(f36) : "—"}
          </p>
          <p className="text-[11px] text-ink-3">
            {forecast.revenueCoverage >= 0.35
              ? `${forecast.leasesForecast} of ${forecast.leasesForecast + forecast.leasesHeldOut} leases`
              : "too little coverage to total"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-display text-lg font-semibold">History — reported</h2>
          <table className="mt-3 w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] text-ink-3">
                <th className="py-1.5 font-semibold">Month</th>
                <th className="py-1.5 text-right font-semibold">Oil bbl (yours)</th>
                <th className="py-1.5 text-right font-semibold">Gas mcf (yours)</th>
                <th className="py-1.5 text-right font-semibold">Gross $</th>
              </tr>
            </thead>
            <tbody>
              {history.slice().reverse().map((m) => (
                <tr key={m.month} className="border-b border-line/50 last:border-0">
                  <td className="figures py-1.5">{m.month}</td>
                  <td className="figures py-1.5 text-right">{m.oilBbl.toFixed(1)}</td>
                  <td className="figures py-1.5 text-right">{m.gasMcf.toFixed(0)}</td>
                  <td className="figures py-1.5 text-right">{money(m.grossRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg font-semibold">
            Forecast — modeled{forecast.hasGasRevenue ? ", oil only" : ""}
          </h2>
          {forecast.startsAfter && (
            <p className="mt-1 text-[12px] text-ink-3">
              Begins the month after your last reported month ({forecast.startsAfter});
              Railroad Commission reporting runs two to four months behind, so the most
              recent months are modeled rather than reported.
            </p>
          )}
          {forecast.hasGasRevenue && (
            <p className="mt-1 text-[12px] text-ink-3">
              Part of your royalty is gas. Only oil is forecast, so these figures are
              lower than a full projection of your position would be.
            </p>
          )}
          <p className="mt-1 text-[12px] text-ink-3">
            {forecast.leasesForecast} lease curve{forecast.leasesForecast === 1 ? "" : "s"} past
            the publication gate{forecast.leasesHeldOut > 0 &&
              `; ${forecast.leasesHeldOut} lease${forecast.leasesHeldOut === 1 ? "" : "s"} held out — insufficient history to defend a curve`}.
          </p>
          {forecast.revenueCoverage < 0.35 ? (
            /* Suppressing the total while publishing every month that sums to
               it is not a suppression — it hands the reader the addends of the
               number we just declined to print. */
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
              Withheld. Only {Math.round(forecast.revenueCoverage * 100)}% of what your
              interests reported last year sits on leases whose history supports a
              defensible curve, so a month-by-month projection would describe a small
              corner of your position while looking like the whole of it.
            </p>
          ) : (
          <table className="mt-3 w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] text-ink-3">
                <th className="py-1.5 font-semibold">Month</th>
                <th className="py-1.5 text-right font-semibold">Oil bbl (yours)</th>
                <th className="py-1.5 text-right font-semibold">Gross $</th>
              </tr>
            </thead>
            <tbody>
              {forecast.months.slice(0, 12).map((m) => (
                <tr key={m.month} className="border-b border-line/50 last:border-0">
                  <td className="figures py-1.5">{m.month}</td>
                  <td className="figures py-1.5 text-right">{m.oilBbl.toFixed(1)}</td>
                  <td className="figures py-1.5 text-right">{money(m.grossRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-[12px] leading-relaxed text-ink-3">
        All figures are GROSS to your recorded decimals — before severance tax, post-production
        deductions, and property tax — so they run high against a real check. Forecasts are
        modified-Arps declines fit from each lease&rsquo;s own reported history, published only where
        that history supports a defensible curve, stopped at the economic limit, at a flat
        reference price. Estimates, not statements of account; operator statements govern actual
        payment.
      </p>
    </div>
  );
}
