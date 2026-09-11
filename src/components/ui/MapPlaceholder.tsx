import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * `mapUrl` verildiğinde (site_settings.maps_embed — güvenli http(s) URL
 * doğrulaması `getSiteSettings()` içinde yapılır) kart, gerçek Google
 * Haritalar bağlantısını yeni sekmede açan tıklanabilir bir elemana
 * dönüşür. Rastgele bir `iframe src` gömülmez (bkz. proje güvenlik
 * kuralları) — sadece güvenli bir dış bağlantı.
 */
export function MapPlaceholder({
  className,
  mapUrl,
}: {
  className?: string;
  mapUrl?: string | null;
}) {
  const content = (
    <>
      <MapPin className="size-5 text-accent/70" strokeWidth={1.25} aria-hidden />
      <span className="text-[0.65rem] font-semibold tracking-[0.24em] text-foreground/35 uppercase">
        Stüdyo Zorbey
      </span>
      <span className="max-w-[22ch] font-display text-sm text-foreground/45 italic">
        {mapUrl ? "Haritada Görüntülemek İçin Tıklayın" : "Google Haritalar — konum yakında eklenecek"}
      </span>
    </>
  );

  const baseClasses = cn(
    "flex aspect-[3/2] flex-col items-center justify-center gap-3 border border-border bg-gradient-to-br from-[#efe7d6] via-[#f3ece0] to-[#e7ddc7] text-center",
    className,
  );

  if (mapUrl) {
    return (
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, "transition-colors hover:border-accent")}
      >
        {content}
      </a>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
