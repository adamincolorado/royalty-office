import Link from "next/link";
import type { Claim } from "@/lib/viewer";

/**
 * Switch between the records this account has claimed.
 *
 * Every /app page used to render claims[0] with no way to reach the others,
 * so a second claim — the entire point of "Claim another record" — was
 * invisible. Each tab carries its own verification state, because
 * entitlement is per claim: one may show cashflow while another is still
 * waiting on its mailed code.
 */
export function ClaimSwitcher({
  claims,
  current,
}: {
  claims: Claim[];
  current: number;
}) {
  if (claims.length < 2) return null;
  return (
    <nav aria-label="Your claimed records" className="mb-4 flex flex-wrap gap-2">
      {claims.map((c) => {
        const active = c.claimId === current;
        return (
          <Link
            key={c.claimId}
            href={`?claim=${c.claimId}`}
            aria-current={active ? "page" : undefined}
            className={
              "rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors " +
              (active
                ? "border-pine bg-pine-soft text-pine"
                : "border-line text-ink-2 hover:border-pine hover:text-ink")
            }
          >
            {c.ownerName}
            <span className="ml-1.5 text-[11px] font-semibold text-ink-3">
              {c.status === "verified" ? "verified" : "pending"}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
