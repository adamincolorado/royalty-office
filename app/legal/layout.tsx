import MarketingShell from "@/components/MarketingShell";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-14 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink-2 [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:list-disc [&_li]:text-ink-2">
        {children}
      </section>
    </MarketingShell>
  );
}
