import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { LegalArticle, type LegalSection } from "@/components/sections/LegalArticle";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: `${siteConfig.brandName} çerez politikası — sitemizde çerezlerin nasıl kullanıldığına dair genel bilgilendirme.`,
  alternates: {
    canonical: "/cerez-politikasi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections: LegalSection[] = [
  {
    heading: "Çerez Nedir?",
    paragraphs: [
      "Çerezler (cookies), bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Sitenin düzgün çalışmasına yardımcı olmak veya tercihlerinizi hatırlamak gibi amaçlarla kullanılabilirler.",
    ],
  },
  {
    heading: "Şu Anki Durum",
    paragraphs: [
      `${siteConfig.brandName} web sitesi şu anda analiz (analytics), reklam veya kullanıcı takibi amaçlı herhangi bir üçüncü taraf çerez kullanmamaktadır.`,
      "Tarayıcınız, sitenin temel teknik işlevleri (ör. sayfa görüntüleme) için kendi standart mekanizmalarını kullanabilir; bunlar site tarafından bilinçli olarak yerleştirilen takip çerezleri değildir.",
    ],
  },
  {
    heading: "İleride Kullanılabilecek Çerezler",
    paragraphs: [
      "Sitemiz gelecekte oturum yönetimi (ör. admin panel girişi) veya tercih hatırlama gibi amaçlarla teknik olarak gerekli çerezler kullanabilir. Bu tür bir değişiklik yapıldığında bu sayfa güncellenecektir.",
    ],
  },
  {
    heading: "Çerezleri Nasıl Yönetebilirsiniz?",
    paragraphs: [
      "Çoğu internet tarayıcısı, çerezleri tarayıcı ayarları üzerinden görüntülemenize, silmenize veya engellemenize olanak tanır. Çerezleri devre dışı bırakmanız, bazı web sitelerinin belirli özelliklerinin beklendiği gibi çalışmamasına neden olabilir.",
    ],
  },
  {
    heading: "Değişiklikler",
    paragraphs: [
      "Bu çerez politikası, sitemize yeni özellikler eklendikçe (ör. admin panel veya analiz araçları) güncellenebilir. Bu metin genel bilgilendirme amaçlıdır ve profesyonel hukuki danışmanlığın yerine geçmez.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Çerez Politikası" />
      <LegalArticle lastUpdated="10 Eylül 2026" sections={sections} />
    </>
  );
}
