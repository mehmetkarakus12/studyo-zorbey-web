import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Container } from "@/components/ui/Container";
import { footerNav, siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/data/site-settings";

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold tracking-[0.16em] text-white/45 uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const { contactInfo, social, footerText } = await getSiteSettings();
  const hasContactDetails =
    contactInfo.phone || contactInfo.email || contactInfo.address;
  const socialLinkItems = [
    { label: "Instagram", href: social.instagramUrl, icon: "instagram" as const },
    { label: "WhatsApp", href: social.whatsappUrl, icon: "whatsapp" as const },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-20 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-28">
          <div className="flex flex-col gap-5">
            <Logo size="md" tone="light" />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              {footerText ?? siteConfig.description}
            </p>
            <SocialLinks links={socialLinkItems} tone="dark" className="mt-2" />
          </div>

          <FooterColumn title="Hizmetler" items={footerNav.services} />
          <FooterColumn title="Kurumsal" items={footerNav.studio} />

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-[0.16em] text-white/45 uppercase">
              İletişim
            </h3>
            {hasContactDetails ? (
              <ul className="flex flex-col gap-3 text-sm text-white/75">
                {contactInfo.phone && <li>{contactInfo.phone}</li>}
                {contactInfo.email && <li>{contactInfo.email}</li>}
                {contactInfo.address && <li>{contactInfo.address}</li>}
              </ul>
            ) : (
              <p className="text-sm text-white/50 italic">
                İletişim bilgileri yakında burada yer alacak.
              </p>
            )}
            <Link
              href="/iletisim"
              className="text-sm font-medium text-white/75 transition-colors hover:text-accent"
            >
              İletişim sayfasına git →
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.brandName}. Tüm hakları
            saklıdır.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white/70">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
