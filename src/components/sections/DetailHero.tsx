import { Container } from "@/components/ui/Container";
import { DynamicMedia } from "@/components/ui/DynamicMedia";

type DetailHeroProps = {
  src: string | null | undefined;
  alt: string;
  eyebrow: string;
  title: string;
  meta?: string;
};

/**
 * Portfolyo projesi / blog yazısı detay sayfaları için kapak görselli hero.
 * Görsel tüm bölümü kaplar; üstte header'ın okunabilirliği, altta başlık
 * metninin okunabilirliği için çift yönlü bir gradient overlay kullanılır.
 */
export function DetailHero({ src, alt, eyebrow, title, meta }: DetailHeroProps) {
  return (
    <section className="relative flex min-h-[65svh] items-end overflow-hidden bg-secondary lg:min-h-[75svh]">
      <DynamicMedia
        src={src}
        alt={alt}
        aspect="hero"
        tone="dark"
        priority
        sizes="100vw"
        className="absolute inset-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/75"
      />
      <Container className="relative w-full pt-40 pb-12 lg:pb-16">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-accent uppercase">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {eyebrow}
          </span>
          <h1 className="text-balance font-display text-4xl leading-[1.08] font-normal text-white sm:text-5xl lg:text-[3.1rem]">
            {title}
          </h1>
          {meta && (
            <p className="text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">
              {meta}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
