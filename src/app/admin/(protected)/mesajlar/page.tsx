import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminStatusLegend } from "@/components/admin/AdminStatusLegend";
import { ContactMessagesTable } from "@/components/admin/ContactMessagesTable";
import { CONTACT_MESSAGE_STATUS_OPTIONS } from "@/lib/admin/lead-status";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "İletişim Mesajları",
  robots: { index: false, follow: false },
};

export default async function AdminContactMessagesPage() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="İletişim Mesajları"
        description="İletişim formundan gelen mesajları görüntüleyin ve yanıtlayın."
      />

      <AdminStatusLegend items={CONTACT_MESSAGE_STATUS_OPTIONS} />

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Mesajlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : messages.length > 0 ? (
        <ContactMessagesTable messages={messages} />
      ) : (
        <AdminEmptyState
          icon={Mail}
          title="Henüz mesaj yok"
          description="İletişim formu aktif hale getirildiğinde, gelen mesajlar durum bilgisiyle birlikte burada listelenecek."
        />
      )}
    </div>
  );
}
