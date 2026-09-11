import type { Metadata } from "next";
import { FolderKanban, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { BlogCategoriesTable } from "@/components/admin/BlogCategoriesTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog Kategorileri",
  robots: { index: false, follow: false },
};

export default async function AdminBlogCategoriesPage() {
  const supabase = await createClient();

  const [{ data: categories, error }, { data: posts, error: postsError }] =
    await Promise.all([
      supabase.from("blog_categories").select("*").order("name", { ascending: true }),
      supabase.from("blog_posts").select("category_id"),
    ]);

  const postCounts = new Map<string, number>();
  for (const post of posts ?? []) {
    if (!post.category_id) continue;
    postCounts.set(post.category_id, (postCounts.get(post.category_id) ?? 0) + 1);
  }

  const categoriesWithCount = (categories ?? []).map((category) => ({
    ...category,
    postCount: postCounts.get(category.id) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Blog Kategorileri"
        description="Blog yazılarını gruplamak için kullanılan kategorileri yönetin."
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/admin/blog" variant="outline">
              Yazılara Dön
            </Button>
            <Button href="/admin/blog/kategoriler/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Kategori
            </Button>
          </div>
        }
      />

      {error || postsError ? (
        <p role="alert" className="text-sm text-red-700">
          Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : categoriesWithCount.length > 0 ? (
        <BlogCategoriesTable categories={categoriesWithCount} />
      ) : (
        <AdminEmptyState
          icon={FolderKanban}
          title="Henüz kategori eklenmemiş."
          description="İlk kategoriyi ekleyerek başlayın — blog yazıları isterseniz bir kategoriye bağlanabilir."
          action={<Button href="/admin/blog/kategoriler/yeni">İlk Kategoriyi Ekle</Button>}
        />
      )}
    </div>
  );
}
