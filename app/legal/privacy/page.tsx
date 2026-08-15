export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <article>
      <p className="eyebrow">Legal</p>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-ink-3">Last updated: August 2026 · This is a launch-draft policy and will be finalized with counsel before public release.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account data</strong> — name, email, and the owner entities you claim.</li>
        <li><strong>Verification data</strong> — the mailing address we send codes to (drawn from public county rolls) and documents you choose to upload.</li>
        <li><strong>Usage data</strong> — pages viewed and features used, to operate and improve the service.</li>
        <li><strong>Billing data</strong> — handled by our payment processor; we never store card numbers.</li>
      </ul>

      <h2>What we do with it</h2>
      <p>
        We use your data to provide the service, verify ownership claims,
        send alerts you enable, and support you. We do not sell personal
        information. We do not share it with third parties except processors
        necessary to run the service (hosting, payments, mail, messaging),
        each bound to use it only for that purpose.
      </p>

      <h2>The acquisition wall</h2>
      <p>
        Royalty Office is operated by Alamo Exploration LLC, whose affiliates
        acquire mineral interests. Your portal activity and uploads are never
        used for acquisition targeting or outreach. See our Disclosures for
        the full commitment.
      </p>

      <h2>Public records</h2>
      <p>
        The wells, production volumes, and ownership-roll entries shown in the
        product derive from public government records. Publishing organized
        public records is not collection of your personal information;
        claiming a card links your account to those records at your request.
      </p>

      <h2>Retention and deletion</h2>
      <p>
        You may delete your account at any time, which removes your login,
        claims, and uploads. Public-record data remains, as it exists
        independently of your account. Consent and verification records are
        retained as required for legal compliance.
      </p>

      <h2>Contact</h2>
      <p>privacy@royaltyoffice.com</p>
    </article>
  );
}
