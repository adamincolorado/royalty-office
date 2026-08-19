export const metadata = { title: "Terms of Service" };

/**
 * CANONICAL TERMS TEXT. Drafted for attorney review — see
 * ops/royalty_office/ATTORNEY_REVIEW_MEMO.md in the internal repo for the
 * flagged decisions (arbitration, DTPA, auto-renewal, TDPSA).
 * ALL-CAPS sections are deliberately conspicuous (UCC/DTPA conventions).
 */
export default function Terms() {
  return (
    <article>
      <p className="eyebrow">Legal</p>
      <h1>Terms of Service</h1>
      <p className="text-sm text-ink-3">
        Version 2026-08-15 (launch draft — under attorney review). These Terms
        are a binding agreement. Please read them; they include disclaimers of
        warranties, a release of claims, a limitation of liability, an
        arbitration agreement, and a class-action waiver.
      </p>

      <h2>1. Agreement and acceptance</h2>
      <p>
        These Terms of Service (the &ldquo;Terms&rdquo;) are an agreement
        between you and Alamo Exploration LLC, a Texas limited liability
        company, doing business as Royalty Office (&ldquo;Royalty
        Office,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). By creating an
        account, clicking a box or button indicating acceptance, or using the
        Service, you accept these Terms and our Privacy Policy, and you
        consent to transact with us electronically under the U.S. E-SIGN Act
        and the Texas Uniform Electronic Transactions Act. If you do not
        agree, do not use the Service. Before you can claim a record or view any
        data, we ask you to tick an unbundled box — never pre-checked —
        accepting these Terms and our Privacy Policy, and we record your
        account, the date and time, the version and a hash of the text you
        accepted, and the IP address and browser you accepted from.
      </p>

      <h2>2. What the Service is — and what it is not</h2>
      <p>
        The Service organizes public governmental records concerning Texas
        oil-and-gas wells and mineral ownership and applies mathematical
        models to them to produce estimates, projections, visualizations, and
        alerts (collectively, &ldquo;Content&rdquo;). The Content is provided
        strictly for <strong>general informational, educational, and
        entertainment purposes</strong>. Estimates and projections are
        inherently speculative.
      </p>
      <p>The Service is NOT, and you agree you will not treat it as:</p>
      <ul>
        <li>investment, financial, legal, tax, accounting, engineering, geological, or other professional advice, or a substitute for any of them;</li>
        <li>a statement of account, payment record, or billing document — your operator&rsquo;s division orders, your lease, and your operator&rsquo;s revenue statements exclusively govern what you are owed and paid;</li>
        <li>a reserve report, fair-market-value opinion, appraisal, or valuation of any property;</li>
        <li>a title opinion, title examination, runsheet, or determination of ownership of any interest;</li>
        <li>an offer, solicitation, or recommendation to buy, sell, lease, retain, or otherwise transact in any mineral or royalty interest or any other asset; or</li>
        <li>brokerage, landman, advisory, or fiduciary services of any kind.</li>
      </ul>
      <p>
        No fiduciary, advisory, attorney-client, or other professional
        relationship is created by your use of the Service, by any
        communication with us, or by any Content. For decisions of any
        consequence, retain your own licensed attorney, certified public
        accountant, petroleum engineer, or other qualified professional.
      </p>

      <h2>3. Data sources, limitations, and errors</h2>
      <p>
        Content derives from public records (including Railroad Commission of
        Texas filings and county appraisal district mineral rolls) and from
        models applied to them. You acknowledge that:
      </p>
      <ul>
        <li>public records contain errors, omissions, misspellings, and delays, and we do not and cannot independently verify them;</li>
        <li>Texas reports oil production at the lease level; per-well figures are mathematical allocations, not measurements;</li>
        <li>production data is published on a substantial lag (typically two to four months) and recent months may be incomplete or restated;</li>
        <li>ownership rolls are updated periodically and may not reflect transfers, probate, divorces, foreclosures, or corrections;</li>
        <li>decline-curve models, price assumptions, tax and deduction assumptions, and every other modeling choice involve judgment and simplification, and actual outcomes WILL differ, possibly materially; and</li>
        <li>a well, permit, or interest shown as associated with a name — including yours — may in fact belong to a different person, may be misattributed, or may not exist as described.</li>
      </ul>

      <h2>4. NO RELIANCE</h2>
      <p>
        YOU AGREE THAT YOU WILL NOT RELY ON THE SERVICE OR ANY CONTENT FOR ANY
        DECISION OR PURPOSE OTHER THAN GENERAL INFORMATION, AND THAT ANY
        RELIANCE YOU NEVERTHELESS PLACE ON THE SERVICE OR ANY CONTENT IS
        ENTIRELY AT YOUR OWN RISK. WITHOUT LIMITATION, YOU AGREE NOT TO USE
        THE SERVICE OR ANY CONTENT AS A BASIS FOR: BUYING, SELLING, LEASING,
        RETAINING, GIFTING, DEVISING, OR ENCUMBERING ANY PROPERTY OR INTEREST;
        ACCEPTING OR REJECTING ANY OFFER; BORROWING OR LENDING; TAX OR ESTATE
        PLANNING; LITIGATION OR DISPUTE DECISIONS; EMPLOYMENT, RETIREMENT, OR
        OTHER LIVELIHOOD DECISIONS; OR ANY OTHER DECISION OF FINANCIAL,
        LEGAL, OR PERSONAL CONSEQUENCE. BEFORE ANY SUCH DECISION, YOU WILL
        INDEPENDENTLY VERIFY ALL MATERIAL FACTS FROM AUTHORITATIVE SOURCES AND
        CONSULT QUALIFIED PROFESSIONALS OF YOUR OWN CHOOSING.
      </p>

      <h2>5. Forward-looking estimates</h2>
      <p>
        Projections in the Service apply published futures prices, held flat
        beyond quoted tenors, to modeled volumes, less modeled taxes and
        deductions. They are not predictions of prices, production, or
        payments; they are arithmetic on stated assumptions. We do not state
        or imply that you will receive any amount of money at any time.
        Statements such as an expected division-order or payment window are
        descriptions of general statutory timelines, not promises of payment
        or legal advice about your situation.
      </p>

      <h2>6. Accounts, claims, and verification</h2>
      <ul>
        <li>You must be at least 18 and able to form a binding contract. You are responsible for your credentials and for activity under your account.</li>
        <li>&ldquo;Claiming&rdquo; an owner card associates your account with public-record entries. It is not a determination that you own anything, and our verification steps (mailed codes, document review, database checks) are fraud-deterrence measures, not title work. We may grant, deny, limit, or revoke any claim at our discretion, including where records are ambiguous or contested.</li>
        <li>Multiple persons may claim overlapping interests (families and estates are complicated); we do not adjudicate disputes and may show the same records to multiple verified claimants.</li>
        <li>You represent that information and documents you submit are yours to submit and accurate, and that you have a good-faith basis to act for any entity you claim.</li>
        <li>You consent to our use of third-party identity- and records-verification services in connection with your claims.</li>
      </ul>

      <h2>7. Subscriptions, billing, and cancellation</h2>
      <ul>
        <li>Paid plans bill in advance, monthly or annually, and AUTOMATICALLY RENEW at the then-current price until canceled. Renewal terms are disclosed at checkout.</li>
        <li>You may cancel at any time in your account settings or by emailing support; cancellation takes effect at the end of the current billing period. Except where required by law or expressly stated, fees are non-refundable; annual plans may be pro-rated within the first 60 days as described at checkout.</li>
        <li>We may change prices or features prospectively with reasonable notice; continued use after the effective date is acceptance.</li>
        <li>Taxes are your responsibility where applicable.</li>
      </ul>

      <h2>8. Affiliation, internal marketing, and data</h2>
      <p>
        Royalty Office is operated by Alamo Exploration LLC, whose affiliates
        engage in the acquisition and leasing of mineral and royalty
        interests (the &ldquo;Corporate Family&rdquo;). You acknowledge this
        affiliation, and you agree that:
      </p>
      <ul>
        <li>we may use your contact information and account information WITHIN the Corporate Family for internal business purposes, including sending you marketing about products and services of the Corporate Family — which may include offers to purchase or lease mineral or royalty interests;</li>
        <li>we do NOT sell your personal information to unaffiliated third parties;</li>
        <li>you may opt out of marketing communications at any time (unsubscribe link, reply STOP to texts, or account settings), and opting out does not affect your subscription; and</li>
        <li>any transaction you may ever enter with any member of the Corporate Family is a separate arms-length transaction, on its own terms, in which we do not represent you and owe you no advisory or fiduciary duty; you are encouraged to seek independent advice and competing offers.</li>
      </ul>
      <p>Our Privacy Policy describes our data practices in full and is part of these Terms.</p>

      <h2>9. Acceptable use</h2>
      <ul>
        <li>No scraping, bulk export, resale, or redistribution of the Service or its data compilations; no benchmarking for a competing service.</li>
        <li>No claiming interests you lack a good-faith basis to claim; no impersonation; no circumvention of verification or access controls.</li>
        <li>No use of the Service to harass any person, to violate any law, or to infringe any right.</li>
        <li>We may suspend or terminate accounts that violate these Terms, abuse the Service, or create risk for us or others.</li>
      </ul>

      <h2>10. Intellectual property</h2>
      <p>
        The Service, its software, design, compilations, models, and Content
        are owned by us or our licensors and protected by law. We grant you a
        personal, limited, revocable, non-transferable license to use the
        Service for your own non-commercial informational purposes (or, on a
        Family Office plan, your organization&rsquo;s internal informational
        purposes). Public records remain public; our selection, arrangement,
        enhancement, and presentation of them are ours. Feedback you provide
        may be used without restriction or compensation.
      </p>

      <h2>11. DISCLAIMER OF WARRANTIES</h2>
      <p>
        THE SERVICE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND
        &ldquo;AS AVAILABLE,&rdquo; WITH ALL FAULTS AND WITHOUT WARRANTY OF
        ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
        WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ANY WARRANTY OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
        NON-INFRINGEMENT, ACCURACY, COMPLETENESS, TIMELINESS, RELIABILITY,
        AVAILABILITY, OR THAT THE SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED.
        NO ORAL OR WRITTEN INFORMATION OBTAINED FROM US CREATES ANY WARRANTY.
      </p>

      <h2>12. RELEASE AND WAIVER OF CLAIMS</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, YOU, FOR YOURSELF
        AND YOUR HEIRS, EXECUTORS, ADMINISTRATORS, SUCCESSORS, AND ASSIGNS,
        IRREVOCABLY RELEASE, WAIVE, AND DISCHARGE ROYALTY OFFICE, ALAMO
        EXPLORATION LLC, AND THEIR RESPECTIVE AFFILIATES, OWNERS, MANAGERS,
        OFFICERS, EMPLOYEES, CONTRACTORS, LICENSORS, AND DATA PROVIDERS (THE
        &ldquo;RELEASED PARTIES&rdquo;) FROM ANY AND ALL CLAIMS, DEMANDS,
        LOSSES, DAMAGES, AND CAUSES OF ACTION OF EVERY KIND, WHETHER KNOWN OR
        UNKNOWN, SUSPECTED OR UNSUSPECTED, ARISING OUT OF OR RELATING TO: (a)
        THE SERVICE OR ANY CONTENT; (b) ANY ERROR, OMISSION, DELAY, OR
        INACCURACY IN ANY CONTENT; (c) ANY ESTIMATE, PROJECTION, ALERT, OR
        STATEMENT IN OR FROM THE SERVICE NOT MATCHING ACTUAL EVENTS, WELLS,
        OWNERSHIP, PRODUCTION, OR PAYMENTS — INCLUDING ANY CLAIM IN THE
        NATURE OF &ldquo;I WAS TOLD I WOULD RECEIVE X,&rdquo; &ldquo;I WAS
        SHOWN AS OWNING AN INTEREST I DO NOT OWN,&rdquo; OR &ldquo;AN
        INTEREST I OWN WAS NOT SHOWN&rdquo;; (d) ANY DECISION MADE OR ACTION
        TAKEN OR NOT TAKEN IN ANY DEGREE OF RELIANCE ON THE SERVICE OR ANY
        CONTENT; AND (e) ANY DEALINGS BETWEEN YOU AND ANY OPERATOR, PAYOR, OR
        THIRD PARTY. IF YOU RESIDE IN A JURISDICTION THAT LIMITS RELEASES OF
        UNKNOWN CLAIMS (SUCH AS CALIFORNIA CIVIL CODE §1542), YOU EXPRESSLY
        WAIVE THE BENEFIT OF ANY SUCH LIMITATION TO THE EXTENT PERMITTED.
        THIS RELEASE DOES NOT APPLY TO LIABILITY THAT CANNOT BE RELEASED AS A
        MATTER OF LAW, INCLUDING LIABILITY ARISING FROM OUR FRAUD OR WILLFUL
        MISCONDUCT.
      </p>

      <h2>13. LIMITATION OF LIABILITY</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW: (a) NO RELEASED PARTY WILL BE
        LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
        EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST REVENUES,
        LOST SAVINGS, LOST OPPORTUNITIES, DIMINUTION IN VALUE, OR LOSS OF
        DATA, HOWEVER CAUSED AND UNDER ANY THEORY, EVEN IF ADVISED OF THE
        POSSIBILITY; AND (b) THE AGGREGATE LIABILITY OF ALL RELEASED PARTIES
        FOR ALL CLAIMS RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER OF
        FIFTY DOLLARS (US $50) OR THE AMOUNTS YOU PAID US FOR THE SERVICE IN
        THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM.
        THESE LIMITS APPLY EVEN IF A REMEDY FAILS OF ITS ESSENTIAL PURPOSE,
        AND ARE A FUNDAMENTAL BASIS OF THE BARGAIN WITHOUT WHICH WE WOULD NOT
        OFFER THE SERVICE AT ITS PRICE.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You will defend, indemnify, and hold harmless the Released Parties
        from and against claims, damages, and expenses (including reasonable
        attorneys&rsquo; fees) arising out of your breach of these Terms,
        your misuse of the Service, your violation of law or third-party
        rights, information or documents you submit, or disputes between you
        and any other claimant, family member, operator, or third party.
      </p>

      <h2>15. Dispute resolution — ARBITRATION AND CLASS WAIVER</h2>
      <ul>
        <li><strong>Informal first.</strong> Before filing any claim, you agree to email legal@royaltyoffice.com a written description and give us 30 days to resolve it.</li>
        <li><strong>Binding arbitration.</strong> Any dispute arising out of or relating to these Terms or the Service will be resolved by BINDING INDIVIDUAL ARBITRATION administered by the American Arbitration Association under its Consumer Arbitration Rules, rather than in court, except that either party may bring an individual claim in small-claims court, and either party may seek injunctive relief for intellectual-property misuse.</li>
        <li><strong>CLASS ACTION WAIVER.</strong> ALL DISPUTES WILL BE ARBITRATED OR LITIGATED ONLY ON AN INDIVIDUAL BASIS. NEITHER PARTY MAY PARTICIPATE IN A CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING, AND THE ARBITRATOR MAY NOT CONSOLIDATE CLAIMS.</li>
        <li><strong>JURY WAIVER.</strong> To the extent any matter proceeds in court, BOTH PARTIES WAIVE TRIAL BY JURY.</li>
        <li><strong>Opt-out.</strong> You may opt out of this arbitration agreement by emailing legal@royaltyoffice.com within 30 days of first accepting these Terms, stating your name, account email, and intent to opt out.</li>
        <li>The Federal Arbitration Act governs this Section. Arbitration will be conducted in English, by videoconference or, if in person, in Bexar County, Texas, unless the administrator&rsquo;s consumer rules require otherwise.</li>
      </ul>

      <h2>16. Governing law and venue</h2>
      <p>
        These Terms are governed by the laws of the State of Texas, without
        regard to conflicts rules. Subject to Section 15, exclusive venue for
        any court proceeding is the state or federal courts sitting in Bexar
        County, Texas, and you consent to their jurisdiction.
      </p>

      <h2>17. Changes, termination, survival</h2>
      <p>
        We may modify these Terms prospectively; material changes will be
        notified by email or in-product, and continued use after the
        effective date is acceptance. We may modify or discontinue the
        Service at any time. You may stop using the Service at any time.
        Sections 2–5, 8, and 10–20 survive termination.
      </p>

      <h2>18. Communications</h2>
      <p>
        You consent to receive service and transactional communications
        electronically. Marketing communications are governed by Section 8
        and our Privacy Policy; text-message programs are governed by their
        own posted disclosures and require separate opt-in.
      </p>

      <h2>19. Miscellaneous</h2>
      <p>
        These Terms and the Privacy Policy are the entire agreement between
        you and us regarding the Service and supersede all prior
        understandings. If any provision is held unenforceable, it will be
        modified to the minimum extent necessary and the remainder will stand
        — except that if the class-action waiver is held unenforceable as to
        a dispute, Section 15 is void as to that dispute. No waiver is
        implied from any failure to enforce. You may not assign these Terms;
        we may assign them within the Corporate Family or in connection with
        a reorganization or sale. We are not liable for delay or failure due
        to events beyond our reasonable control. Section headings are for
        convenience only.
      </p>

      <h2>20. Contact</h2>
      <p>
        Alamo Exploration LLC d/b/a Royalty Office ·
        legal@royaltyoffice.com · 2130 Osceola St, Denver, CO 80212 (mailing).
      </p>
    </article>
  );
}
