import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminStatusLegend } from "@/components/admin/AdminStatusLegend";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { LEAD_STATUS_OPTIONS } from "@/lib/admin/lead-status";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Randevular",
  robots: { index: false, follow: false },
};

export default async function AdminAppointmentsPage() {
  const supabase = await createClient();

  const [{ data: appointments, error }, { data: services }] = await Promise.all([
    supabase.from("appointments").select("*").order("created_at", { ascending: false }),
    supabase.from("services").select("id, title"),
  ]);

  const serviceTitles = new Map((services ?? []).map((service) => [service.id, service.title]));

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Randevular"
        description="Web sitesinden gelen randevu taleplerini görüntüleyin ve takip edin."
      />

      <AdminStatusLegend items={LEAD_STATUS_OPTIONS} />

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Randevular yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : appointments.length > 0 ? (
        <AppointmentsTable appointments={appointments} serviceTitles={serviceTitles} />
      ) : (
        <AdminEmptyState
          icon={CalendarCheck}
          title="Henüz randevu talebi yok"
          description="Randevu Al formu aktif hale getirildiğinde, gelen talepler durum bilgisiyle birlikte burada listelenecek."
        />
      )}
    </div>
  );
}
