import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updateBlogPostAction } from "../../actions";

export const metadata: Metadata = {
  title: "Yazıyı Düzenle",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage(
  props: PageProps<"/admin/blog/[id]/duzenle">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).single(),
    supabase.from("blog_categories").select("id, name").order("name", { ascending: true }),
  ]);

  if (!post) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Blog Yazısı Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu yazı bulunamadı"
          description="Düzenlemek istediğiniz yazı silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/blog">Yazılara Dön</Button>}
        />
      </div>
    );
  }

  const boundUpdateAction = updateBlogPostAction.bind(null, post.id);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Yazıyı Düzenle" description={post.title} />
      <BlogPostForm
        mode="edit"
        action={boundUpdateAction}
        categories={categories ?? []}
        initialValues={post}
      />
    </div>
  );
}
