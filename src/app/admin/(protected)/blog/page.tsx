import type { Metadata } from "next";
import { Newspaper, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { BlogPostsTable } from "@/components/admin/BlogPostsTable";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const [{ data: posts, error }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase
        .from("blog_posts")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase.from("blog_categories").select("id, name"),
    ]);

  const categoryNames = new Map((categories ?? []).map((c) => [c.id, c.name]));

  const postsWithCategory = (posts ?? []).map((post) => ({
    ...post,
    categoryName: post.category_id ? (categoryNames.get(post.category_id) ?? null) : null,
  }));

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Blog"
        description="Blog yazılarını yönetin. SEO ayarları ve kapak görseli buradan düzenlenir."
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/admin/blog/kategoriler" variant="outline">
              Kategoriler
            </Button>
            <Button href="/admin/blog/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Yazı
            </Button>
          </div>
        }
      />

      {error || categoriesError ? (
        <p role="alert" className="text-sm text-red-700">
          Blog yazıları yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : postsWithCategory.length > 0 ? (
        <BlogPostsTable posts={postsWithCategory} />
      ) : (
        <AdminEmptyState
          icon={Newspaper}
          title="Henüz blog yazısı eklenmemiş."
          description="İlk yazıyı ekleyerek başlayın — başlık, kategori, kapak görseli ve yayın durumu buradan yönetilir."
          action={<Button href="/admin/blog/yeni">Yeni Blog Yazısı</Button>}
        />
      )}
    </div>
  );
}
