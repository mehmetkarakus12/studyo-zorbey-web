import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { ctaLabels } from "@/config/site";
import { buildPageMetadata } from "@/lib/data/seo-settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "hakkimizda",
    path: "/hakkimizda",
    fallbackTitle: "Hakkımızda",
    fallbackDescription:
      "Stüdyo Zorbey, Manisa'da fotoğraf ve video prodüksiyonuna editorial bir bakış açısı kazandırmak için var.",
  });
}

const approach = [
  {
    title: "Doğal Anlar",
    description: "Pozu zorlamadan, anın kendi akışında ortaya çıkmasını bekliyoruz.",
  },
  {
    title: "Editorial Bakış",
    description: "Her kareyi bir dergi sayfası gibi, kompozisyona özenle kuruyoruz.",
  },
  {
    title: "Zamansız Kurgu",
    description: "Trend değil, yıllar sonra da anlamını koruyan bir anlatım diliyle çalışıyoruz.",
  },
  {
    title: "Kişisel Deneyim",
    description: "Her hikâye farklıdır; çekimi sizin gününüze göre şekillendiriyoruz.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Stüdyo Zorbey"
        title="Anları yalnızca kaydetmiyor, onlara bir anlatı kazandırıyoruz."
      />

      <Section spacing="tight">
        <Container size="narrow">
          <div className="flex flex-col gap-5">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Stüdyo Zorbey, Manisa&apos;da fotoğraf ve video prodüksiyonuna
              editorial bir bakış açısı kazandırmak için var. Her çekimde
              amacımız; anı zorlamadan, olduğu gibi, ama zamansız bir zarafetle
              yakalamak.
            </p>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Bir düğün, bir nişan, bir kına gecesi ya da kurumsal bir proje
              olsun — her hikâyeye aynı özeni ve estetik anlayışı taşıyoruz.
              Amacımız sadece fotoğraf çekmek değil, o günün duygusunu
              yıllar sonra da hissettirebilen bir anlatı bırakmak.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <MediaPlaceholder
            slot="studio-team"
            aspect="cinematic"
            sizes="100vw"
            className="w-full"
          />
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <div className="mb-12 flex flex-col gap-4">
            <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              <span aria-hidden className="h-px w-8 bg-accent" />
              Yaklaşımımız
            </span>
            <h2 className="text-balance font-display text-3xl leading-[1.15] font-normal sm:text-4xl">
              Çalışma Yaklaşımımız
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
            {approach.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <span aria-hidden className="h-px w-8 bg-accent/50" />
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              <span aria-hidden className="h-px w-8 bg-accent" />
              Fotoğraf &amp; Video
            </span>
            <h2 className="text-balance font-display text-3xl leading-[1.15] font-normal sm:text-4xl">
              İki mecra, tek hikâye
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Fotoğraf anı dondururken, video onu hareketiyle ve sesiyle
              yeniden yaşatır. Çekimlerimizde bu iki mecrayı birbirinden
              ayırmadan, aynı hikâyenin iki farklı anlatım biçimi olarak
              planlıyoruz — böylece teslim ettiğimiz içerik bütünlüklü bir
              anlatı oluşturuyor.
            </p>
          </div>
        </Container>
      </Section>

      <Process />

      <Section tone="dark" spacing="tight">
        <Container>
          <div className="flex flex-col items-center gap-6 py-8 text-center">
            <h2 className="max-w-2xl text-balance font-display text-4xl font-normal text-white sm:text-5xl">
              Hikâyenizi Birlikte Anlatalım
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Button href="/randevu-al" size="lg">
                {ctaLabels.bookAppointment}
              </Button>
              <Button href="/portfolyo" variant="outline-inverse" size="lg">
                {ctaLabels.viewPortfolio}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
