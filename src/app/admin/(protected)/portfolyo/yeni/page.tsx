import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PortfolioProjectForm } from "@/components/admin/PortfolioProjectForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { createPortfolioProjectAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Proje",
  robots: { index: false, follow: false },
};

export default async function NewPortfolioProjectPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("portfolio_categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Yeni Proje" />
        <AdminEmptyState
          icon={FolderKanban}
          title="Önce bir kategori oluşturmalısınız"
          description="Portfolyo projeleri bir kategoriye bağlı olmalıdır. Devam etmeden önce en az bir kategori ekleyin."
          action={
            <Button href="/admin/portfolyo/kategoriler/yeni">Kategori Ekle</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni Proje"
        description="Web sitesinde yayınlanacak yeni bir portfolyo projesi oluşturun."
      />
      <PortfolioProjectForm
        mode="create"
        action={createPortfolioProjectAction}
        categories={categories}
      />
    </div>
  );
}
