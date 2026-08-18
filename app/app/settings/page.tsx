import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { DemoSettings } from "./_demo";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending verification",
  verified: "Verified",
  rejected: "Not verified",
  revoked: "Revoked",
};

export default async function SettingsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "demo") return <DemoSettings />;

  const { appUser, claims } = viewer;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="card mt-5 p-5">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <dl className="mt-3 space-y-2 text-[14px]">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Name</dt>
            <dd className="font-medium">{appUser.full_name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Email</dt>
            <dd className="font-medium">{appUser.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Plan</dt>
            <dd className="font-medium">Free beta</dd>
          </div>
        </dl>
        <p className="mt-3 text-[12px] text-ink-3">
          Email and sign-in are managed through the account menu (top right).
        </p>
      </div>

      <div className="card mt-4 p-5">
        <h2 className="font-display text-lg font-semibold">Claims</h2>
        {claims.length === 0 ? (
          <p className="mt-2 text-[14px] text-ink-2">
            No claims yet — <a className="font-medium text-pine hover:underline" href="/onboarding">find your name on the rolls</a>.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {claims.map((c) => (
              <li key={c.claimId} className="rounded-sm border border-line px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{c.ownerName}</p>
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                      (c.status === "verified"
                        ? "bg-pine-soft text-pine"
                        : c.status === "pending"
                          ? "bg-paper-deep text-ink-2"
                          : "bg-paper-deep text-ink-3")
                    }
                  >
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[12.5px] text-ink-3">
                  {c.counties.join(", ")} Count{c.counties.length === 1 ? "y" : "ies"}
                  {c.status === "pending" &&
                    " · verification by mailed code or a recent check stub"}
                </p>
              </li>
            ))}
          </ul>
        )}
        <a href="/onboarding" className="btn-secondary mt-4 inline-block">
          Claim another record
        </a>
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-ink-3">
        A claim links this account to public-record ownership; it is not a title determination
        and never changes title. To remove a claim or delete your account, contact
        support — removals are handled manually so linked records are cleaned up correctly.
      </p>
    </div>
  );
}
