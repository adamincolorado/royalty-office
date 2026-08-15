import Link from "next/link";
import { cn } from "@/lib/format";

/** The seal — a county-clerk-stamp motif. Drawn in CSS/SVG, no assets. */
export function Seal({ size = 34, dark = false }: { size?: number; dark?: boolean }) {
  const ring = dark ? "#C9A45C" : "#A87B2F";
  const face = dark ? "#F7F4EC" : "#14342B";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke={ring} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke={ring} strokeWidth="1" opacity="0.7" />
      <text
        x="32" y="41"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="24"
        fontWeight="bold"
        fill={face}
      >
        RO
      </text>
    </svg>
  );
}

export function Wordmark({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 no-underline", className)}
      aria-label="Royalty Office — home"
    >
      <Seal size={32} dark={dark} />
      <span
        className={cn(
          "font-display text-[21px] font-semibold leading-none tracking-tight",
          dark ? "text-paper" : "text-ink",
        )}
      >
        Royalty&nbsp;Office
      </span>
    </Link>
  );
}
