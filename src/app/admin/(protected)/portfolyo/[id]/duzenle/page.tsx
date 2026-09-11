import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSection } from "@/components/admin/AdminSection";
import { PortfolioProjectForm } from "@/components/admin/PortfolioProjectForm";
import { PortfolioGalleryManager } from "@/components/admin/PortfolioGalleryManager";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updatePortfolioProjectAction } from "../../actions";

export const metadata: Metadata = {
  title: "Projeyi Düzenle",
  robots: { index: false, follow: false },
};

export default async function EditPortfolioProjectPage(
  props: PageProps<"/admin/portfolyo/[id]/duzenle">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: project }, { data: categories }, { data: galleryImages }] =
    await Promise.all([
      supabase.from("portfolio_projects").select("*").eq("id", id).single(),
      supabase
        .from("portfolio_categories")
        .select("id, name")
        .order("sort_order", { ascending: true }),
      supabase
        .from("portfolio_images")
        .select("*")
        .eq("project_id", id)
        .order("sort_order", { ascending: true }),
    ]);

  if (!project) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Portfolyo Projesi Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu proje bulunamadı"
          description="Düzenlemek istediğiniz proje silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/portfolyo">Projelere Dön</Button>}
        />
      </div>
    );
  }

  const boundUpdateAction = updatePortfolioProjectAction.bind(null, project.id);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Projeyi Düzenle" description={project.title} />
      <PortfolioProjectForm
        mode="edit"
        action={boundUpdateAction}
        categories={categories ?? []}
        initialValues={project}
      />

      <AdminSection
        title="Galeri Görselleri"
        description="Bu projeye ait galeri fotoğraflarını yükleyin, sıralayın ve alt metinlerini düzenleyin."
      >
        <PortfolioGalleryManager projectId={project.id} images={galleryImages ?? []} />
      </AdminSection>
    </div>
  );
}
