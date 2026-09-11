import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { getActiveTestimonials } from "@/lib/data/testimonials";

function formatEventDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}

/**
 * Gerçek müşteri yorumları admin panelinden eklenene kadar bu bölüm
 * açıkça bir "demo / yakında" durumu gösterir — sahte yorum, isim veya
 * çift bilgisi üretilmez.
 */
export async function Testimonials() {
  const testimonials = await getActiveTestimonials();

  return (
    <Section tone="sunken">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Müşteri Yorumları"
          title="Çiftlerimiz Ne Diyor?"
          description={
            testimonials.length > 0
              ? undefined
              : "Yorumlar admin panelinden eklendikçe bu alanda yayınlanacak."
          }
        />

        {testimonials.length > 0 ? (
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((testimonial) => {
              const meta = [testimonial.shooting_type, formatEventDate(testimonial.event_date)]
                .filter(Boolean)
                .join(" · ");

              return (
                <div
                  key={testimonial.id}
                  className="relative flex flex-col gap-5 border border-border bg-surface p-7"
                >
                  {testimonial.is_featured && (
                    <Badge className="absolute top-5 right-5">Öne Çıkan</Badge>
                  )}
                  <span
                    aria-hidden
                    className="font-display text-6xl leading-none text-accent/25"
                  >
                    &rdquo;
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    {testimonial.content}
                  </p>
                  <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
                    <span className="text-sm font-semibold text-foreground/70">
                      {testimonial.customer_name}
                    </span>
                    {meta && (
                      <span className="text-xs tracking-[0.08em] text-muted-foreground uppercase">
                        {meta}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="relative flex flex-col gap-5 border border-border bg-surface p-7"
              >
                <Badge className="absolute top-5 right-5">Yakında</Badge>
                <span
                  aria-hidden
                  className="font-display text-6xl leading-none text-accent/25"
                >
                  &rdquo;
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  Müşteri yorumu bu alanda yer alacak.
                </p>
                <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
                  <span className="text-sm font-semibold text-foreground/70">Çift Adı</span>
                  <span className="text-xs tracking-[0.08em] text-muted-foreground uppercase">
                    Çekim Türü · Tarih
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
