import type { Metadata } from "next";
import { Star, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Yorumlar",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yorumlar"
        description="Müşteri yorumlarını ve öne çıkan değerlendirmeleri yönetin."
        action={
          <Button href="/admin/yorumlar/yeni">
            <Plus className="size-4" aria-hidden />
            Yeni Yorum
          </Button>
        }
      />

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Yorumlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : testimonials.length > 0 ? (
        <TestimonialsTable testimonials={testimonials} />
      ) : (
        <AdminEmptyState
          icon={Star}
          title="Henüz yorum eklenmedi"
          description="Yorumlar eklendiğinde müşteri adı, çekim türü, puan ve öne çıkarma/aktiflik durumuyla birlikte burada listelenecek."
          action={<Button href="/admin/yorumlar/yeni">İlk Yorumu Ekle</Button>}
        />
      )}
    </div>
  );
}
