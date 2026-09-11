import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ctaLabels } from "@/config/site";

export function FinalCta() {
  return (
    <Section tone="dark" spacing="tight">
      <Container>
        <div className="flex flex-col items-center gap-6 py-8 text-center">
          <h2 className="max-w-2xl text-balance font-display text-4xl font-normal text-white sm:text-5xl">
            Gününüzü Anlatmaya Hazır Mısınız?
          </h2>
          <p className="max-w-xl text-pretty text-white/70 sm:text-lg">
            Randevu alın ya da projeniz için teklif isteyin — size en kısa
            sürede dönüş yapalım.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Button href="/randevu-al" size="lg">
              {ctaLabels.bookAppointment}
            </Button>
            <Button href="/teklif-al" variant="outline-inverse" size="lg">
              {ctaLabels.requestQuote}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
