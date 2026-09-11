import { HeaderClient } from "@/components/layout/HeaderClient";
import { getSiteSettings } from "@/lib/data/site-settings";

/**
 * `HeaderClient`'ın scroll/menü durumu client-only olduğu için ("use
 * client"), site ayarlarını (Instagram/WhatsApp bağlantıları — mobil
 * menüdeki `SocialLinks` için) burada, Server Component katmanında
 * çekip prop olarak aşağı geçiriyoruz.
 */
export async function Header() {
  const { social } = await getSiteSettings();
  const socialLinks = [
    { label: "Instagram", href: social.instagramUrl, icon: "instagram" as const },
    { label: "WhatsApp", href: social.whatsappUrl, icon: "whatsapp" as const },
  ];

  return <HeaderClient socialLinks={socialLinks} />;
}
