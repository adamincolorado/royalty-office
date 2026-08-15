import { getOwner } from "@/lib/data";

export const metadata = { title: "Settings" };

export default function Settings() {
  const owner = getOwner();
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
      <div className="card mt-6 p-6">
        <h2 className="font-display text-xl font-semibold">Owner entity</h2>
        <dl className="mt-3 space-y-2 text-[14.5px]">
          <div className="flex justify-between"><dt className="text-ink-3">Name</dt><dd className="font-medium">{owner.name}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-3">Mailing city</dt><dd>{owner.mailingCity}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-3">Interests claimed</dt><dd className="figures">{owner.interests.length}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-3">Verification</dt><dd className="font-medium text-cash">✓ mailed code</dd></div>
        </dl>
      </div>
      <div className="card mt-5 p-6">
        <h2 className="font-display text-xl font-semibold">Alerts</h2>
        <p className="mt-2 text-[14px] text-ink-2">
          Email alerts are on for permits, well status changes, and operator
          changes. SMS alerts arrive with the public beta.
        </p>
      </div>
      <div className="card mt-5 p-6">
        <h2 className="font-display text-xl font-semibold">Plan</h2>
        <p className="mt-2 text-[14px] text-ink-2">
          Demo session — all Owner-plan features unlocked. In production this
          panel manages billing through Stripe.
        </p>
      </div>
    </div>
  );
}
