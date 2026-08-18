import type { MetadataRoute } from "next";
import { SITE_ORIGIN, PUBLIC_RECORD_PAGES_ARE_REAL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Demo-backed record pages are reachable but must not be indexed while the
  // data on them is invented.
  const disallow = ["/app", "/api"];
  if (!PUBLIC_RECORD_PAGES_ARE_REAL) disallow.push("/well", "/operator", "/texas/");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
