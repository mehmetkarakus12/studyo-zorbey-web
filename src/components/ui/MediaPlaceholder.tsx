import Image from "next/image";
import { cn } from "@/lib/utils";
import { mediaSlots, type MediaSlotId, type MediaSlotMeta } from "@/data/media-slots";
import type { MediaAspectRatio } from "@/types";

type MediaPlaceholderProps = {
  slot: MediaSlotId;
  aspect?: MediaAspectRatio;
  tone?: "light" | "dark";
  /** Gerçek görsel teslim edildiğinde /public/images/... yolu verilir. */
  src?: string;
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
 * Gerçek Stüdyo Zorbey fotoğraf/video içerikleri admin panelinden
 * yüklenene kadar kullanılan premium görsel yer tutucu.
 *
 * `slot`, hangi gerçek fotoğrafın buraya geleceğini açıkça tanımlar
 * (bkz. src/data/media-slots.ts). `src` verildiğinde component otomatik
 * olarak next/image ile CLS oluşturmayan gerçek bir görsele geçer —
 * placeholder mantığı bu geçiş için ekstra kod gerektirmeyecek şekilde
 * baştan hazırlanmıştır.
 */
export function MediaPlaceholder({
  slot,
  aspect,
  tone = "light",
  src,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className,
}: MediaPlaceholderProps) {
  const meta: MediaSlotMeta = mediaSlots[slot];
  const resolvedAspect = aspect ?? meta.aspect;
  const resolvedSrc = src ?? meta.image;
  const isDark = tone === "dark";

  return (
    <div
      role="img"
      aria-label={resolvedSrc ? meta.alt : `${meta.alt} — görsel yakında eklenecek`}
      className={cn(
        "relative isolate overflow-hidden",
        aspectClasses[resolvedAspect],
        !resolvedSrc &&
          (isDark
            ? "bg-gradient-to-br from-[#2a251f] via-[#221e19] to-[#17140f]"
            : "bg-gradient-to-br from-[#efe7d6] via-[#f3ece0] to-[#e7ddc7]"),
        className,
      )}
    >
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={meta.alt}
          fill
          sizes={sizes}
          priority={priority ?? meta.priority ?? false}
          className="object-cover"
          style={meta.objectPosition ? { objectPosition: meta.objectPosition } : undefined}
        />
      ) : (
        <>
          {/* viewfinder corner marks */}
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
              {meta.alt}
            </span>
            <span
              className={cn(
                "mt-1 font-mono text-[0.6rem] tracking-tight",
                isDark ? "text-white/25" : "text-foreground/25",
              )}
            >
              {slot}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
