import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";

export function AboutPreview() {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div
              aria-hidden
              className="absolute -bottom-4 -left-4 hidden h-full w-full border border-accent/40 sm:block"
            />
            <MediaPlaceholder slot="studio-team" className="relative" />
          </div>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              <span aria-hidden className="h-px w-8 bg-accent" />
              Hakkımızda
            </span>
            <h2 className="text-balance font-display text-4xl leading-[1.1] font-normal sm:text-5xl">
              Bir stüdyodan daha fazlası
            </h2>
            <p className="text-pretty leading-relaxed text-muted-foreground sm:text-lg">
              Stüdyo Zorbey, Manisa&apos;da fotoğraf ve video prodüksiyonuna
              editorial bir bakış açısı kazandırmak için var. Her çekimde
              amacımız; anı zorlamadan, olduğu gibi, ama zamansız bir
              zarafetle yakalamak.
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground sm:text-lg">
              Düğününüzden kurumsal projenize kadar her hikâyeye aynı özeni ve
              estetik anlayışı taşıyoruz.
            </p>
            <div>
              <Button href="/hakkimizda" variant="outline">
                Devamını Oku
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                  aria-hidden
                />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
