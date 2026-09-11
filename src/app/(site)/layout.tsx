import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
