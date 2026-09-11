import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updateTestimonialAction } from "../../actions";

export const metadata: Metadata = {
  title: "Yorumu Düzenle",
  robots: { index: false, follow: false },
};

export default async function EditTestimonialPage(
  props: PageProps<"/admin/yorumlar/[id]/duzenle">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (!testimonial) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Yorum Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu yorum bulunamadı"
          description="Düzenlemek istediğiniz yorum silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/yorumlar">Yorumlara Dön</Button>}
        />
      </div>
    );
  }

  const boundUpdateAction = updateTestimonialAction.bind(null, testimonial.id);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Yorumu Düzenle" description={testimonial.customer_name} />
      <TestimonialForm mode="edit" action={boundUpdateAction} initialValues={testimonial} />
    </div>
  );
}
