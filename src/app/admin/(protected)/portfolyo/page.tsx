import type { Metadata } from "next";
import { Images, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PortfolioProjectsTable } from "@/components/admin/PortfolioProjectsTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Portfolyo",
  robots: { index: false, follow: false },
};

export default async function AdminPortfolioPage() {
  const supabase = await createClient();

  const [
    { data: projects, error },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase.from("portfolio_categories").select("id, name"),
  ]);

  const categoryNames = new Map((categories ?? []).map((c) => [c.id, c.name]));

  const projectsWithCategory = (projects ?? []).map((project) => ({
    ...project,
    categoryName: project.category_id
      ? (categoryNames.get(project.category_id) ?? null)
      : null,
  }));

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Portfolyo"
        description="Portfolyo projelerini yönetin. Görsel galerisi ve kapak fotoğrafı sonraki bir aşamada eklenecek."
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/admin/portfolyo/kategoriler" variant="outline">
              Kategoriler
            </Button>
            <Button href="/admin/portfolyo/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Proje
            </Button>
          </div>
        }
      />

      {error || categoriesError ? (
        <p role="alert" className="text-sm text-red-700">
          Portfolyo projeleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : projectsWithCategory.length > 0 ? (
        <PortfolioProjectsTable projects={projectsWithCategory} />
      ) : (
        <AdminEmptyState
          icon={Images}
          title="Henüz portfolyo projesi eklenmemiş."
          description="İlk projeyi ekleyerek başlayın — başlık, kategori, konum ve yayın durumu buradan yönetilir."
          action={<Button href="/admin/portfolyo/yeni">İlk Projeyi Ekle</Button>}
        />
      )}
    </div>
  );
}
