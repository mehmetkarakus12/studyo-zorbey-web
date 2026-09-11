import Link from "next/link";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { getFeaturedActiveVideo } from "@/lib/data/videos";

/**
 * Aktif bir video varsa gerçek `thumbnail_url`/`video_url` ile açılır
 * (harici video sayfasına yeni sekmede gider — ayrı bir /videolar galeri
 * sayfası bu fazın kapsamı dışında, bkz. proje talimatları). Hiç aktif
 * video yoksa tasarımı bozmayan statik demo/fallback görünüme (Faz 1'den)
 * düşülür.
 */
export async function CinematicVideo() {
  const video = await getFeaturedActiveVideo();

  return (
    <Section tone="dark" spacing="tight">
      <Container>
        <div className="mb-10 flex flex-col gap-4 text-center">
          <span className="mx-auto inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            <span aria-hidden className="h-px w-8 bg-accent" />
            Sinematik
            <span aria-hidden className="h-px w-8 bg-accent" />
          </span>
          <h2 className="font-display text-4xl font-normal text-white sm:text-5xl">
            {video ? video.title : "Hareket Halinde Bir Hikâye"}
          </h2>
        </div>

        <Link
          href={video ? video.video_url : "/hizmetler/video-cekimi"}
          target={video ? "_blank" : undefined}
          rel={video ? "noopener noreferrer" : undefined}
          className="group relative block overflow-hidden"
        >
          {video ? (
            <DynamicMedia
              src={video.thumbnail_url}
              alt={video.title}
              aspect="cinematic"
              tone="dark"
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="aspect-[16/9] transition-transform duration-700 ease-out group-hover:scale-[1.02] lg:aspect-[21/9]"
            />
          ) : (
            <MediaPlaceholder
              slot="video-hero-highlight"
              tone="dark"
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="aspect-[16/9] transition-transform duration-700 ease-out group-hover:scale-[1.02] lg:aspect-[21/9]"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <span className="flex size-16 items-center justify-center rounded-full border border-white/40 text-white transition-colors group-hover:border-accent group-hover:text-accent">
              <Play className="ml-0.5 size-6" aria-hidden fill="currentColor" />
            </span>
            <span className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
              {video ? "Videoyu İzle" : "Videoları İzle"}
            </span>
          </div>
        </Link>
      </Container>
    </Section>
  );
}
