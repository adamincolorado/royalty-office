"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";

const tabs = [
  { href: "/app", label: "Overview", exact: true },
  { href: "/app/wells", label: "Wells" },
  { href: "/app/operators", label: "Operators" },
  { href: "/app/cashflow", label: "Cashflow & forecast" },
];

export function AppNav() {
  const path = usePathname();
  return (
    <nav className="mx-auto flex max-w-wrap gap-1 overflow-x-auto px-5">
      {tabs.map((t) => {
        const active = t.exact ? path === t.href : path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
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
  );
}
