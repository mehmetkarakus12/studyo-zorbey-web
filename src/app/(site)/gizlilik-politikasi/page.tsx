import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { LegalArticle, type LegalSection } from "@/components/sections/LegalArticle";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: `${siteConfig.brandName} gizlilik politikası — kişisel verilerinizin nasıl işlendiğine dair genel bilgilendirme.`,
  alternates: {
    canonical: "/gizlilik-politikasi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections: LegalSection[] = [
  {
    heading: "Genel Bilgilendirme",
    paragraphs: [
      `Bu sayfa, ${siteConfig.brandName} ("biz", "stüdyomuz") olarak web sitemizi ziyaret eden kullanıcıların gizliliğini nasıl ele aldığımıza dair genel bir bilgilendirme sunar.`,
      "Bu metin genel bilgilendirme amaçlıdır ve profesyonel hukuki danışmanlığın yerine geçmez. Sitemiz ve hizmetlerimiz geliştikçe bu metin de güncellenecektir.",
    ],
  },
  {
    heading: "Şu Anki Durum",
    paragraphs: [
      "Sitemizdeki İletişim, Randevu Al ve Teklif Al formları şu an yalnızca görsel bir arayüz olarak sunulmaktadır; bu formlar üzerinden gönderilen bilgiler henüz herhangi bir sunucuya iletilmemekte veya kaydedilmemektedir.",
      "Bu formlar aktif hale getirildiğinde (form gönderimlerinin gerçekten işlenmeye başlamasıyla), bu sayfa hangi verilerin toplandığını ve nasıl kullanıldığını güncellenmiş haliyle açıklayacaktır.",
    ],
  },
  {
    heading: "Toplanmayı Planladığımız Veriler",
    paragraphs: [
      "Formlar aktif olduğunda, yalnızca tarafınızca gönüllü olarak paylaşılan ve talebinizi yanıtlamak için gerekli olan bilgiler toplanması planlanmaktadır:",
    ],
    list: [
      "Ad soyad",
      "Telefon numarası",
      "E-posta adresi",
      "Talep ettiğiniz hizmet ve mesaj içeriği",
    ],
  },
  {
    heading: "Üçüncü Taraf Hizmetler ve Çerezler",
    paragraphs: [
      "Sitemiz şu anda analiz (analytics), reklam veya takip amaçlı üçüncü taraf araçlar kullanmamaktadır.",
      "Çerez kullanımı hakkında detaylı bilgi için Çerez Politikası sayfamızı inceleyebilirsiniz.",
    ],
  },
  {
    heading: "Veri Güvenliği",
    paragraphs: [
      "Gelecekte toplanacak kişisel verilerin güvenliğini sağlamak amacıyla makul teknik ve idari tedbirlerin alınması hedeflenmektedir. Ancak internet üzerinden hiçbir iletimin veya depolamanın %100 güvenli olduğu garanti edilemez.",
    ],
  },
  {
    heading: "Haklarınız",
    paragraphs: [
      "Kişisel verilerinizle ilgili haklarınız hakkında detaylı bilgi için KVKK Aydınlatma Metni sayfamızı inceleyebilirsiniz.",
    ],
  },
  {
    heading: "Değişiklikler",
    paragraphs: [
      "Bu gizlilik politikası, hizmetlerimizdeki gelişmelere paralel olarak güncellenebilir. Önemli değişiklikler bu sayfada yayınlanacaktır.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Gizlilik Politikası" />
      <LegalArticle lastUpdated="10 Eylül 2026" sections={sections} />
    </>
  );
}
