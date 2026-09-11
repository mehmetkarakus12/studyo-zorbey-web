import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { Button } from "@/components/ui/Button";
import { getFeaturedServices } from "@/lib/data/services";
import { ctaLabels } from "@/config/site";

export async function FeaturedServices() {
  const services = await getFeaturedServices();

  if (services.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Hizmetler"
          title="Öne Çıkan Hizmetlerimiz"
          description="Düğününüzden kurumsal prodüksiyona, ihtiyacınıza özel hazırlanmış hizmet başlıklarımızdan bazıları."
          action={
            <Button href="/hizmetler" variant="ghost" size="sm">
              {ctaLabels.viewAllServices}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                aria-hidden
              />
            </Button>
          }
        />

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 lg:gap-x-10">
          {services.map((service) => (
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
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute right-4 bottom-4 flex size-9 translate-y-1 items-center justify-center border border-white/50 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-lg transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-xl">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.short_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
