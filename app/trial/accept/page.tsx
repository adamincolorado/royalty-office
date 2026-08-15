/**
 * Accept an extended-trial offer from a win-back email.
 *
 * The token is the user's unsubscribe_token — the only credential someone
 * reading email has. It cannot be used to view data; it can only start a
 * free trial on the account it belongs to.
 */
import Link from "next/link";
import { acceptTrialByToken } from "@/lib/account";

export const dynamic = "force-dynamic";

export default async function AcceptTrial({
  searchParams,
}: {
  searchParams: { t?: string; seq?: string };
}) {
  const res = await acceptTrialByToken(
    searchParams.t ?? "",
    Number(searchParams.seq ?? 0),
  );

  const until = res.ok && res.expiresAt
    ? new Date(res.expiresAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <main className="mx-auto max-w-lg px-5 py-24">
      <h1 className="text-2xl font-semibold">
        {res.ok
          ? res.alreadyActive
            ? "That trial is already running"
            : `You've got ${res.days} more days`
          : "We couldn't apply that offer"}
      </h1>

      {res.ok ? (
        <>
          <p className="mt-4 text-ink-2">
            Your Owner plan is open{until ? ` until ${until}` : ""}. No card,
            nothing to cancel — it simply stops.
          </p>
          <Link href="/app" className="btn mt-8 inline-block">
            Open your dashboard
          </Link>
        </>
      ) : (
        <p className="mt-4 text-ink-2">
          {res.reason === "bad-seq"
            ? "That link is missing which offer it belongs to."
            : "That link isn't one we recognise — it may have expired or been truncated."}{" "}
          Email <span className="font-medium">hello@royaltyoffice.com</span> and
          we&rsquo;ll sort it out.
        </p>
      )}
    </main>
  );
}
