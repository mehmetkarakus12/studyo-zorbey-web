import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSection } from "@/components/admin/AdminSection";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { ContactMessageStatusForm } from "@/components/admin/ContactMessageStatusForm";
import { DeleteContactMessageButton } from "@/components/admin/DeleteContactMessageButton";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { contactMessageStatusLabel, contactMessageStatusTone } from "@/lib/admin/lead-status";
import { updateContactMessageStatusAction } from "../actions";

export const metadata: Metadata = {
  title: "Mesaj Detayı",
  robots: { index: false, follow: false },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminContactMessageDetailPage(
  props: PageProps<"/admin/mesajlar/[id]">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: message } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .single();

  if (!message) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Mesaj Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu mesaj bulunamadı"
          description="Görüntülemek istediğiniz mesaj silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/mesajlar">Mesajlara Dön</Button>}
        />
      </div>
    );
  }

  // Detay sayfası açıldığında "Yeni" durumundaki bir mesaj otomatik olarak
  // "Okundu" işaretlenir (bkz. proje talimatları — şema destekliyorsa
  // okundu işaretleme). Liste sayfasının önbelleği kullanmadığı (auth
  // cookie'si zaten dinamik render'a zorluyor) için ayrı bir revalidate
  // gerekmez.
  if (message.status === "new") {
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    message.status = "read";
  }

  const boundUpdateAction = updateContactMessageStatusAction.bind(null, message.id);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin/mesajlar"
        className="inline-flex w-fit items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Mesajlara Dön
      </Link>

      <AdminPageHeader
        title={message.full_name}
        description={`${message.subject ? `${message.subject} — ` : ""}${formatDateTime(message.created_at)}`}
        action={
          <AdminBadge tone={contactMessageStatusTone(message.status)}>
            {contactMessageStatusLabel(message.status)}
          </AdminBadge>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <AdminSection title="Gönderen Bilgileri">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Ad Soyad
                </dt>
                <dd className="text-sm text-foreground">{message.full_name}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  E-posta
                </dt>
                <dd className="text-sm text-foreground">{message.email}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Telefon
                </dt>
                <dd className="text-sm text-foreground">{message.phone ?? "—"}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Konu
                </dt>
                <dd className="text-sm text-foreground">{message.subject ?? "—"}</dd>
              </div>
            </dl>
          </AdminSection>

          <AdminSection title="Mesaj">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {message.message}
            </p>
          </AdminSection>
        </div>

        <div className="flex flex-col gap-6">
          <AdminSection title="Durum Yönetimi">
            <ContactMessageStatusForm
              action={boundUpdateAction}
              initialStatus={message.status}
            />
          </AdminSection>

          <div className="border-t border-border pt-4">
            <DeleteContactMessageButton id={message.id} senderName={message.full_name} />
          </div>
        </div>
      </div>
    </div>
  );
}
