import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Seal, Wordmark } from "@/components/Brand";
import { getOwner, latestMonth } from "@/lib/data";
import { getViewer, activeClaims } from "@/lib/viewer";
import { AppNav } from "@/components/AppNav";

export const metadata = { title: "Dashboard" };

/** The authed segment must never be prerendered: pages here are personalized
 *  and cookie-gated, and a static copy would be served before the gate runs. */
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Clerk is the real door; the demo cookie exists only where the demo
  // routes exist — development. getViewer() resolves both and materializes
  // the app.users row on first authenticated request. Entitlement still
  // comes from claims, never from the session.
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  const isDemo = viewer.kind === "demo";
  const claims = isDemo ? [] : activeClaims(viewer);
  // A real account with nothing claimed has nothing to show — send it to
  // claim attach rather than render an empty shell.
  if (!isDemo && claims.length === 0) redirect("/onboarding");

  const chip = isDemo
    ? { short: getOwner().shortName, full: getOwner().name }
    : { short: claims[0].ownerName, full: claims[0].ownerName };
  const pendingOnly = !isDemo && claims.every((c) => c.status === "pending");

  return (
    <div className="flex min-h-screen flex-col">
      {/* The label belongs to the DATA. Demo data says so loudly; a real
          pending claim says what is locked and why. Verified says nothing. */}
      {isDemo && (
        <div className="bg-brass px-4 py-1.5 text-center text-[12px] font-semibold text-pine">
          DEMO — fictional owner, fictional wells, demo price deck. Data through {latestMonth()}.
        </div>
      )}
      {pendingOnly && (
        <div className="bg-paper-deep px-4 py-1.5 text-center text-[12px] font-semibold text-ink-2">
          Claim pending verification — public-record details are open; cashflow unlocks at verified.
        </div>
      )}

      <header className="border-b border-line bg-paper-card">
        <div className="mx-auto flex max-w-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            {/* seal only on phones; full wordmark from sm up */}
            <Link href="/" className="sm:hidden" aria-label="Royalty Office — home">
              <Seal size={30} />
            </Link>
            <Wordmark className="hidden sm:flex" />
            <span className="min-w-0 truncate rounded-full bg-pine-soft px-3 py-1 text-[12px] font-semibold text-pine">
              <span className="md:hidden">{chip.short}</span>
              <span className="hidden md:inline">{chip.full}</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3.5 sm:gap-4">
            <Link href="/app/settings" className="text-sm font-medium text-ink-2 hover:text-ink">
              Settings
            </Link>
            {isDemo ? (
              <a href="/api/demo-logout" className="text-sm font-medium text-ink-2 hover:text-ink">
                Exit demo
              </a>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </div>
        <AppNav variant={isDemo ? "demo" : "owner"} />
      </header>

      <main className="mx-auto w-full max-w-wrap flex-1 px-5 py-8">{children}</main>

      <footer className="border-t border-line bg-paper-deep px-5 py-4">
        <p className="mx-auto max-w-wrap text-[11.5px] leading-relaxed text-ink-3">
          Estimates from public records and models — not statements of account,
          not investment advice, not a basis for any decision. Operator
          statements govern actual payment. Royalty Office is operated by
          Alamo Exploration LLC · we never sell your data to third parties ·
          see Disclosures and Terms.
        </p>
      </footer>
    </div>
  );
}
