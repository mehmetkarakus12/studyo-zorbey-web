import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogCategoryForm } from "@/components/admin/BlogCategoryForm";
import { createBlogCategoryAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Kategori",
  robots: { index: false, follow: false },
};

export default function NewBlogCategoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni Kategori"
        description="Blog yazılarını gruplamak için yeni bir kategori oluşturun."
      />
      <BlogCategoryForm mode="create" action={createBlogCategoryAction} />
    </div>
  );
}
