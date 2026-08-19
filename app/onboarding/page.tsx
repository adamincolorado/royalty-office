import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer, activeClaims } from "@/lib/viewer";
import { hasAccepted } from "@/lib/consent";
import { ClaimAttach } from "@/components/ClaimAttach";

export const metadata = { title: "Claim your interests" };
export const dynamic = "force-dynamic";

/**
 * Claim attach. Reached two ways, and both must work:
 *   - post-signup, when the account has no claims (the app layout sends
 *     them here rather than render an empty dashboard), and
 *   - deliberately, from Settings → "Claim another record", because heirs
 *     and family trusts routinely hold interests under several names.
 *
 * An earlier version redirected anyone with a claim straight back to /app,
 * which made that Settings link a dead end. Only the demo tour is turned
 * away — it has no account to attach anything to.
 */
export default async function OnboardingPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "demo") redirect("/app");
  if (!(await hasAccepted(viewer.appUser.user_id))) redirect("/accept");

  const existing = activeClaims(viewer);
  const isFirst = existing.length === 0;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow">{isFirst ? "One more step" : "Add a record"}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {isFirst ? "Find your name on the rolls" : "Claim another record"}
      </h1>
      <p className="mt-3 leading-relaxed text-ink-2">
        Search the name your royalty checks come in — a person, a family
        trust, an LLC. Claiming links your account to the county&rsquo;s public
        record; it never changes title. Verification (a mailed code, or a
        recent check stub) unlocks cashflow detail.
      </p>

      {!isFirst && (
        <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
          Already claimed: {existing.map((c) => c.ownerName).join(", ")}.
        </p>
      )}

      <div className="mt-6">
        <ClaimAttach />
      </div>

      {!isFirst && (
        <p className="mt-6">
          <Link href="/app" className="text-[13px] font-medium text-pine hover:underline">
            ← Back to your dashboard
          </Link>
        </p>
      )}
    </div>
  );
}
