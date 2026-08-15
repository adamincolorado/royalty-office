export const metadata = { title: "Disclosures" };

export default function Disclosures() {
  return (
    <article>
      <p className="eyebrow">Legal</p>
      <h1>Disclosures</h1>
      <p className="text-sm text-ink-3">Last updated: August 2026</p>

      <h2>Who operates Royalty Office</h2>
      <p>
        Royalty Office is a trade name of Alamo Exploration LLC, a Texas
        limited liability company. Affiliates of Alamo Exploration LLC engage
        in the acquisition of mineral and royalty interests.
      </p>

      <h2>The information wall</h2>
      <p>
        Your activity inside Royalty Office — searches, claims, pages viewed,
        forecasts run, documents uploaded — is used to provide the service to
        you and for nothing else. Specifically:
      </p>
      <ul>
        <li>Portal activity is never provided to any acquisition team or affiliate for the purpose of identifying, valuing, or soliciting interests to purchase.</li>
        <li>Documents you upload (check stubs, division orders) are visible to you and to support staff assisting you, and are never used in acquisition underwriting.</li>
        <li>We do not sell, rent, or share subscriber data with third parties for marketing.</li>
      </ul>
      <p>
        If you ever receive an unsolicited purchase offer from an affiliate,
        it was generated from public records available to any buyer — not from
        your use of this product.
      </p>

      <h2>Estimates, not statements</h2>
      <p>
        Figures shown in Royalty Office are estimates computed from public
        records — Railroad Commission of Texas production filings, county
        appraisal district mineral rolls, and similar sources — combined with
        mathematical models. They are not statements of account. Your
        operator's division orders, lease terms, and revenue statements govern
        what you are actually paid.
      </p>

      <h2>Forecasts and prices</h2>
      <p>
        Forward projections use published futures ("strip") prices as of a
        stated date, held flat beyond quoted tenors, with modeled taxes and
        deductions. They are volume forecasts priced at market quotes — not
        price predictions, not valuations of your property, and not an offer
        or solicitation of any kind. Royalty Office is not an investment
        adviser, broker, landman service, or law firm, and nothing in the
        product is investment, legal, tax, or engineering advice.
      </p>

      <h2>Data limitations</h2>
      <ul>
        <li>Texas oil production is reported at the lease level; per-well figures are allocations and are labeled as such.</li>
        <li>RRC production data arrives on an approximately 2–4 month reporting lag.</li>
        <li>County mineral rolls are updated annually and may lag ownership changes, probates, and transfers.</li>
      </ul>
    </article>
  );
}
