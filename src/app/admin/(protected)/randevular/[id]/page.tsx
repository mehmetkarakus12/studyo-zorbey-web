import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSection } from "@/components/admin/AdminSection";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { LeadStatusForm } from "@/components/admin/LeadStatusForm";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { leadStatusLabel, leadStatusTone } from "@/lib/admin/lead-status";
import { updateAppointmentStatusAction } from "../actions";

export const metadata: Metadata = {
  title: "Randevu Detayı",
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AdminAppointmentDetailPage(
  props: PageProps<"/admin/randevular/[id]">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (!appointment) {
    return (
      <div className="flex flex-col gap-8">
        <AdminPageHeader title="Randevu Bulunamadı" />
        <AdminEmptyState
          icon={FileQuestion}
          title="Bu randevu bulunamadı"
          description="Görüntülemek istediğiniz talep silinmiş ya da hiç var olmamış olabilir."
          action={<Button href="/admin/randevular">Randevulara Dön</Button>}
        />
      </div>
    );
  }

  let serviceTitle: string | null = null;
  if (appointment.service_id) {
    const { data: service } = await supabase
      .from("services")
      .select("title")
      .eq("id", appointment.service_id)
      .single();
    serviceTitle = service?.title ?? null;
  }

  const boundUpdateAction = updateAppointmentStatusAction.bind(null, appointment.id);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin/randevular"
        className="inline-flex w-fit items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Randevulara Dön
      </Link>

      <AdminPageHeader
        title={appointment.full_name}
        description={`Randevu talebi — ${formatDateTime(appointment.created_at)}`}
        action={
          <AdminBadge tone={leadStatusTone(appointment.status)}>
            {leadStatusLabel(appointment.status)}
          </AdminBadge>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <AdminSection title="Müşteri Bilgileri">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Ad Soyad
                </dt>
                <dd className="text-sm text-foreground">{appointment.full_name}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Telefon
                </dt>
                <dd className="text-sm text-foreground">{appointment.phone}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  E-posta
                </dt>
                <dd className="text-sm text-foreground">{appointment.email ?? "—"}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Hizmet
                </dt>
                <dd className="text-sm text-foreground">{serviceTitle ?? "—"}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Tercih Edilen Tarih
                </dt>
                <dd className="text-sm text-foreground">
                  {appointment.preferred_date ? formatDate(appointment.preferred_date) : "—"}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Tercih Edilen Saat
                </dt>
                <dd className="text-sm text-foreground">
                  {appointment.preferred_time ?? "—"}
                </dd>
              </div>
            </dl>
          </AdminSection>

          <AdminSection title="Mesaj">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {appointment.message ?? "Müşteri bir mesaj bırakmamış."}
            </p>
          </AdminSection>
        </div>

        <div>
          <AdminSection title="Durum Yönetimi">
            <LeadStatusForm
              action={boundUpdateAction}
              initialStatus={appointment.status}
              initialNotes={appointment.notes}
            />
          </AdminSection>
        </div>
      </div>
    </div>
  );
}
