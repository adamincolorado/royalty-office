export const metadata = { title: "Disclosures" };

/** CANONICAL DISCLOSURES — launch draft for attorney review. */
export default function Disclosures() {
  return (
    <article>
      <p className="eyebrow">Legal</p>
      <h1>Disclosures</h1>
      <p className="text-sm text-ink-3">Version 2026-08-15 (launch draft — under attorney review).</p>

      <h2>Who operates Royalty Office</h2>
      <p>
        Royalty Office is a trade name of Alamo Exploration LLC, a Texas
        limited liability company. Affiliates of Alamo Exploration LLC engage
        in the acquisition and leasing of mineral and royalty interests. We
        disclose this prominently because you should read everything in the
        Service knowing who built it.
      </p>

      <h2>Informational purposes only — no advice, no reliance</h2>
      <p>
        Everything in the Service is general information assembled from
        public records and models. It is inherently speculative, is not
        investment, legal, tax, engineering, or other professional advice,
        is not a statement of account or a valuation, and must not be used
        as the basis for any decision of financial, legal, or personal
        consequence. Your operator&rsquo;s division orders, your lease, and
        your operator&rsquo;s statements exclusively govern what you are
        owed. Independently verify anything that matters and engage your own
        professionals. Our Terms of Service contain a no-reliance agreement,
        a release of claims, and a limitation of liability; by using the
        Service you accept them.
      </p>

      <h2>Estimates and projections</h2>
      <p>
        Projections apply published futures prices (held flat beyond quoted
        tenors) to modeled volumes, less modeled taxes and deductions. They
        are arithmetic on stated assumptions — not predictions and not
        promises. Actual production, prices, deductions, and payments will
        differ, possibly materially. Statements about expected
        division-order or payment timing describe general statutory
        timelines only.
      </p>

      <h2>Data limitations</h2>
      <ul>
        <li>Texas reports oil production at the lease level; per-well figures are allocations.</li>
        <li>Railroad Commission production data lags roughly 2–4 months and may be restated.</li>
        <li>County mineral rolls update periodically and can lag transfers, probates, and corrections; name matches can be wrong in either direction.</li>
        <li>Satellite change detection is probabilistic and can miss activity or flag non-well activity.</li>
      </ul>

      <h2>Marketing and data practices</h2>
      <p>
        We do <strong>not sell your personal information to unaffiliated
        third parties</strong>. We may use your contact and account
        information <strong>within the Alamo Exploration corporate
        family</strong> for internal purposes, <strong>including
        marketing</strong> — which may include offers to purchase or lease
        mineral or royalty interests. Every marketing message carries an
        opt-out, and opting out never affects your subscription. Documents
        you upload are never used to price or underwrite an offer to you.
        If you transact with any member of the corporate family, that is a
        separate, arms-length transaction in which we do not represent you;
        get independent advice and competing offers.
      </p>

      <h2>Verification is not title work</h2>
      <p>
        Claiming and verifying an owner card is a fraud-deterrence process,
        not a title examination. It does not establish, confirm, or
        adjudicate ownership, and overlapping claims by multiple family
        members or parties may coexist.
      </p>

      <h2>Not a brokerage or advisory service</h2>
      <p>
        Royalty Office is not a broker, dealer, investment adviser, landman
        service, law firm, or engineering firm, and no communication from
        the Service or our team constitutes professional services or creates
        a professional-client relationship.
      </p>
    </article>
  );
}
