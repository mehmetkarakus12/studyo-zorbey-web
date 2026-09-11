import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getActiveServices } from "@/lib/data/services";
import { getActivePortfolioProjects } from "@/lib/data/portfolio";
import { getPublishedBlogPosts } from "@/lib/data/blog";

export const revalidate = 3600;

/**
 * Statik/dinamik tüm public route'ları tek merkezden üretir. Domain
 * `siteConfig.url`'den gelir — production domain değiştiğinde tek satır
 * güncellenir, burada hard-code edilmez. Dinamik slug'lar (hizmetler,
 * portfolyo, blog) artık gerçek Supabase verisinden (yalnızca
 * aktif/yayınlanmış kayıtlar) okunur.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/hizmetler`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/portfolyo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/hakkimizda`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/iletisim`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${base}/randevu-al`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${base}/teklif-al`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${base}/gizlilik-politikasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/cerez-politikasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/kvkk`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const [services, portfolioProjects, blogPosts] = await Promise.all([
    getActiveServices(),
    getActivePortfolioProjects(),
    getPublishedBlogPosts(),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/hizmetler/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
    url: `${base}/portfolyo/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.published_at ?? post.updated_at),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...blogRoutes];
}
