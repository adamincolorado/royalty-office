/**
 * One-click unsubscribe. No login: the token IS the credential, because the
 * recipient is holding an email, not a session.
 *
 * force-dynamic because this writes. Without it Next would prerender the
 * route at build time and serve a cached "you're unsubscribed" page that
 * never actually suppressed anything.
 */
import Link from "next/link";
import { unsubscribeByToken } from "@/lib/account";

export const dynamic = "force-dynamic";

export default async function Unsubscribe({
  searchParams,
}: {
  searchParams: { t?: string };
}) {
  const token = searchParams.t ?? "";
  const res = await unsubscribeByToken(token);

  return (
    <main className="mx-auto max-w-lg px-5 py-24">
      <h1 className="text-2xl font-semibold">
        {res.ok ? "You're unsubscribed" : "We couldn't find that link"}
      </h1>

      {res.ok ? (
        <>
          <p className="mt-4 text-ink-2">
            We&rsquo;ve stopped sending marketing email to{" "}
            <span className="font-medium">{res.email}</span>
            {res.alreadyDone ? " — it was already off" : ""}. Anything already
            queued has been cancelled.
          </p>
          <p className="mt-4 text-[13px] text-ink-3">
            Your account and everything in it are untouched. We may still send
            you service messages about your subscription — a receipt, or notice
            that something changed — because those aren&rsquo;t marketing.
          </p>
        </>
      ) : (
        <p className="mt-4 text-ink-2">
          That unsubscribe link isn&rsquo;t one we recognise. It may have been
          truncated by your mail client. Forward the message to{" "}
          <span className="font-medium">privacy@royaltyoffice.com</span> and
          we&rsquo;ll remove you by hand.
        </p>
      )}

      <Link href="/" className="mt-10 inline-block text-[13px] underline">
        Back to Royalty Office
      </Link>
    </main>
  );
}
