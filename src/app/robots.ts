import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * `/admin` henüz mevcut değil (Faz 2.2+'de eklenecek) ama şimdiden
 * engellenerek, admin paneli devreye girdiğinde arama motorlarının onu
 * indekslemesi baştan önlenmiş oluyor.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
