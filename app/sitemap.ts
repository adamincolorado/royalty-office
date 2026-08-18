import type { MetadataRoute } from "next";
import { getCounties, getOperators, getWells } from "@/lib/data";
import { SITE_ORIGIN, PUBLIC_RECORD_PAGES_ARE_REAL } from "@/lib/site";

/**
 * Only real, stable pages are advertised.
 *
 * The county/operator/well routes are the intended growth engine, but today
 * they render fixture data — invented operators ("Pecan Creek Energy") and
 * fabricated API numbers. Those stay out of the sitemap until they are real;
 * see PUBLIC_RECORD_PAGES_ARE_REAL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/how-it-works", "/pricing", "/about", "/claim", "/texas",
    "/legal/privacy", "/legal/terms", "/legal/disclosures"];
  const entries: MetadataRoute.Sitemap = statics.map((p) => ({
    url: `${SITE_ORIGIN}${p}`,
    changeFrequency: "weekly" as const,
  }));
  if (PUBLIC_RECORD_PAGES_ARE_REAL) {
    entries.push(
      ...getCounties().map((c) => ({ url: `${SITE_ORIGIN}/texas/${c.slug}`, changeFrequency: "weekly" as const })),
      ...getOperators().map((o) => ({ url: `${SITE_ORIGIN}/operator/${o.slug}`, changeFrequency: "weekly" as const })),
      ...getWells().map((w) => ({ url: `${SITE_ORIGIN}/well/${w.api}`, changeFrequency: "monthly" as const })),
    );
  }
  return entries;
}
