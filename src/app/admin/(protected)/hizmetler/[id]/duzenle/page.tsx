import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updateServiceAction } from "../../actions";

export const metadata: Metadata = {
  title: "Hizmeti Düzenle",
  robots: { index: false, follow: false },
};

export default async function EditServicePage(
  props: PageProps<"/admin/hizmetler/[id]/duzenle">,
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (!service) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Hizmet Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu hizmet bulunamadı"
          description="Düzenlemek istediğiniz hizmet silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/hizmetler">Hizmetlere Dön</Button>}
        />
      </div>
    );
  }

  const boundUpdateAction = updateServiceAction.bind(null, service.id);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Hizmeti Düzenle" description={service.title} />
      <ServiceForm mode="edit" action={boundUpdateAction} initialValues={service} />
    </div>
  );
}
