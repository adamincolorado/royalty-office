import type { MetadataRoute } from "next";
import { getCounties, getOperators, getWells } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://royaltyoffice.com";
  const statics = ["", "/how-it-works", "/pricing", "/about", "/claim", "/texas",
    "/legal/privacy", "/legal/terms", "/legal/disclosures"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const })),
    ...getCounties().map((c) => ({ url: `${base}/texas/${c.slug}`, changeFrequency: "weekly" as const })),
    ...getOperators().map((o) => ({ url: `${base}/operator/${o.slug}`, changeFrequency: "weekly" as const })),
    ...getWells().map((w) => ({ url: `${base}/well/${w.api}`, changeFrequency: "monthly" as const })),
  ];
}
