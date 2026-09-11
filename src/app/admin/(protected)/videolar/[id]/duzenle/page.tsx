import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { VideoForm } from "@/components/admin/VideoForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updateVideoAction } from "../../actions";

export const metadata: Metadata = {
  title: "Videoyu Düzenle",
  robots: { index: false, follow: false },
};

export default async function EditVideoPage(
  props: PageProps<"/admin/videolar/[id]/duzenle">,
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (!video) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Video Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu video bulunamadı"
          description="Düzenlemek istediğiniz video silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/videolar">Videolara Dön</Button>}
        />
      </div>
    );
  }

  const boundUpdateAction = updateVideoAction.bind(null, video.id);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Videoyu Düzenle" description={video.title} />
      <VideoForm mode="edit" action={boundUpdateAction} initialValues={video} />
    </div>
  );
}
