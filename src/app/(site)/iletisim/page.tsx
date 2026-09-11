import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildPageMetadata } from "@/lib/data/seo-settings";
import { createContactMessageAction } from "./actions";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "iletisim",
    path: "/iletisim",
    fallbackTitle: "İletişim",
    fallbackDescription:
      "Stüdyo Zorbey ile iletişime geçin — Manisa'da düğün, nişan ve kurumsal çekimleriniz için bize ulaşın.",
  });
}

export default async function ContactPage() {
  const { contactInfo, social } = await getSiteSettings();

  const contactRows: { label: string; value: string | null }[] = [
    { label: "Telefon", value: contactInfo.phone },
    { label: "E-posta", value: contactInfo.email },
    { label: "Adres", value: contactInfo.address },
  ];

  return (
    <>
      <PageHero eyebrow="İletişim" title="Bize Ulaşın" />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-10">
              <address className="not-italic flex flex-col gap-10">
              <dl className="flex flex-col gap-5">
                {contactRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 border-b border-border pb-5"
                  >
                    <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      {row.label}
                    </dt>
                    <dd className="text-base text-foreground">
                      {row.value ?? (
                        <span className="text-muted-foreground/60 italic">
                          Yakında eklenecek
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
                {contactInfo.workingHours.length > 0 && (
                  <div className="flex flex-col gap-1 border-b border-border pb-5">
                    <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      Çalışma Saatleri
                    </dt>
                    <dd className="flex flex-col gap-0.5 text-base text-foreground">
                      {contactInfo.workingHours.map((entry) => (
                        <span key={entry.label} className="flex justify-between gap-4 text-sm">
                          <span className="text-muted-foreground">{entry.label}</span>
                          <span>{entry.value}</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                <div className="flex flex-col gap-1 pb-1">
                  <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Instagram
                  </dt>
                  <dd className="text-base text-foreground">
                    {social.instagramUrl ? (
                      <a
                        href={social.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {social.instagramUrl}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/60 italic">
                        Yakında eklenecek
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              {social.whatsappUrl ? (
                <a
                  href={social.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  WhatsApp&apos;tan Yazın
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="WhatsApp numarası eklendiğinde aktif olacak"
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground/60 italic"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  WhatsApp numarası yakında eklenecek
                </span>
              )}
              </address>

              <MapPlaceholder className="aspect-[16/10]" mapUrl={contactInfo.mapUrl} />
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl">
                Mesaj Gönderin
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Formu doldurun, en kısa sürede size dönüş yapalım.
              </p>
              <div className="mt-8">
                <ContactForm action={createContactMessageAction} />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
