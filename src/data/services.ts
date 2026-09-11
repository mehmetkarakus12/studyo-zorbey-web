/**
 * NOT: Hizmet kataloğu (`services`/`featuredServices`) artık burada DEĞİL —
 * admin panelden yönetilen gerçek `services` tablosundan
 * `@/lib/data/services`'teki `getActiveServices()`/`getFeaturedServices()`
 * ile okunur (Faz 2 Paket 2). Burada yalnızca hizmet detay sayfasındaki
 * jenerik, hizmete özel olmayan SSS bloğu kalır — schema'da bir SSS alanı
 * olmadığı için bu, sahte/uydurma veri değil, tüm hizmetler için ortak
 * kullanılan editoryal boilerplate metindir.
 */
export const serviceFaqs: { question: string; answer: string }[] = [
  {
    question: "Çekim için nasıl randevu alabilirim?",
    answer:
      "Randevu Al sayfasından talebinizi iletebilirsiniz; ekibimiz en kısa sürede sizinle iletişime geçer.",
  },
  {
    question: "Fiyat bilgisi alabilir miyim?",
    answer:
      "Fiyatlandırma çekimin kapsamına göre değişir. Teklif Al sayfasından detayları paylaşarak size özel bilgi alabilirsiniz.",
  },
  {
    question: "Teslimat süresi ne kadar sürer?",
    answer:
      "Teslimat süresi çekimin kapsamına göre değişir; bu detay görüşme aşamasında sizinle netleştirilir.",
  },
];
