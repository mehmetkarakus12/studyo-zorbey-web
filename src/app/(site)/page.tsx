import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildProfessionalServiceSchema,
  buildWebsiteSchema,
} from "@/lib/structured-data";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildPageMetadata } from "@/lib/data/seo-settings";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { FeaturedPortfolio } from "@/components/sections/FeaturedPortfolio";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { CinematicVideo } from "@/components/sections/CinematicVideo";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FinalCta } from "@/components/sections/FinalCta";
import { InstagramPreview } from "@/components/sections/InstagramPreview";
import { ContactPreview } from "@/components/sections/ContactPreview";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "home",
    path: "/",
    fallbackTitle: `${siteConfig.brandName} | ${siteConfig.positioning}`,
    fallbackDescription: siteConfig.description,
  });
}

export default async function HomePage() {
  const { contactInfo, social } = await getSiteSettings();

  return (
    <>
      <JsonLd data={buildWebsiteSchema()} />
      <JsonLd data={buildProfessionalServiceSchema(contactInfo, social)} />

      <Hero />
      <TrustStrip />
      <FeaturedServices />
      <FeaturedPortfolio />
      <AboutPreview />
      <CinematicVideo />
      <Process />
      <Testimonials />
      <BlogPreview />
      <FinalCta />
      <InstagramPreview />
      <ContactPreview />
    </>
  );
}
