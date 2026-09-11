import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DetailHero } from "@/components/sections/DetailHero";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getActivePortfolioProjects,
  getPortfolioGalleryImages,
  getPortfolioProjectBySlug,
} from "@/lib/data/portfolio";
import { splitParagraphs } from "@/lib/data/services";
import { ctaLabels } from "@/config/site";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/data/seo-settings";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getActivePortfolioProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/portfolyo/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getPortfolioProjectBySlug(slug);
  if (!project) return {};

  return buildPageMetadata({
    pageKey: `portfolyo/${slug}`,
    path: `/portfolyo/${slug}`,
    fallbackTitle: project.title,
    fallbackDescription: project.short_description || project.title,
    fallbackImage: project.cover_image_url,
    type: "article",
  });
}

export default async function PortfolioProjectPage(
  props: PageProps<"/portfolyo/[slug]">,
) {
  const { slug } = await props.params;
  const project = await getPortfolioProjectBySlug(slug);
  if (!project) notFound();

  const [gallery, allProjects] = await Promise.all([
    getPortfolioGalleryImages(project.id),
    getActivePortfolioProjects(),
  ]);

  const currentIndex = allProjects.findIndex((item) => item.slug === project.slug);
  const next =
    allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null;

  const paragraphs = splitParagraphs(project.description);
  const metaParts = [project.location, project.categoryName].filter(Boolean);

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Portfolyo", href: "/portfolyo" },
    { label: project.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />

      <DetailHero
        src={project.cover_image_url}
        alt={project.title}
        eyebrow="Portfolyo"
        title={project.title}
        meta={metaParts.length > 0 ? metaParts.join(" · ") : undefined}
      />
      <Breadcrumbs items={breadcrumbItems} />

      {paragraphs.length > 0 && (
        <Section spacing="tight">
          <Container size="narrow">
            <div className="flex flex-col gap-5">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-pretty text-base leading-relaxed whitespace-pre-line text-muted-foreground sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {gallery.length > 0 && (
        <Section spacing="tight">
          <Container>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image, i) => (
                <DynamicMedia
                  key={image.id}
                  src={image.image_url}
                  alt={image.alt_text ?? project.title}
                  aspect="portrait"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={i === 0 ? "sm:col-span-2 lg:col-span-2" : undefined}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="sunken" spacing="tight">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            {next ? (
              <Link href={`/portfolyo/${next.slug}`} className="group flex items-center gap-4">
                <span className="flex size-11 items-center justify-center border border-foreground/30 text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Sonraki Proje
                  </span>
                  <span className="font-display text-lg">{next.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}

            <Button href="/randevu-al">{ctaLabels.bookAppointment}</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
