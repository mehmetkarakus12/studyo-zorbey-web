import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false, follow: false },
};

/**
 * `/admin/*` altında hiçbir sayfaya eşleşmeyen path'ler için. Next.js'in
 * `not-found.tsx` mekanizması (deneyerek doğrulandı — bkz. public site
 * 404 düzeltmesindeki aynı bulgu) gerçekten eşleşmeyen route'larda nested
 * layout'ları atlayıp doğrudan kök `app/not-found.tsx`'e düşüyor; bu da
 * admin alanında YANLIŞLIKLA public site görünümünü (Header/Footer) verir.
 *
 * Çözüm: `not-found.tsx`'e güvenmek yerine gerçek bir catch-all ROUTE
 * kullanmak — Next.js her zaman daha spesifik (statik) segmentleri bu
 * catch-all'dan önce eşleştirir, bu yüzden `/admin/hizmetler` gibi gerçek
 * sayfalar etkilenmez; sadece hiçbir şeye uymayan path'ler buraya düşer.
 * Gerçek bir route olduğu için otomatik olarak `(protected)/layout.tsx`
 * içinden geçer — auth kontrolü ve sidebar/topbar kabuğu buradan gelir,
 * ayrıca bir kontrol yazmaya gerek yok.
 */
export default function AdminCatchAllNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="font-display text-5xl text-accent italic">404</span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-normal">
          Bu yönetim sayfası bulunamadı.
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.
        </p>
      </div>
      <Button href="/admin">Panele Dön</Button>
    </div>
  );
}
