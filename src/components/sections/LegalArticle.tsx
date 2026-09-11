import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

type LegalArticleProps = {
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

/**
 * /gizlilik-politikasi, /cerez-politikasi, /kvkk sayfaları arasında
 * paylaşılan okunabilir metin şablonu. Sayfa başlığı/hero'su her sayfada
 * kendi PageHero çağrısıyla verilir; bu bileşen yalnızca gövdeyi render eder.
 */
export function LegalArticle({
  lastUpdated,
  intro,
  sections,
}: LegalArticleProps) {
  return (
    <Section>
      <Container size="narrow">
        <article className="flex flex-col gap-10">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Son güncelleme: {lastUpdated}
          </p>

          {intro && (
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
          )}

          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-4">
                <h2 className="font-display text-2xl leading-snug sm:text-3xl">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-pretty text-base leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="flex flex-col gap-2 pl-1">
                    {section.list.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-2.5 size-1 shrink-0 bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bu metinle ilgili bir sorunuz varsa bizimle iletişime
              geçebilirsiniz.
            </p>
            <div>
              <Button href="/iletisim" variant="outline">
                İletişim Sayfasına Git
              </Button>
            </div>
          </div>
        </article>
      </Container>
    </Section>
  );
}
