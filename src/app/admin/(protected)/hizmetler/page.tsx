import type { Metadata } from "next";
import { Camera, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { ServicesTable } from "@/components/admin/ServicesTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Hizmetler",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Hizmetler"
        description="Web sitesinde sunulan fotoğraf, video ve çekim hizmetlerini yönetin."
        action={
          <Button href="/admin/hizmetler/yeni">
            <Plus className="size-4" aria-hidden />
            Yeni Hizmet
          </Button>
        }
      />

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Hizmetler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : services.length > 0 ? (
        <ServicesTable services={services} />
      ) : (
        <AdminEmptyState
          icon={Camera}
          title="Henüz hizmet eklenmemiş."
          description="İlk hizmeti ekleyerek başlayın — başlık, açıklama ve yayın durumu buradan yönetilir."
          action={
            <Button href="/admin/hizmetler/yeni">İlk Hizmeti Ekle</Button>
          }
        />
      )}
    </div>
  );
}
