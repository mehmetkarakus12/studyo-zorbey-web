import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createServiceAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Hizmet",
  robots: { index: false, follow: false },
};

export default function NewServicePage() {
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni Hizmet"
        description="Web sitesinde yayınlanacak yeni bir hizmet oluşturun."
      />
      <ServiceForm mode="create" action={createServiceAction} />
    </div>
  );
}
