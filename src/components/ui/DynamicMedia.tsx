import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MediaAspectRatio } from "@/types";

type DynamicMediaProps = {
  src: string | null | undefined;
  alt: string;
  aspect: MediaAspectRatio;
  tone?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

const aspectClasses: Record<MediaAspectRatio, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
  cinematic: "aspect-[21/9]",
  hero: "h-full w-full",
};

/**
 * `MediaPlaceholder`'ın gerçek (Supabase Storage'dan gelen, admin panelden
 * yönetilen) içerik için kardeşi — sabit `slot` kayıt defterine değil,
 * doğrudan `src`/`alt`'a bağlıdır (bir hizmet/proje/yazı sayısı sabit bir
 * slot listesiyle sınırlı değildir). `src` yoksa (görsel henüz
 * yüklenmemiş) AYNI premium placeholder görünümüne düşer — tasarım
 * bozulmaz, sahte görsel üretilmez.
 */
export function DynamicMedia({
  src,
  alt,
  aspect,
  tone = "light",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className,
}: DynamicMediaProps) {
  const isDark = tone === "dark";

  return (
    <div
      role="img"
      aria-label={src ? alt : `${alt} — görsel yakında eklenecek`}
      className={cn(
        "relative isolate overflow-hidden",
        aspectClasses[aspect],
        !src &&
          (isDark
            ? "bg-gradient-to-br from-[#2a251f] via-[#221e19] to-[#17140f]"
            : "bg-gradient-to-br from-[#efe7d6] via-[#f3ece0] to-[#e7ddc7]"),
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority ?? false}
          className="object-cover"
        />
      ) : (
        <>
          {(
            ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"] as const
          ).map((position) => (
            <span
              key={position}
              aria-hidden
              className={cn(
                "absolute size-4 border-accent/50",
                position,
                position.includes("top") ? "border-t" : "border-b",
                position.includes("left") ? "border-l" : "border-r",
              )}
            />
          ))}

          <div className="relative flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <span
              className={cn(
                "text-[0.65rem] font-semibold uppercase tracking-[0.24em]",
                isDark ? "text-white/40" : "text-foreground/35",
              )}
            >
              Stüdyo Zorbey
            </span>
            <span
              className={cn(
                "max-w-[18ch] font-display text-sm italic leading-snug",
                isDark ? "text-white/55" : "text-foreground/45",
              )}
            >
              {alt}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
