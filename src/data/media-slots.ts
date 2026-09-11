import type { MediaAspectRatio } from "@/types";

/**
 * MEDYA SLOT SİSTEMİ
 * ===================
 * Gerçek Stüdyo Zorbey fotoğraf/video içerikleri klasör yapısı:
 *
 *   public/images/hero/{slot}.jpg
 *   public/images/services/{slot}.jpg
 *   public/images/portfolio/{slot}.jpg
 *   public/images/about/{slot}.jpg
 *   public/images/video/{slot}.jpg
 *   public/images/blog/{slot}.jpg
 *   public/images/instagram/{slot}.jpg
 *
 * Her slotun `image` alanı, diskteki gerçek dosyanın yolunu tutar.
 * `image` tanımlıysa <MediaPlaceholder slot="..."> otomatik olarak
 * next/image ile gerçek görseli render eder (hero `priority` ile);
 * `image` tanımsızsa (ör. "studio-team") mevcut premium placeholder
 * fallback olarak kalır — uygulama kırılmaz.
 *
 * NOT — dosya adı uyumsuzlukları (Faz 1.6 tarama sonucu):
 * "service-engegament.jpg" ve "portfolio-engegament-01.jpg" dosyaları
 * "engagement" yazım hatasıyla eklenmiş; içerik ve klasör konumuna göre
 * bunlar sırasıyla service-engagement / portfolio-engagement-01
 * slotlarına eşlendi. Kullanıcının dosyaları yeniden adlandırılmadı —
 * kod, diskteki gerçek (hatalı) dosya adını referans alıyor.
 *
 * Önerilen minimum çözünürlükler:
 *   portrait (4:5)   → en az 1200×1500px
 *   landscape (3:2)  → en az 1600×1067px
 *   square (1:1)     → en az 1200×1200px
 *   cinematic (21:9) → en az 2200×943px
 */

export type MediaSlotSection =
  | "hero"
  | "services"
  | "portfolio"
  | "about"
  | "video"
  | "blog"
  | "instagram";

export type MediaSlotMeta = {
  section: MediaSlotSection;
  aspect: MediaAspectRatio;
  /** Gerçek görsel için anlamlı Türkçe alt metin (yoksa placeholder açıklaması). */
  alt: string;
  /** Diskteki gerçek dosya yolu — tanımlıysa placeholder yerine gerçek görsel render edilir. */
  image?: string;
  /** Yalnızca gerekli olduğu görsellerde: object-position override (varsayılan: merkez). */
  objectPosition?: string;
  /** Sadece hero görseli için true — next/image priority yükleme alacak. */
  priority?: boolean;
};

export const mediaSlots = {
  "hero-wedding-main": {
    section: "hero",
    aspect: "portrait",
    alt: "Stüdyo Zorbey'de çekilen gelin damat stüdyo portresi",
    image: "/images/hero/hero-wedding-main.jpg",
    priority: true,
  },

  "service-wedding": {
    section: "services",
    aspect: "portrait",
    alt: "Sütunlu köşkte gelin damat düğün fotoğrafı",
    image: "/images/services/service-wedding.jpg",
  },
  "service-engagement": {
    section: "services",
    aspect: "portrait",
    alt: "Çiçek buketiyle nişan çifti portresi",
    image: "/images/services/service-engegament.jpg",
  },
  "service-outdoor": {
    section: "services",
    aspect: "portrait",
    alt: "Dağ manzaralı ahşap kulübe önünde çift dış çekimi",
    image: "/images/services/service-outdoor.jpg",
  },
  "service-studio": {
    section: "services",
    aspect: "portrait",
    alt: "Stüdyo ortamında bebek duyurusu detay çekimi",
    image: "/images/services/service-studio.jpg",
  },
  "service-video-drone": {
    section: "services",
    aspect: "portrait",
    alt: "Havadan drone ile çekilmiş çift fotoğrafı",
    image: "/images/services/service-video-drone.jpg",
  },
  "service-corporate": {
    section: "services",
    aspect: "portrait",
    alt: "Stüdyo Zorbey kurumsal ürün fotoğrafçılığı örneği",
    image: "/images/services/service-corporate.jpg",
  },
  // Faz 1.8 kapsamında hizmet kataloğu genişletildi; aşağıdaki 6 hizmetin
  // henüz teslim edilmiş gerçek bir fotoğrafı yok — bu yüzden `image`
  // alanı bilinçli olarak boş bırakıldı, MediaPlaceholder otomatik olarak
  // premium fallback görünümüne düşer.
  "service-henna": {
    section: "services",
    aspect: "portrait",
    alt: "Kına gecesi çekimi görseli",
  },
  "service-passport": {
    section: "services",
    aspect: "portrait",
    alt: "Vesikalık fotoğraf çekimi görseli",
  },
  "service-biometric": {
    section: "services",
    aspect: "portrait",
    alt: "Biyometrik fotoğraf çekimi görseli",
  },
  "service-kids": {
    section: "services",
    aspect: "portrait",
    alt: "Çocuk ve bebek çekimi görseli",
  },
  "service-graduation": {
    section: "services",
    aspect: "portrait",
    alt: "Mezuniyet çekimi görseli",
  },
  "service-product": {
    section: "services",
    aspect: "portrait",
    alt: "Ürün fotoğrafçılığı görseli",
  },
  "service-drone": {
    section: "services",
    aspect: "portrait",
    alt: "Drone çekimi görseli",
  },

  "portfolio-wedding-01": {
    section: "portfolio",
    aspect: "portrait",
    alt: "Sütunlu köşkte düğün hikâyesi",
    image: "/images/portfolio/portfolio-wedding-01.jpg",
  },
  "portfolio-engagement-01": {
    section: "portfolio",
    aspect: "landscape",
    alt: "Nişan gecesi çift portresi",
    image: "/images/portfolio/portfolio-engegament-01.jpg",
  },
  "portfolio-henna-01": {
    section: "portfolio",
    aspect: "square",
    alt: "Kına gecesi organizasyonunda çift portresi",
    image: "/images/portfolio/portfolio-henna-01.jpg",
  },
  "portfolio-outdoor-01": {
    section: "portfolio",
    aspect: "portrait",
    alt: "Ahşap kulübe önünde dış çekim hikâyesi",
    image: "/images/portfolio/portfolio-outdoor-01.jpg",
  },
  "portfolio-wedding-02": {
    section: "portfolio",
    aspect: "landscape",
    alt: "Tarihi bina önünde düğün fotoğrafı",
    image: "/images/portfolio/portfolio-wedding-02.jpg",
  },
  "portfolio-studio-01": {
    section: "portfolio",
    // Gerçek dosya 1200×1200 (kare) geldi — orijinal "portrait" planı
    // bu flatlay kompozisyonun kenarlarını (taç bloğu / ultrason kağıdı)
    // keserdi. Kırpma yerine oranı gerçek görsele göre güncelledik.
    aspect: "square",
    alt: "Bebek duyurusu stüdyo detay çekimi",
    image: "/images/portfolio/portfolio-studio-01.jpg",
  },

  // Proje detay sayfalarındaki galeri, kapak görseline ek olarak 2 kare
  // daha gösterir. Bu ek karelerin henüz gerçek fotoğrafı yok — `image`
  // bilinçli olarak boş, premium placeholder fallback'i devreye girer.
  // Oranlar (portrait/landscape/square) editoryal asimetri için bilinçli
  // olarak karıştırıldı.
  "portfolio-wedding-01-gallery-2": {
    section: "portfolio",
    aspect: "landscape",
    alt: "Düğün hikâyesinden bir kare",
  },
  "portfolio-wedding-01-gallery-3": {
    section: "portfolio",
    aspect: "square",
    alt: "Düğün hikâyesinden bir kare",
  },
  "portfolio-engagement-01-gallery-2": {
    section: "portfolio",
    aspect: "portrait",
    alt: "Nişan hikâyesinden bir kare",
  },
  "portfolio-engagement-01-gallery-3": {
    section: "portfolio",
    aspect: "square",
    alt: "Nişan hikâyesinden bir kare",
  },
  "portfolio-henna-01-gallery-2": {
    section: "portfolio",
    aspect: "portrait",
    alt: "Kına gecesinden bir kare",
  },
  "portfolio-henna-01-gallery-3": {
    section: "portfolio",
    aspect: "landscape",
    alt: "Kına gecesinden bir kare",
  },
  "portfolio-outdoor-01-gallery-2": {
    section: "portfolio",
    aspect: "landscape",
    alt: "Dış çekim hikâyesinden bir kare",
  },
  "portfolio-outdoor-01-gallery-3": {
    section: "portfolio",
    aspect: "square",
    alt: "Dış çekim hikâyesinden bir kare",
  },
  "portfolio-wedding-02-gallery-2": {
    section: "portfolio",
    aspect: "portrait",
    alt: "Düğün hikâyesinden bir kare",
  },
  "portfolio-wedding-02-gallery-3": {
    section: "portfolio",
    aspect: "square",
    alt: "Düğün hikâyesinden bir kare",
  },
  "portfolio-studio-01-gallery-2": {
    section: "portfolio",
    aspect: "portrait",
    alt: "Stüdyo çekiminden bir kare",
  },
  "portfolio-studio-01-gallery-3": {
    section: "portfolio",
    aspect: "landscape",
    alt: "Stüdyo çekiminden bir kare",
  },

  "studio-team": {
    section: "about",
    aspect: "portrait",
    alt: "Stüdyo / ekip görseli",
    // "about/studio-team.jpg" olarak teslim edilen dosya bir ekip/stüdyo
    // fotoğrafı değil, Stüdyo Zorbey logosu (beyaz zemin üzerine
    // fotoğraf makinesi ikonu + STÜDYO ZORBEY yazısı). Bu görsel bir
    // logo olduğu için editorial "Hakkımızda" fotoğraf alanına
    // yerleştirilmedi — slot bilinçli olarak boş bırakıldı, placeholder
    // fallback olarak kalıyor. Detay için Faz 1.6 raporuna bakınız.
  },

  "video-hero-highlight": {
    section: "video",
    aspect: "cinematic",
    alt: "Havadan çekilmiş sinematik düğün görüntüsü",
    image: "/images/video/video-hero-highlight.jpg",
  },

  "blog-location": {
    section: "blog",
    aspect: "landscape",
    alt: "Doğal alanda gelin damat dış çekim lokasyonu",
    image: "/images/blog/blog-location.jpg",
  },
  "blog-photographer": {
    section: "blog",
    aspect: "landscape",
    alt: "Geniş açıdan çekilmiş dağ manzaralı çift fotoğrafı",
    image: "/images/blog/blog-photographer.jpg",
  },
  "blog-wedding-guide": {
    section: "blog",
    aspect: "landscape",
    alt: "Gün batımında sahilde gelin damat fotoğrafı",
    image: "/images/blog/blog-wedding-guide.jpg",
  },
  "blog-henna-planning": {
    section: "blog",
    aspect: "landscape",
    alt: "Kına gecesi planlaması yazısı görseli",
  },
  "blog-engagement-styling": {
    section: "blog",
    aspect: "landscape",
    alt: "Nişan çekimi stil önerileri yazısı görseli",
  },

  "instagram-01": {
    section: "instagram",
    aspect: "square",
    alt: "Stüdyo Zorbey Instagram paylaşımı — havadan çift fotoğrafı",
    image: "/images/instagram/instagram-01.jpg",
  },
  "instagram-02": {
    section: "instagram",
    aspect: "square",
    alt: "Stüdyo Zorbey Instagram paylaşımı — davet mekânında çift portresi",
    image: "/images/instagram/instagram-02.jpg",
  },
  "instagram-03": {
    section: "instagram",
    aspect: "square",
    alt: "Stüdyo Zorbey Instagram paylaşımı — gelin damat yakın çekim portresi",
    image: "/images/instagram/instagram-03.jpg",
  },
  "instagram-04": {
    section: "instagram",
    aspect: "square",
    alt: "Stüdyo Zorbey Instagram paylaşımı — tarihi bina önünde çift fotoğrafı",
    image: "/images/instagram/instagram-04.jpg",
  },
  "instagram-05": {
    section: "instagram",
    aspect: "square",
    alt: "Stüdyo Zorbey Instagram paylaşımı — stüdyo içi gelin damat portresi",
    image: "/images/instagram/instagram-05.jpg",
  },
  "instagram-06": {
    section: "instagram",
    aspect: "square",
    alt: "Stüdyo Zorbey Instagram paylaşımı — ahşap kulübe önünde çift fotoğrafı",
    image: "/images/instagram/instagram-06.jpg",
  },
} as const satisfies Record<string, MediaSlotMeta>;

export type MediaSlotId = keyof typeof mediaSlots;

/**
 * Bir slotun gerçek fotoğrafı varsa dosya yolunu döner, yoksa `undefined`.
 * Sayfa bazlı Open Graph görseli seçerken kullanılır — hiçbir zaman sahte/
 * placeholder bir görsel URL'si üretmemek için buradan geçilir.
 */
export function getSlotImage(slot: MediaSlotId): string | undefined {
  const meta: MediaSlotMeta = mediaSlots[slot];
  return meta.image;
}
