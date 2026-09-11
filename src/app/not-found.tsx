import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

/**
 * Kök seviye 404 — hiçbir route ile eşleşmeyen URL'ler (ör. /foo-bar) için.
 * `(site)` bir route group olduğu için bu durumda `(site)/layout.tsx`
 * devrede olmaz; Header/Footer bu yüzden burada elle sarmalanır (bkz.
 * `NotFoundContent` üzerindeki not).
 */
export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootNotFound() {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main-content">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
