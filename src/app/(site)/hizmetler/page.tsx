import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { getActiveServices } from "@/lib/data/services";
import { buildPageMetadata } from "@/lib/data/seo-settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "hizmetler",
    path: "/hizmetler",
    fallbackTitle: "Hizmetlerimiz",
    fallbackDescription:
      "Düğün, nişan, kına, dış çekim, stüdyo, video ve kurumsal prodüksiyon — Manisa'da sunduğumuz fotoğraf ve video hizmetlerinin tamamı.",
  });
}

export default async function ServicesPage() {
  const services = await getActiveServices();
  const featured = services.filter((service) => service.is_featured);

  return (
    <>
      <PageHero
        eyebrow="Hizmetlerimiz"
        title="Her hikâyenin kendine özgü bir anlatımı vardır."
        description="Özel günlerden kurumsal projelere kadar fotoğraf ve video prodüksiyon hizmetleri."
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Katalog"
            title="Tüm Hizmetlerimiz"
            description="İhtiyacınıza uygun hizmeti seçin, detaylarını inceleyin."
          />

          {services.length > 0 ? (
            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/hizmetler/${service.slug}`}
                  className="group flex flex-col gap-5"
                >
                  <div className="relative overflow-hidden">
                    <DynamicMedia
                      src={service.image_url}
                      alt={service.title}
                      aspect="landscape"
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-2xl">
                      {service.title}
                    </h3>
                    {service.short_description && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {service.short_description}
                      </p>
                    )}
                    <span className="mt-1 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-foreground uppercase">
                      Detayları Gör
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-14 text-sm text-muted-foreground italic">
              Hizmet kataloğumuz yakında burada yer alacak.
            </p>
          )}
        </Container>
      </Section>

      {featured.length > 0 && (
        <Section tone="dark">
          <Container>
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
                <span aria-hidden className="h-px w-8 bg-accent" />
                Odak Alanımız
              </span>
              <h2 className="text-balance font-display text-4xl leading-[1.1] font-normal text-white sm:text-5xl">
                Öne Çıkan Hizmetlerimiz
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {featured.map((service) => (
                <Link
                  key={service.slug}
                  href={`/hizmetler/${service.slug}`}
                  className="group flex flex-col gap-4"
                >
                  <div className="relative overflow-hidden">
                    <DynamicMedia
                      src={service.image_url}
                      alt={service.title}
                      aspect="portrait"
                      tone="dark"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-base text-white transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-lg">
                    {service.title}
                  </h3>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <FinalCta />
    </>
  );
}
