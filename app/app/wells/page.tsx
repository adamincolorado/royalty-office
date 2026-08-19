import { redirect } from "next/navigation";
import { getViewer, activeClaims, selectedClaim, unlocksMoney } from "@/lib/viewer";
import { ClaimSwitcher } from "@/components/ClaimSwitcher";
import { getOwnerPositions } from "@/lib/queries";
import { money } from "@/lib/format";
import { DemoWells } from "./_demo";

export const metadata = { title: "Holdings" };
export const dynamic = "force-dynamic";

/**
 * The owner's recorded interests, one row per interest — lease-grain,
 * because Texas reports production by LEASE and the appraisal roll
 * enumerates interests against leases. Decimals and assessed values are the
 * county's public record. Dollar rates appear only for verified claims.
 */
export default async function HoldingsPage(
  { searchParams }: { searchParams?: { claim?: string } },
) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "demo") return <DemoWells />;

  const claims = activeClaims(viewer);
  if (claims.length === 0) redirect("/onboarding");
  const claim = selectedClaim(viewer, Number(searchParams?.claim) || undefined);
  if (!claim) redirect("/onboarding");
  const showDollars = unlocksMoney(claim);
  const positions = await getOwnerPositions(claim.ownerId);

  // The appraisal roll enumerates one row per interest, and a lease commonly
  // carries several that render identically — 37 of the 200 pilot owners had
  // repeated lines that looked like a display bug. Fold rows whose entire
  // visible tuple matches and show the multiplicity instead.
  const grouped = Array.from(
    positions
      .reduce((m, p) => {
        const key = [p.propertyName, p.county, p.operator, p.rrcLeaseNo,
                     p.decimal, p.assessedValue, p.basis].join("|");
        const hit = m.get(key);
        if (hit) hit.count += 1;
        else m.set(key, { p, count: 1 });
        return m;
      }, new Map<string, { p: (typeof positions)[number]; count: number }>())
      .values(),
  );

  return (
    <div>
      <ClaimSwitcher claims={claims} current={claim.claimId} />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Holdings</h1>
        <p className="text-[13px] text-ink-3">
          {positions.length.toLocaleString()} interests
          {grouped.length !== positions.length && ` · ${grouped.length} lines`} ·
          county appraisal roll, as filed
        </p>
      </div>

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[54rem] text-[13.5px]">
          <thead>
            <tr className="border-b border-line text-left text-[12px] text-ink-3">
              <th className="px-4 py-2.5 font-semibold">Property / lease</th>
              <th className="px-3 py-2.5 font-semibold">County</th>
              <th className="px-3 py-2.5 font-semibold">Operator</th>
              <th className="px-3 py-2.5 text-right font-semibold">Decimal</th>
              <th className="px-3 py-2.5 text-right font-semibold">Assessed</th>
              <th className="px-3 py-2.5 text-right font-semibold">Oil bbl/mo (yours)</th>
              {showDollars && (
                <th className="px-4 py-2.5 text-right font-semibold">Gross $/mo</th>
              )}
            </tr>
          </thead>
          <tbody>
            {grouped.map(({ p, count }) => (
              <tr key={p.interestId} className="border-b border-line/60 last:border-0">
                <td className="px-4 py-2.5">
                  <span className="font-medium">{p.propertyName}</span>
                  {count > 1 && (
                    <span className="ml-2 rounded-full bg-paper-deep px-1.5 py-0.5 text-[10px] font-semibold text-ink-3"
                          title={`${count} separate interests on this lease appear identically on the roll`}>
                      ×{count}
                    </span>
                  )}
                  {p.rrcLeaseNo && (
                    <span className="figures ml-2 text-[11px] text-ink-3">RRC {p.rrcLeaseNo}</span>
                  )}
                  {p.basis === "allocated" && (
                    <span className="ml-2 rounded-full bg-paper-deep px-1.5 py-0.5 text-[10px] font-semibold text-ink-3"
                          title="Production is split between tracts by appraised royalty value">
                      allocated
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-ink-2">{p.county}</td>
                <td className="px-3 py-2.5 text-ink-2">{p.operator ?? "—"}</td>
                <td className="figures px-3 py-2.5 text-right">{p.decimal ? p.decimal.toFixed(6) : "—"}</td>
                <td className="figures px-3 py-2.5 text-right">{money(p.assessedValue ?? 0)}</td>
                <td className="figures px-3 py-2.5 text-right">
                  {p.monthsCovered > 0 ? p.oilBblPerMonth.toFixed(1) : "—"}
                </td>
                {showDollars && (
                  <td className="figures px-4 py-2.5 text-right">
                    {p.monthsCovered > 0 ? money(p.grossRevenuePerMonth) : "—"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-ink-3">
        Decimals and assessed values are the county appraisal roll&rsquo;s own figures. Volume rates
        are Railroad Commission lease-level production normalized per month, multiplied by your
        decimal; &ldquo;allocated&rdquo; rows split lease production between tracts by appraised royalty
        value, which is an estimate. {showDollars
          ? "Dollar figures are gross at a flat reference price — before severance tax and post-production deductions, so they run high against a real check."
          : "Dollar rates unlock when your claim is verified."} Operator statements govern actual payment.
      </p>
    </div>
  );
}
