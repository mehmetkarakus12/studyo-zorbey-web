import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { VideoForm } from "@/components/admin/VideoForm";
import { createVideoAction } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Video",
  robots: { index: false, follow: false },
};

export default function NewVideoPage() {
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Yeni Video"
        description="Web sitesinde yayınlanacak yeni bir video ekleyin."
      />
      <VideoForm mode="create" action={createVideoAction} />
    </div>
  );
}
