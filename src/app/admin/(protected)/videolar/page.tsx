import type { Metadata } from "next";
import { Video as VideoIcon, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { VideosTable } from "@/components/admin/VideosTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Videolar",
  robots: { index: false, follow: false },
};

export default async function AdminVideosPage() {
  const supabase = await createClient();
  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Videolar"
        description="Web sitesinde gösterilen video içeriklerini yönetin."
        action={
          <Button href="/admin/videolar/yeni">
            <Plus className="size-4" aria-hidden />
            Yeni Video
          </Button>
        }
      />

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Videolar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : videos.length > 0 ? (
        <VideosTable videos={videos} />
      ) : (
        <AdminEmptyState
          icon={VideoIcon}
          title="Henüz video eklenmemiş."
          description="Videolar eklendiğinde başlık, kaynak (YouTube/Vimeo/harici URL), kapak görseli ve öne çıkarma durumuyla birlikte burada listelenecek."
          action={<Button href="/admin/videolar/yeni">Yeni Video</Button>}
        />
      )}
    </div>
  );
}
