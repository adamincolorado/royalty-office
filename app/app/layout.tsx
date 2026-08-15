import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/Brand";
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
        DEMO — fictional owner, fictional wells, demo strip. Data through {latestMonth()}.
      </div>

      <header className="border-b border-line bg-paper-card">
        <div className="mx-auto flex max-w-wrap items-center justify-between px-5 py-3">
          <div className="flex items-center gap-6">
            <Wordmark />
            <span className="hidden rounded-full bg-pine-soft px-3 py-1 text-[12px] font-semibold text-pine md:inline">
              {owner.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
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
          not investment advice. Operator statements govern actual payment.
          Royalty Office is operated by Alamo Exploration LLC · portal activity
          is never used for acquisition outreach.
        </p>
      </footer>
    </div>
  );
}
