import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SeoSettingForm } from "@/components/admin/SeoSettingForm";
import { createSeoSettingAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni SEO Ayarı",
  robots: { index: false, follow: false },
};

export default function NewSeoSettingPage() {
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni SEO Ayarı"
        description="Belirli bir sayfa için meta başlık, açıklama ve Open Graph ayarlarını tanımlayın."
      />
      <SeoSettingForm mode="create" action={createSeoSettingAction} />
    </div>
  );
}
