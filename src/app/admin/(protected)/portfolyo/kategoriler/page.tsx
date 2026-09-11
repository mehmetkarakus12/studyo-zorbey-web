import type { Metadata } from "next";
import { FolderKanban, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PortfolioCategoriesTable } from "@/components/admin/PortfolioCategoriesTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Portfolyo Kategorileri",
  robots: { index: false, follow: false },
};

export default async function AdminPortfolioCategoriesPage() {
  const supabase = await createClient();

  const [{ data: categories, error }, { data: projects, error: projectsError }] =
    await Promise.all([
      supabase
        .from("portfolio_categories")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase.from("portfolio_projects").select("category_id"),
    ]);

  const projectCounts = new Map<string, number>();
  for (const project of projects ?? []) {
    if (!project.category_id) continue;
    projectCounts.set(
      project.category_id,
      (projectCounts.get(project.category_id) ?? 0) + 1,
    );
  }

  const categoriesWithCount = (categories ?? []).map((category) => ({
    ...category,
    projectCount: projectCounts.get(category.id) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Portfolyo Kategorileri"
        description="Portfolyo projelerini gruplamak için kullanılan kategorileri yönetin."
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/admin/portfolyo" variant="outline">
              Projelere Dön
            </Button>
            <Button href="/admin/portfolyo/kategoriler/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Kategori
            </Button>
          </div>
        }
      />

      {error || projectsError ? (
        <p role="alert" className="text-sm text-red-700">
          Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : categoriesWithCount.length > 0 ? (
        <PortfolioCategoriesTable categories={categoriesWithCount} />
      ) : (
        <AdminEmptyState
          icon={FolderKanban}
          title="Henüz kategori eklenmemiş."
          description="İlk kategoriyi ekleyerek başlayın — portfolyo projeleri bir kategoriye bağlı olmalıdır."
          action={
            <Button href="/admin/portfolyo/kategoriler/yeni">İlk Kategoriyi Ekle</Button>
          }
        />
      )}
    </div>
  );
}
