import Link from "next/link";
import { Wordmark } from "./Brand";
import { SealWatermark } from "./Backdrops";

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/texas", label: "Texas counties" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-wrap items-center justify-between px-5">
        <Wordmark />
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[13.5px] font-medium text-ink-2 transition-colors hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[13.5px] font-medium text-ink-2 hover:text-ink">
            Sign in
          </Link>
          <Link href="/claim" className="btn-primary !px-4 !py-2 !text-[13px]">
            Claim your card
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-pine-deep text-paper">
      <div className="hairline-brass" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-16 text-paper opacity-[0.05]">
        <SealWatermark size={420} />
      </div>
      <div className="relative mx-auto max-w-wrap px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Wordmark dark />
            <p className="mt-4 max-w-sm font-display text-xl italic leading-snug text-paper/85">
              A family office for your minerals.
            </p>
            <p className="mt-5 max-w-md text-[13px] leading-relaxed text-paper/55">
              Royalty Office is operated by Alamo Exploration LLC. We never
              sell your data to third parties — see our{" "}
              <Link href="/legal/disclosures" className="underline decoration-brass underline-offset-2 hover:text-paper">
                disclosures
              </Link>{" "}
              for exactly how we use it.
            </p>
          </div>
          <div>
            <p className="eyebrow !text-brass">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-paper/80">
              <li><Link href="/how-it-works" className="hover:text-paper">How it works</Link></li>
              <li><Link href="/pricing" className="hover:text-paper">Pricing</Link></li>
              <li><Link href="/claim" className="hover:text-paper">Claim your card</Link></li>
              <li><Link href="/texas" className="hover:text-paper">Texas counties</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow !text-brass">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-paper/80">
              <li><Link href="/about" className="hover:text-paper">About</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-paper">Privacy policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-paper">Terms of service</Link></li>
              <li><Link href="/legal/disclosures" className="hover:text-paper">Disclosures</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-paper/10 pt-6 text-[12px] leading-relaxed text-paper/45">
          <p>
            © 2026 Alamo Exploration LLC, d/b/a Royalty Office. Estimates are
            derived from public records and mathematical models; they are not
            statements of account, reserve reports, title opinions, or
            investment advice. Actual payments are determined solely by your
            operator and your lease.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
