import { SignIn } from "@clerk/nextjs";
import MarketingShell from "@/components/MarketingShell";
import { Seal } from "@/components/Brand";
import { DemoEntry } from "@/components/DemoEntry";

export const metadata = { title: "Sign in" };

/** Catch-all segment: Clerk drives multi-step flows (code entry, factor two,
 *  reset) as sub-paths of this route, so a plain /login page would 404 partway
 *  through a sign-in. */
export default function LoginPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-md px-5 py-16">
        <div className="mb-6 flex justify-center">
          <Seal size={44} />
        </div>
        <SignIn
          appearance={{ elements: { rootBox: "mx-auto", card: "shadow-none border border-line" } }}
        />
        <DemoEntry />
      </section>
    </MarketingShell>
  );
}
