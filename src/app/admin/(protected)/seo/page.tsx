import type { Metadata } from "next";
import { Search, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { SeoSettingsTable } from "@/components/admin/SeoSettingsTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "SEO",
  robots: { index: false, follow: false },
};

export default async function AdminSeoPage() {
  const supabase = await createClient();
  const { data: settings, error } = await supabase
    .from("seo_settings")
    .select("*")
    .order("page_key", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="SEO"
        description="Sayfa başlıkları, açıklamaları ve sosyal paylaşım ayarlarını yönetin."
        action={
          <Button href="/admin/seo/yeni">
            <Plus className="size-4" aria-hidden />
            Yeni Sayfa Ayarı
          </Button>
        }
      />

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          SEO ayarları yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : settings.length > 0 ? (
        <SeoSettingsTable settings={settings} />
      ) : (
        <AdminEmptyState
          icon={Search}
          title="Henüz sayfa bazlı SEO ayarı eklenmedi"
          description="Sayfa başlığı, meta açıklama, canonical URL ve Open Graph ayarları burada sayfa bazında yönetilecek."
          action={<Button href="/admin/seo/yeni">İlk Ayarı Ekle</Button>}
        />
      )}
    </div>
  );
}
