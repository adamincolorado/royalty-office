/**
 * Canonical facts about where this site lives.
 *
 * www is the serving host: the apex 308-redirects to it at the edge. Until
 * 2026-08-18 metadataBase, robots and every sitemap <loc> all advertised the
 * apex, so every URL we handed a crawler was a redirect, with no canonical
 * tag to break the tie. One constant now, imported everywhere.
 */
export const SITE_ORIGIN = "https://www.royaltyoffice.com";

/**
 * Whether the public county/operator/well pages are backed by real records.
 *
 * They are not yet: they render the committed demo fixture. Fabricated well
 * and operator pages must never be advertised to a search engine under this
 * domain — the company's affiliate buys minerals from the people who would
 * find them, and an invented well page indexed as fact is the kind of thing
 * that is quoted back at you. Flip this to true only when those routes read
 * from core.* and generateStaticParams enumerates real records.
 */
export const PUBLIC_RECORD_PAGES_ARE_REAL = false;
