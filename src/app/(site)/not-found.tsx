import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
