import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ctaLabels } from "@/config/site";

/**
 * 404 içeriği iki yerden render edilir: `app/(site)/not-found.tsx`
 * ((site) segmenti içindeki sayfalarda `notFound()` çağrıldığında — bu
 * durumda Header/Footer (site) layout'undan otomatik gelir) ve kök
 * `app/not-found.tsx` (hiçbir route ile eşleşmeyen tamamen bilinmeyen
 * URL'ler için — route group'lar bu durumda devrede olmadığından
 * Header/Footer o dosyada elle sarmalanır). İçerik tekrarını önlemek için
 * tek bir yerden paylaşılır.
 */
export function NotFoundContent() {
  return (
    <Section className="flex min-h-[70svh] items-center">
      <Container size="narrow">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-display text-6xl text-accent italic sm:text-7xl">
            404
          </span>
          <h1 className="text-balance font-display text-3xl leading-[1.15] font-normal sm:text-4xl">
            Aradığınız sayfa bulunamadı.
          </h1>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            Bu sayfa taşınmış, kaldırılmış ya da hiç var olmamış olabilir.
            Aşağıdaki bağlantılardan devam edebilirsiniz.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Button href="/">Ana Sayfaya Dön</Button>
            <Button href="/portfolyo" variant="outline">
              {ctaLabels.viewPortfolio}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
