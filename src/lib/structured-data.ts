import { siteConfig } from "@/config/site";
import type { PublicContactInfo, PublicSocialLinks } from "@/lib/data/site-settings";

/**
 * Tüm structured data (JSON-LD) üreticileri burada toplanır.
 *
 * KURAL: Sadece gerçekten sahip olduğumuz bilgiler eklenir. `contactInfo`
 * alanları (telefon, e-posta, adres) `null` olduğu sürece şemadan tamamen
 * çıkarılır — rating, reviewCount, price, priceRange, çalışan sayısı,
 * kuruluş yılı gibi hiçbir uydurma alan eklenmez.
 */

function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildProfessionalServiceSchema(
  contactInfo: PublicContactInfo,
  social: PublicSocialLinks,
) {
  const sameAs = [social.instagramUrl].filter((href): href is string => Boolean(href));

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.brandName,
    description: siteConfig.description,
    url: siteConfig.url,
    areaServed: "Manisa, Türkiye",
    ...(contactInfo.phone && { telephone: contactInfo.phone }),
    ...(contactInfo.email && { email: contactInfo.email }),
    ...(contactInfo.address && { address: contactInfo.address }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    url: siteConfig.url,
    inLanguage: "tr-TR",
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
    },
  };
}

export type BreadcrumbInput = { label: string; href?: string };

export function buildBreadcrumbSchema(items: BreadcrumbInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: absoluteUrl(item.href) }),
    })),
  };
}

export function buildBlogPostingSchema(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: absoluteUrl(`/blog/${post.slug}`),
    ...(post.imageUrl && { image: [absoluteUrl(post.imageUrl)] }),
    author: {
      "@type": "Organization",
      name: siteConfig.brandName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
    },
  };
}

export function buildServiceSchema(service: {
  title: string;
  shortDescription: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.shortDescription,
    url: absoluteUrl(`/hizmetler/${service.slug}`),
    areaServed: "Manisa, Türkiye",
    provider: {
      "@type": "ProfessionalService",
      name: siteConfig.brandName,
      url: siteConfig.url,
    },
  };
}
