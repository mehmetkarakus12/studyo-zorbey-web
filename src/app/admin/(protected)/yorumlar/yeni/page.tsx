import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { createTestimonialAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Yorum",
  robots: { index: false, follow: false },
};

export default function NewTestimonialPage() {
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni Yorum"
        description="Gerçek bir müşteri onayı ile yeni bir yorum ekleyin."
      />
      <TestimonialForm mode="create" action={createTestimonialAction} />
    </div>
  );
}
