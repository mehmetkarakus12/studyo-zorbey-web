import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PortfolioCategoryForm } from "@/components/admin/PortfolioCategoryForm";
import { createPortfolioCategoryAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Kategori",
  robots: { index: false, follow: false },
};

export default function NewPortfolioCategoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni Kategori"
        description="Portfolyo projelerini gruplamak için yeni bir kategori oluşturun."
      />
      <PortfolioCategoryForm mode="create" action={createPortfolioCategoryAction} />
    </div>
  );
}
