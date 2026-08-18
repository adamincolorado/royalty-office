import { redirect } from "next/navigation";
import { getViewer, activeClaims } from "@/lib/viewer";
import { ClaimAttach } from "@/components/ClaimAttach";

export const metadata = { title: "Claim your interests" };
export const dynamic = "force-dynamic";

/** Post-signup: attach the account to the public record. A user who already
 *  holds a claim has no business here and goes to the dashboard. */
export default async function OnboardingPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "demo" || activeClaims(viewer).length > 0) redirect("/app");

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow">One more step</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Find your name on the rolls
      </h1>
      <p className="mt-3 leading-relaxed text-ink-2">
        Search the name your royalty checks come in — a person, a family
        trust, an LLC. Claiming links your account to the county&rsquo;s public
        record; it never changes title. Verification (a mailed code, or a
        recent check stub) unlocks cashflow detail.
      </p>
      <div className="mt-6">
        <ClaimAttach />
      </div>
    </div>
  );
}
