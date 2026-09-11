import Link from "next/link";
import { Eye } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { leadStatusLabel, leadStatusTone } from "@/lib/admin/lead-status";
import type { Tables } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type AppointmentsTableProps = {
  appointments: Tables<"appointments">[];
  serviceTitles: Map<string, string>;
};

export function AppointmentsTable({ appointments, serviceTitles }: AppointmentsTableProps) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Müşteri
            </th>
            <th scope="col" className="px-4 py-3">
              Telefon
            </th>
            <th scope="col" className="px-4 py-3">
              Hizmet
            </th>
            <th scope="col" className="px-4 py-3">
              Tercih Edilen Tarih
            </th>
            <th scope="col" className="px-4 py-3">
              Durum
            </th>
            <th scope="col" className="px-4 py-3">
              Oluşturulma
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="px-4 py-3 font-medium text-foreground">
                {appointment.full_name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{appointment.phone}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {appointment.service_id
                  ? (serviceTitles.get(appointment.service_id) ?? "—")
                  : "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {appointment.preferred_date ? formatDate(appointment.preferred_date) : "—"}
              </td>
              <td className="px-4 py-3">
                <AdminBadge tone={leadStatusTone(appointment.status)}>
                  {leadStatusLabel(appointment.status)}
                </AdminBadge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(appointment.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/randevular/${appointment.id}`}
                    aria-label={`${appointment.full_name} randevusunu görüntüle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Eye className="size-4" aria-hidden />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
