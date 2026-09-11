import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { getActiveServices } from "@/lib/data/services";
import { buildPageMetadata } from "@/lib/data/seo-settings";
import { createQuoteRequestAction } from "./actions";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "teklif-al",
    path: "/teklif-al",
    fallbackTitle: "Teklif Al",
    fallbackDescription:
      "Stüdyo Zorbey'den projeniz için teklif isteyin — Manisa'da düğün, nişan ve kurumsal çekimler için detaylarınızı paylaşın.",
  });
}

export default async function QuotePage() {
  const services = await getActiveServices();

  return (
    <>
      <PageHero
        eyebrow="Teklif Al"
        title="Projenize Özel Teklif İsteyin"
        description="Çekiminizin detaylarını paylaşın, size özel planlama için iletişime geçelim."
      />

      <Section>
        <Container size="narrow">
          <QuoteForm action={createQuoteRequestAction} services={services} />
        </Container>
      </Section>
    </>
  );
}
