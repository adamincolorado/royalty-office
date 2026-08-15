import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Seal, Wordmark } from "@/components/Brand";
import { getOwner, latestMonth } from "@/lib/data";
import { AppNav } from "@/components/AppNav";

export const metadata = { title: "Dashboard" };

/** The authed segment must never be prerendered: pages here are personalized
 *  and cookie-gated, and a static copy would be served before the gate runs. */
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("ro_demo_session");
  if (!session) redirect("/login");
  const owner = getOwner();

  return (
    <div className="flex min-h-screen flex-col">
      {/* demo ribbon */}
      <div className="bg-brass px-4 py-1.5 text-center text-[12px] font-semibold text-pine">
        DEMO — fictional owner, fictional wells, demo price deck. Data through {latestMonth()}.
      </div>

      <header className="border-b border-line bg-paper-card">
        <div className="mx-auto flex max-w-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            {/* seal only on phones; full wordmark from sm up */}
            <Link href="/" className="sm:hidden" aria-label="Royalty Office — home">
              <Seal size={30} />
            </Link>
            <Wordmark className="hidden sm:flex" />
            <span className="min-w-0 truncate rounded-full bg-pine-soft px-3 py-1 text-[12px] font-semibold text-pine">
              <span className="md:hidden">{owner.shortName}</span>
              <span className="hidden md:inline">{owner.name}</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3.5 sm:gap-4">
            <Link href="/app/settings" className="text-sm font-medium text-ink-2 hover:text-ink">
              Settings
            </Link>
            <a href="/api/demo-logout" className="text-sm font-medium text-ink-2 hover:text-ink">
              Sign out
            </a>
          </div>
        </div>
        <AppNav />
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
