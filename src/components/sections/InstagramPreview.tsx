import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { MediaSlotId } from "@/data/media-slots";

const instagramSlots: MediaSlotId[] = [
  "instagram-01",
  "instagram-02",
  "instagram-03",
  "instagram-04",
  "instagram-05",
  "instagram-06",
];

/**
 * Canlı bir Instagram feed entegrasyonu bu fazın kapsamında değil (bkz.
 * proje kuralları — sahte paylaşım üretilmez); yalnızca "Takip Edin"
 * butonunun bağlantısı `site_settings.instagram_url`'den gelir.
 */
export async function InstagramPreview() {
  const { social } = await getSiteSettings();

  return (
    <Section spacing="tight">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Instagram"
          title="Instagram'da Stüdyo Zorbey"
          description="Instagram bağlantısı etkinleştirildiğinde son paylaşımlar otomatik olarak bu alanda görünecek."
        />

        <div className="mt-12 grid grid-cols-3 gap-1.5 lg:grid-cols-6 lg:gap-2">
          {instagramSlots.map((slot) => (
            <MediaPlaceholder
              key={slot}
              slot={slot}
              sizes="(min-width: 1024px) 16vw, 33vw"
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          {social.instagramUrl ? (
            <Button href={social.instagramUrl} variant="outline">
              <InstagramIcon className="size-4" aria-hidden />
              Instagram&apos;da Takip Edin
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Instagram bağlantısı yakında aktif olacak.
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
