import { SignUp } from "@clerk/nextjs";
import MarketingShell from "@/components/MarketingShell";
import { Seal } from "@/components/Brand";

export const metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-md px-5 py-16">
        <div className="mb-6 flex justify-center">
          <Seal size={44} />
        </div>
        <SignUp
          appearance={{ elements: { rootBox: "mx-auto", card: "shadow-none border border-line" } }}
        />
        <p className="mt-6 text-center text-[12px] leading-relaxed text-ink-3">
          Creating an account lets you claim your interests. Cashflow figures
          unlock after we verify you own them — see How it works.
        </p>
      </section>
    </MarketingShell>
  );
}
