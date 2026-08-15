import MarketingShell from "@/components/MarketingShell";

export const metadata = { title: "About" };

export default function About() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="eyebrow">About</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          The owner's side of the table
        </h1>
        <div className="mt-6 space-y-5 leading-relaxed text-ink-2">
          <p>
            Most Texas mineral owners are flying blind. The operator has
            engineers, land staff, and revenue accountants. The owner has a
            check stub with a decimal on it and, if something looks off, a
            phone number that rings to a voicemail box.
          </p>
          <p>
            The strange part is that nearly everything the professionals know
            is public. Production volumes are filed with the Railroad
            Commission. Ownership decimals sit on county appraisal rolls.
            Permits, completions, and plugging reports are all a records
            request away. What owners have lacked isn't access — it's the
            thousand hours it takes to read it all.
          </p>
          <p>
            Royalty Office reads it for you. We index the public record for
            all 254 Texas counties, tie every interest to its wells, model
            what each well should be paying, and put it on one page you can
            actually read — whether it's your first royalty check or your
            family's hundredth year of them.
          </p>
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold">
          Who's behind this — and the conflict we're managing
        </h2>
        <div className="mt-4 space-y-5 leading-relaxed text-ink-2">
          <p>
            Royalty Office is operated by <strong className="text-ink">Alamo
            Exploration LLC</strong>, a Texas company whose affiliates also
            acquire mineral interests. We're telling you that in the second
            paragraph of our About page, not in a footnote, because the
            product only works if you trust it.
          </p>
          <p>So the rules are written down, in our{" "}
            <a href="/legal/disclosures" className="font-medium text-pine underline decoration-brass underline-offset-2">disclosures</a>:
            we never sell your information to third parties. We may tell you
            about products and services from our own corporate family —
            including offers on minerals — and every such message carries an
            opt-out that never affects your subscription. Documents you upload
            are never used to price an offer to you, and any transaction with
            an affiliate is arms-length: get independent advice and competing
            offers, always.
          </p>
        </div>

        <h2 id="contact" className="mt-12 font-display text-2xl font-semibold">Contact</h2>
        <div className="mt-4 card p-6 text-[15px] leading-relaxed text-ink-2">
          <p><strong className="text-ink">Royalty Office</strong> · a service of Alamo Exploration LLC</p>
          <p className="mt-1">Family-office inquiries and support: <span className="figures">hello@royaltyoffice.com</span></p>
          <p className="mt-1">Denver · San Antonio</p>
        </div>
      </section>
    </MarketingShell>
  );
}
