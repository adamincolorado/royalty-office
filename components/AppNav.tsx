"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";

// Two tab sets. The demo tour shows the full aspiration; a real owner sees
// only surfaces backed by real data today. Operators/Monitoring/Offers stay
// demo-only until they read core.* — the Offers surface in particular is
// held back deliberately pending counsel (affiliate purchase offers inside
// the product carry disclosure requirements that are not written yet).
const DEMO_TABS = [
  { href: "/app", label: "Overview", exact: true },
  { href: "/app/wells", label: "Wells" },
  { href: "/app/operators", label: "Operators" },
  { href: "/app/cashflow", label: "Cashflow & forecast" },
  { href: "/app/monitoring", label: "Monitoring" },
  { href: "/app/offers", label: "Offers" },
];
const OWNER_TABS = [
  { href: "/app", label: "Overview", exact: true },
  { href: "/app/wells", label: "Holdings" },
  { href: "/app/cashflow", label: "Cashflow & forecast" },
  { href: "/app/settings", label: "Settings" },
];

export function AppNav({ variant = "demo" }: { variant?: "demo" | "owner" }) {
  const tabs = variant === "owner" ? OWNER_TABS : DEMO_TABS;
  const path = usePathname();
  return (
    <div className="relative">
      <nav className="no-scrollbar mx-auto flex max-w-wrap gap-1 overflow-x-auto px-4 sm:px-5">
        {tabs.map((t) => {
          const active = t.exact ? path === t.href : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-medium transition-colors sm:py-2.5",
                active
                  ? "border-brass font-semibold text-ink"
                  : "border-transparent text-ink-3 hover:border-line hover:text-ink",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      {/* right-edge fade hints at horizontal scroll on phones */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper-card to-transparent sm:hidden"
        aria-hidden="true"
      />
    </div>
  );
}
