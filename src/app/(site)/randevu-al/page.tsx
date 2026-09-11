import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getActiveServices } from "@/lib/data/services";
import { buildPageMetadata } from "@/lib/data/seo-settings";
import { createAppointmentAction } from "./actions";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "randevu-al",
    path: "/randevu-al",
    fallbackTitle: "Randevu Al",
    fallbackDescription:
      "Stüdyo Zorbey ile çekim randevusu talep edin — Manisa'da düğün, nişan, kına ve dış çekim için formu doldurun.",
  });
}

const steps = [
  {
    index: "01",
    title: "Talebinizi iletin",
    description: "Formu doldurun, çekim tercihlerinizi bizimle paylaşın.",
  },
  {
    index: "02",
    title: "Sizinle iletişime geçelim",
    description: "Ekibimiz en kısa sürede sizi arayarak detayları konuşalım.",
  },
  {
    index: "03",
    title: "Çekim detaylarını netleştirelim",
    description: "Tarih, lokasyon ve akışı birlikte planlayalım.",
  },
];

export default async function AppointmentPage() {
  const services = await getActiveServices();

  return (
    <>
      <PageHero
        eyebrow="Randevu Al"
        title="Gününüz İçin Randevu Oluşturun"
        description="Aşağıdaki formu doldurun, ekibimiz size en kısa sürede dönüş yapsın."
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_22rem]">
            <AppointmentForm action={createAppointmentAction} services={services} />

            <div className="flex flex-col gap-8 lg:border-l lg:border-border lg:pl-12">
              <h2 className="font-display text-xl">Süreç Nasıl İşliyor?</h2>
              <div className="flex flex-col gap-8">
                {steps.map((step) => (
                  <div key={step.index} className="flex gap-4">
                    <span className="font-display text-2xl text-accent italic">
                      {step.index}
                    </span>
                    <div>
                      <h3 className="font-display text-base">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
