import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { BlogCategoryForm } from "@/components/admin/BlogCategoryForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updateBlogCategoryAction } from "../../actions";

export const metadata: Metadata = {
  title: "Kategoriyi Düzenle",
  robots: { index: false, follow: false },
};

export default async function EditBlogCategoryPage(
  props: PageProps<"/admin/blog/kategoriler/[id]/duzenle">,
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("id", id)
    .single();

  if (!category) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Kategori Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu kategori bulunamadı"
          description="Düzenlemek istediğiniz kategori silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/blog/kategoriler">Kategorilere Dön</Button>}
        />
      </div>
    );
  }

  const boundUpdateAction = updateBlogCategoryAction.bind(null, category.id);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Kategoriyi Düzenle" description={category.name} />
      <BlogCategoryForm mode="edit" action={boundUpdateAction} initialValues={category} />
    </div>
  );
}
