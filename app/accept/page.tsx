import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { hasAccepted, CONSENT_TEXT, LEGAL_VERSION } from "@/lib/consent";
import { AcceptForm } from "@/components/AcceptForm";

export const metadata = { title: "Review and accept" };
export const dynamic = "force-dynamic";

/** Assent gate. Stands between signup and anything else the account can do. */
export default async function AcceptPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "demo") redirect("/app");
  if (await hasAccepted(viewer.appUser.user_id)) redirect("/app");

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="eyebrow">Before we start</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Review and accept
      </h1>
      <p className="mt-3 leading-relaxed text-ink-2">
        Two things worth knowing before you claim a record. Royalty Office is
        operated by Alamo Exploration LLC, whose affiliates buy and lease
        minerals — including from owners who use this service. And everything
        here is an estimate built from public records: useful for
        understanding what you own, never a statement of account and never
        advice about what to do with it.
      </p>
      <AcceptForm consentText={CONSENT_TEXT} version={LEGAL_VERSION} />
    </div>
  );
}
