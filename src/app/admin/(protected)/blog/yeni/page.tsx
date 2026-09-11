import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { createClient } from "@/lib/supabase/server";
import { createBlogPostAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Blog Yazısı",
  robots: { index: false, follow: false },
};

export default async function NewBlogPostPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("blog_categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni Blog Yazısı"
        description="Web sitesinde yayınlanacak yeni bir blog yazısı oluşturun."
      />
      <BlogPostForm
        mode="create"
        action={createBlogPostAction}
        categories={categories ?? []}
      />
    </div>
  );
}
