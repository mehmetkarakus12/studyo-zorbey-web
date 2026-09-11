import { Container } from "@/components/ui/Container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

/**
 * İç sayfalar (Hizmetler, Portfolyo, Hakkımızda, Blog, İletişim, Randevu Al,
 * Teklif Al) için sade, tipografik "inner-page hero". Homepage'in fotoğraflı
 * hero'sundan bilinçli olarak farklı — her iç sayfaya aynı görseli tekrar
 * tekrar koymak yerine editorial bir dergi sayfası gibi sade bir açılış
 * tercih edildi.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  align = "left",
}: PageHeroProps) {
  const centered = align === "center";

  return (
    <section className="bg-secondary pt-36 pb-14 sm:pt-40 sm:pb-16 lg:pt-48 lg:pb-20">
      <Container>
        <div
          className={
            centered
              ? "mx-auto flex max-w-3xl flex-col items-center gap-5 text-center"
              : "flex max-w-2xl flex-col gap-5"
          }
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-accent uppercase">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {eyebrow}
          </span>
          <h1 className="text-balance font-display text-4xl leading-[1.08] font-normal text-white sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          {description && (
            <p className="text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
