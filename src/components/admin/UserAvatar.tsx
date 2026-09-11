import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Gerçek fotoğraf henüz olmadığı için sadece isim baş harflerinden oluşan
 * bir UI avatarı — bir yetkilendirme/güvenlik göstergesi değildir.
 */
export function UserAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center bg-accent/15 text-xs font-semibold tracking-wide text-accent",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
