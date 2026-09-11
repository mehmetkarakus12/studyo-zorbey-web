/**
 * `/admin` altındaki HER ŞEYin (login dahil) en dıştaki sarmalayıcısı.
 * Bilinçli olarak sade tutuldu — marka/nav kabuğu artık burada değil:
 * `/admin/login` kendi minimal başlığını taşır, korumalı alan ise kendi
 * tam sidebar+topbar kabuğunu `(protected)/layout.tsx` üzerinden alır.
 * (Faz 2.2'de burada basit bir üst bar vardı; iki ayrı kabuk üst üste
 * binmesin diye Faz 2.3'te buradan kaldırıldı.)
 *
 * Public site'ın Header/Footer'ını KULLANMAZ — admin alanı public
 * navigasyonun bir parçası değildir.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-svh bg-background">{children}</div>;
}
