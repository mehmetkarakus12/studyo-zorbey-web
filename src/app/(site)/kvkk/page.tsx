import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { LegalArticle, type LegalSection } from "@/components/sections/LegalArticle";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: `${siteConfig.brandName} KVKK aydınlatma metni — 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında genel bilgilendirme.`,
  alternates: {
    canonical: "/kvkk",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections: LegalSection[] = [
  {
    heading: "Veri Sorumlusu",
    paragraphs: [
      `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, veri sorumlusu sıfatıyla ${siteConfig.brandName} tarafından hazırlanmıştır.`,
      "Ticaret unvanı, vergi numarası, MERSİS numarası ve tescilli adres gibi resmî kurumsal bilgiler henüz bu metne eklenmemiştir; bu bilgiler netleştiğinde metin güncellenecektir. Bu sayfa şu an için genel bilgilendirme amaçlıdır ve profesyonel hukuki danışmanlığın yerine geçmez.",
    ],
  },
  {
    heading: "İşlenen Kişisel Veriler",
    paragraphs: [
      "Sitemizdeki İletişim, Randevu Al ve Teklif Al formları şu an yalnızca görsel bir arayüz olarak sunulmaktadır; bu formlar aktif hale getirilmeden önce hiçbir kişisel veri toplanmamakta veya işlenmemektedir.",
      "Bu formlar aktif hale getirildiğinde, işlenmesi planlanan kişisel veriler ad soyad, telefon numarası, e-posta adresi ve tarafınızca paylaşılan talep/mesaj içeriği ile sınırlı olacaktır.",
    ],
  },
  {
    heading: "Kişisel Verilerin İşlenme Amacı",
    paragraphs: [
      "Formlar aktif hale geldiğinde, toplanan veriler yalnızca; randevu ve teklif taleplerinizin değerlendirilmesi, sizinle iletişime geçilmesi ve talep ettiğiniz hizmetin planlanması amacıyla işlenecektir.",
    ],
  },
  {
    heading: "Kişisel Verilerin Aktarılması",
    paragraphs: [
      "Şu an herhangi bir kişisel veri toplanmadığı için üçüncü taraflarla veri paylaşımı da söz konusu değildir. İleride bir veri işleme altyapısı (ör. randevu/teklif taleplerinin kaydedilmesi) devreye alındığında, bu bölüm kullanılan altyapı ve olası aktarımlar hakkında güncellenecektir.",
    ],
  },
  {
    heading: "Toplama Yöntemi ve Hukuki Sebep",
    paragraphs: [
      "Kişisel veriler, formlar aktif hale geldiğinde, ilgili kişinin kendi rızasıyla doldurduğu web formları aracılığıyla elektronik ortamda toplanacaktır. İşleme, KVKK'nın ilgili maddelerinde belirtilen hukuki sebeplere (ör. açık rıza, bir sözleşmenin kurulması veya ifasıyla ilgili olması) dayandırılacaktır.",
    ],
  },
  {
    heading: "KVKK Madde 11 Kapsamındaki Haklarınız",
    paragraphs: [
      "KVKK'nın 11. maddesi uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, kanunda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme ve bu işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme haklarına sahipsiniz.",
    ],
  },
  {
    heading: "Başvuru Yöntemi",
    paragraphs: [
      "Yukarıdaki haklarınızla ilgili taleplerinizi İletişim sayfamız üzerinden bize iletebilirsiniz. Resmî başvuru kanalları (ör. KVKK'da öngörülen yazılı başvuru usulü) netleştiğinde bu bölüm güncellenecektir.",
    ],
  },
];

export default function KvkkPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="KVKK Aydınlatma Metni" />
      <LegalArticle lastUpdated="10 Eylül 2026" sections={sections} />
    </>
  );
}
