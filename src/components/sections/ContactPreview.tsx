import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { ctaLabels } from "@/config/site";
import { getSiteSettings } from "@/lib/data/site-settings";

export async function ContactPreview() {
  const { contactInfo, social } = await getSiteSettings();
  const hasContactDetails = contactInfo.phone || contactInfo.email || contactInfo.address;

  return (
    <Section tone="sunken">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <MapPlaceholder mapUrl={contactInfo.mapUrl} />

          <div className="flex flex-col justify-center gap-6">
            <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              <span aria-hidden className="h-px w-8 bg-accent" />
              İletişim
            </span>
            <h2 className="text-balance font-display text-4xl leading-[1.1] font-normal sm:text-5xl">
              Bize Ulaşın
            </h2>

            {hasContactDetails ? (
              <ul className="flex flex-col gap-2 text-base text-muted-foreground">
                {contactInfo.phone && <li>{contactInfo.phone}</li>}
                {contactInfo.email && <li>{contactInfo.email}</li>}
                {contactInfo.address && <li>{contactInfo.address}</li>}
              </ul>
            ) : (
              <p className="text-base text-muted-foreground italic">
                Telefon, e-posta ve adres bilgilerimiz yakında burada yer
                alacak.
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-4">
              <Button href="/randevu-al">{ctaLabels.bookAppointment}</Button>
              <Button href="/teklif-al" variant="outline">
                {ctaLabels.requestQuote}
              </Button>
            </div>

            {social.whatsappUrl ? (
              <a
                href={social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp&apos;tan Yazın
              </a>
            ) : (
              <span
                aria-disabled="true"
                title="WhatsApp numarası eklendiğinde aktif olacak"
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground/60 italic"
              >
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp numarası yakında eklenecek
              </span>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
