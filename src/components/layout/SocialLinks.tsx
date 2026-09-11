import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { cn } from "@/lib/utils";

type SocialLinkItem = {
  label: string;
  href: string | null;
  icon: "instagram" | "whatsapp";
};

const socialIcons = {
  instagram: InstagramIcon,
  whatsapp: MessageCircle,
} as const;

type SocialLinksProps = {
  links: SocialLinkItem[];
  tone?: "light" | "dark";
  className?: string;
};

const toneBase = {
  light: "border-border text-foreground",
  dark: "border-white/15 text-white/70",
} as const;

const toneHover = "hover:border-accent hover:text-accent";

/**
 * Instagram/WhatsApp bağlantıları `site_settings`'te tanımlanana kadar
 * `href: null` olur — bu bileşen o durumda tıklanabilir görünen ama
 * hiçbir şey yapmayan sahte bir link üretmek yerine görünür şekilde
 * devre dışı (inert) bir buton render eder.
 */
export function SocialLinks({ links, tone = "light", className }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = socialIcons[link.icon];
        const baseClasses = cn(
          "flex size-10 items-center justify-center border transition-colors",
          toneBase[tone],
        );

        if (!link.href) {
          return (
            <span
              key={link.label}
              aria-disabled="true"
              title={`${link.label} bağlantısı yakında eklenecek`}
              className={cn(baseClasses, "cursor-not-allowed opacity-40")}
            >
              <Icon className="size-4" aria-hidden />
            </span>
          );
        }

        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={cn(baseClasses, toneHover)}
          >
            <Icon className="size-4" aria-hidden />
          </a>
        );
      })}
    </div>
  );
}
