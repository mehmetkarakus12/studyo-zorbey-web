import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
  className?: string;
};

const sizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-lg sm:text-xl",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl",
};

/**
 * Gerçek Stüdyo Zorbey logosu henüz teslim edilmedi.
 * Bu bileşen, logo dosyası eklenene kadar marka kimliğini taşıyan
 * geçici bir tipografik logotype görevi görür — logo geldiğinde
 * yalnızca bu component güncellenecek, kullanım yerleri değişmeyecek.
 */
export function Logo({ size = "md", tone = "dark", className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 font-display leading-none tracking-[0.04em]",
        sizeClasses[size],
        tone === "dark" ? "text-foreground" : "text-white",
        className,
      )}
    >
      Stüdyo
      <span className="text-accent italic">Zorbey</span>
    </span>
  );
}
