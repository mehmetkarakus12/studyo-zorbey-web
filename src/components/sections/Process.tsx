import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";

export function Process() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Süreç"
          title="Çalışma Sürecimiz"
          description="Görüşmeden teslimata, her adımda şeffaf ve öngörülebilir bir deneyim sunuyoruz."
        />

        {/* Mobil / tablet: dikey timeline — 1024px altında sıkışık 5 kolon kullanılmaz. */}
        <div className="mt-14 flex flex-col lg:hidden">
          {processSteps.map((step, i) => (
            <div key={step.index} className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <span className="font-display text-2xl text-accent italic">
                  {step.index}
                </span>
                {i < processSteps.length - 1 && (
                  <span
                    aria-hidden
                    className="mt-2 w-px flex-1 bg-border"
                  />
                )}
              </div>
              <div className="pb-10 last:pb-0">
                <h3 className="font-display text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Masaüstü: 5 kolonlu yatay süreç şeridi */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-5 lg:divide-x lg:divide-border">
          {processSteps.map((step) => (
            <div
              key={step.index}
              className="flex flex-col gap-3 px-6 first:pl-0 last:pr-0"
            >
              <span className="font-display text-3xl text-accent italic">
                {step.index}
              </span>
              <h3 className="font-display text-xl">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
