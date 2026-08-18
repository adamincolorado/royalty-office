import { redirect } from "next/navigation";
import Link from "next/link";
import { getViewer, activeClaims, verifiedClaims } from "@/lib/viewer";
import { getOwnerSummary, getOwnerHistory, getOwnerForecast } from "@/lib/queries";
import { money } from "@/lib/format";
import { DemoDashboard } from "./_demo";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

/**
 * The real overview. Every dollar figure on this page is GROSS — volumes ×
 * the owner's roll decimal × the reference price, before severance tax and
 * post-production deductions — and is labelled so. Forecast figures appear
 * only for VERIFIED claims and only from core.publishable_forecasts, the
 * view that enforces the engineering standard.
 */
export default async function OverviewPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "demo") return <DemoDashboard />;

  const claims = activeClaims(viewer);
  if (claims.length === 0) redirect("/onboarding");
  const verified = verifiedClaims(viewer);
  const claim = claims[0];

  const summary = await getOwnerSummary(claim.ownerId);
  if (!summary) redirect("/onboarding");
  const history = await getOwnerHistory(claim.ownerId, 12);
  const forecast = verified.length > 0 ? await getOwnerForecast(claim.ownerId, 12) : null;
  const next12 = forecast ? forecast.months.reduce((s, m) => s + m.grossRevenue, 0) : null;
  const last12 = history.reduce((s, m) => s + m.grossRevenue, 0);
  const maxRev = Math.max(...history.map((m) => m.grossRevenue), 1);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{summary.name}</h1>
        <p className="text-[13px] text-ink-3">
          {summary.counties.join(", ")} Count{summary.counties.length === 1 ? "y" : "ies"} ·
          appraisal roll + Railroad Commission records
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="card p-4">
          <p className="text-[12px] font-semibold text-ink-3">Recorded interests</p>
          <p className="figures mt-1 text-2xl font-semibold">{summary.interests.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-[12px] font-semibold text-ink-3">Properties</p>
          <p className="figures mt-1 text-2xl font-semibold">{summary.properties.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-[12px] font-semibold text-ink-3">County assessed value</p>
          <p className="figures mt-1 text-2xl font-semibold">{money(summary.assessedValue)}</p>
          <p className="text-[11px] text-ink-3">the county&rsquo;s own figure, not ours</p>
        </div>
        <div className="card p-4">
          <p className="text-[12px] font-semibold text-ink-3">
            {verified.length > 0 ? "Last-12-month gross royalty" : "Gross royalty (locked)"}
          </p>
          {verified.length > 0 ? (
            <>
              <p className="figures mt-1 text-2xl font-semibold">{money(last12)}</p>
              <p className="text-[11px] text-ink-3">before severance &amp; deductions</p>
            </>
          ) : (
            <p className="mt-1 text-[13px] leading-snug text-ink-2">
              Unlocks when your claim is verified.
            </p>
          )}
        </div>
      </div>

      {verified.length > 0 ? (
        <div className="card mt-6 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">Gross royalty by month</h2>
            <p className="text-[12px] text-ink-3">
              your decimals × reported lease volumes × ${forecast?.oilPrice ?? 60}/bbl reference —
              runs high against a real check
            </p>
          </div>
          <div className="mt-4 flex items-end gap-1" style={{ height: 120 }}>
            {history.map((m) => (
              <div key={m.month} className="group relative flex-1">
                <div
                  className="w-full rounded-t-sm bg-pine transition-colors group-hover:bg-brass"
                  style={{ height: `${Math.max(4, (m.grossRevenue / maxRev) * 112)}px` }}
                  title={`${m.month}: ${money(m.grossRevenue)}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-ink-3">
            <span>{history[0]?.month}</span>
            <span>{history[history.length - 1]?.month}</span>
          </div>
          {next12 != null && forecast && (
            <p className="mt-4 border-t border-line pt-3 text-[13.5px] leading-relaxed text-ink-2">
              Projected next 12 months, gross: <strong className="figures">{money(next12)}</strong>{" "}
              — from {forecast.leasesForecast} lease decline curve
              {forecast.leasesForecast === 1 ? "" : "s"} that clear our publication standard
              {forecast.leasesHeldOut > 0 && (
                <>
                  ; <strong>{forecast.leasesHeldOut}</strong> of your leases have no defensible
                  forecast (insufficient history) and contribute nothing here
                </>
              )}
              . Price held flat at ${forecast.oilPrice}/bbl ({forecast.priceDeck}); we do not
              forecast prices.
            </p>
          )}
        </div>
      ) : (
        <div className="card mt-6 border-brass p-5">
          <h2 className="font-display text-lg font-semibold">Verification pending</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-2">
            Your claim on <strong>{claim.ownerName}</strong> is recorded. Cashflow history and
            forecasts unlock once we verify you&rsquo;re the owner — a one-time code mailed to the
            address on the county roll, or a recent check stub. Until then you can review your
            recorded interests below; the interest list and assessed values are public record.
          </p>
        </div>
      )}

      <div className="mt-6">
        <Link href="/app/wells" className="btn-secondary">
          View your {summary.interests.toLocaleString()} recorded interests →
        </Link>
      </div>
    </div>
  );
}
