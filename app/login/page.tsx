import MarketingShell from "@/components/MarketingShell";
import { Seal } from "@/components/Brand";

export const metadata = { title: "Sign in" };

export default function Login() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-md px-5 py-20">
        <div className="card p-8 text-center">
          <div className="flex justify-center"><Seal size={44} /></div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            Accounts open with the public beta. Until then, tour the product as
            the Hargrove Family Mineral Trust — a fictional owner with twenty
            interests across three counties.
          </p>
          <a href="/api/demo-session?to=/app" className="btn-primary mt-6 w-full">
            Enter the demo
          </a>
          <p className="mt-4 text-[12px] text-ink-3">
            Demo data is fictional. In production this page is passwordless
            email sign-in with optional two-factor.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
