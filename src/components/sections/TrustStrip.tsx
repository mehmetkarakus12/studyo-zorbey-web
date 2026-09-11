import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const values = [
  {
    index: "01",
    title: "Editorial Bakış",
    description: "Dergi kalitesinde kompozisyon ve anlatım anlayışı.",
  },
  {
    index: "02",
    title: "Sinematik Kurgu",
    description: "Fotoğraf ve videoyu tek bir hikâye diliyle birleştiriyoruz.",
  },
  {
    index: "03",
    title: "Yerel Uzmanlık",
    description: "Manisa'nın en özel çekim lokasyonlarını yakından tanıyoruz.",
  },
];

export function TrustStrip() {
  return (
    <Section spacing="tight" className="border-b border-border">
      <Container>
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {values.map((value) => (
            <div
              key={value.index}
              className="flex flex-col gap-3 py-8 first:pt-0 sm:px-9 sm:py-0 sm:first:pl-0 sm:last:pr-0"
            >
              <span aria-hidden className="h-px w-8 bg-accent/50" />
              <div className="flex items-baseline gap-3">
                <span className="font-display text-lg text-accent italic">
                  {value.index}
                </span>
                <p className="font-display text-xl">{value.title}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
