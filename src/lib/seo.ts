/**
 * Next.js, bir sayfa kendi `openGraph` alanını tanımladığında üst
 * (layout) metadata'sındaki `openGraph.images`'i miras ALMAZ — tüm
 * `openGraph` nesnesi o segment için yeniden tanımlanmış olur. Bu yüzden
 * gerçek bir kapak fotoğrafı olmayan sayfalarda (ör. henüz temsili
 * placeholder'ı olan hizmetler) `images` alanını boş bırakmak yerine, bu
 * paylaşılan varsayılanı elle geri düşürüyoruz — aksi halde o sayfa sosyal
 * paylaşımda görselsiz görünür.
 */
export const defaultOgImage = {
  url: "/images/video/video-hero-highlight.jpg",
  width: 1920,
  height: 823,
  alt: "Stüdyo Zorbey — sinematik düğün görüntüsü",
};
