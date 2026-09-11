import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { FinalCta } from "@/components/sections/FinalCta";
import { getActivePortfolioCategories, getActivePortfolioProjects } from "@/lib/data/portfolio";
import { buildPageMetadata } from "@/lib/data/seo-settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "portfolyo",
    path: "/portfolyo",
    fallbackTitle: "Portfolyo",
    fallbackDescription:
      "Manisa'da çektiğimiz düğün, nişan, kına, dış çekim ve stüdyo projelerinden bir seçki.",
  });
}

export default async function PortfolioPage(
  props: PageProps<"/portfolyo">,
) {
  const searchParams = await props.searchParams;
  const kategoriParam = searchParams.kategori;
  const initialCategorySlug = Array.isArray(kategoriParam)
    ? kategoriParam[0]
    : kategoriParam;

  const [categories, projects] = await Promise.all([
    getActivePortfolioCategories(),
    getActivePortfolioProjects(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Portfolyo"
        title="Hikâyelerin İzini Sürüyoruz"
        description="Düğün, nişan, kına, dış çekim ve stüdyo projelerimizden bir seçki."
      />

      <PortfolioGallery
        categories={categories}
        projects={projects}
        initialCategorySlug={initialCategorySlug}
      />

      <FinalCta />
    </>
  );
}
