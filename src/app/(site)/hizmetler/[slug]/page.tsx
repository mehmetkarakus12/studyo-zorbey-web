import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getActiveServices, getServiceBySlug, splitParagraphs } from "@/lib/data/services";
import { serviceFaqs } from "@/data/services";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/data/seo-settings";

export const revalidate = 300;

export async function generateStaticParams() {
  const services = await getActiveServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/hizmetler/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return buildPageMetadata({
    pageKey: `hizmetler/${slug}`,
    path: `/hizmetler/${slug}`,
    fallbackTitle: service.seo_title || service.title,
    fallbackDescription: service.seo_description || service.short_description || "",
    fallbackImage: service.image_url,
  });
}

export default async function ServiceDetailPage(
  props: PageProps<"/hizmetler/[slug]">,
) {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const paragraphs = splitParagraphs(service.description);

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Hizmetler", href: "/hizmetler" },
    { label: service.title },
  ];

  return (
    <>
      <JsonLd
        data={buildServiceSchema({
          title: service.title,
          shortDescription: service.short_description ?? service.title,
          slug: service.slug,
        })}
      />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />

      <PageHero eyebrow="Hizmetler" title={service.title} />
      <Breadcrumbs items={breadcrumbItems} />

      <Section spacing="tight">
        <Container>
          {/*
            PageHero (metin) + Breadcrumbs bu görselden önce render
            edildiği için görsel genelde ilk ekranın altında kalır — bu
            yüzden `priority` bilinçli olarak KULLANILMADI.
          */}
          <DynamicMedia
            src={service.image_url}
            alt={service.title}
            aspect="cinematic"
            sizes="100vw"
            className="w-full"
          />
        </Container>
      </Section>

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

      <Process />

      <Section>
        <Container size="narrow">
          <SectionHeading eyebrow="SSS" title="Sıkça Sorulan Sorular" />
          <div className="mt-10 flex flex-col divide-y divide-border border-t border-b border-border">
            {serviceFaqs.map((faq) => (
              <div key={faq.question} className="flex flex-col gap-2 py-6">
                <h3 className="font-display text-lg">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
