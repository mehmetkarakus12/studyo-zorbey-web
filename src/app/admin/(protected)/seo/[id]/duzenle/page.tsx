import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { SeoSettingForm } from "@/components/admin/SeoSettingForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updateSeoSettingAction } from "../../actions";

export const metadata: Metadata = {
  title: "SEO Ayarını Düzenle",
  robots: { index: false, follow: false },
};

export default async function EditSeoSettingPage(
  props: PageProps<"/admin/seo/[id]/duzenle">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: setting } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("id", id)
    .single();

  if (!setting) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="SEO Ayarı Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu SEO ayarı bulunamadı"
          description="Düzenlemek istediğiniz ayar silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/seo">SEO Ayarlarına Dön</Button>}
        />
      </div>
    );
  }

  const boundUpdateAction = updateSeoSettingAction.bind(null, setting.id);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="SEO Ayarını Düzenle" description={setting.page_key} />
      <SeoSettingForm mode="edit" action={boundUpdateAction} initialValues={setting} />
    </div>
  );
}
