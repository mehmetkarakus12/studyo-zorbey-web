import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { ctaLabels } from "@/config/site";
import { getSiteSettings } from "@/lib/data/site-settings";

/**
 * Başlık/alt başlık/CTA `site_settings` üzerinden yönetilebilir (hero_title
 * vb. key'ler) — admin bir değer girmediyse mevcut onaylı statik metne
 * (Faz 1'den) düşülür, sayfa asla boş görünmez.
 */
export async function Hero() {
  const { hero } = await getSiteSettings();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-secondary lg:min-h-[94svh]">
      <Container className="relative w-full pt-32 pb-16 lg:pt-36 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 max-w-xl lg:order-1">
            <p className="text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
              Stüdyo Zorbey — Manisa
            </p>
            <h1 className="mt-6 text-balance font-display text-4xl leading-[1.08] font-normal text-white sm:text-5xl lg:text-[3.4rem]">
              {hero.title ?? (
                <>
                  Hikâyenizi <em className="text-accent not-italic">zamansız</em> bir
                  dille anlatıyoruz
                </>
              )}
            </h1>
            <p className="mt-6 text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
              {hero.subtitle ??
                "Manisa'da düğün, nişan ve portre çekimlerinde; doğal anları sinematik bir bakışla, sade ve editorial bir dille hikâyeleştiriyoruz."}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button
                href={hero.ctaHref ?? "/randevu-al"}
                size="lg"
                className="w-full sm:w-auto"
              >
                {hero.ctaLabel ?? ctaLabels.bookAppointment}
              </Button>
              <Button
                href="/portfolyo"
                variant="outline-inverse"
                size="lg"
                className="w-full sm:w-auto"
              >
                {ctaLabels.viewPortfolio}
              </Button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div
              aria-hidden
              className="absolute -top-4 -right-4 hidden h-full w-full border border-accent/40 sm:block"
            />
            <MediaPlaceholder
              slot="hero-wedding-main"
              tone="dark"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="relative"
            />
          </div>
        </div>
      </Container>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-6 hidden justify-center text-white/50 lg:flex"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </div>
    </section>
  );
}
