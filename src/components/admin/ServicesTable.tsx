import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { DeleteServiceButton } from "@/components/admin/DeleteServiceButton";
import type { Tables } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ServicesTable({ services }: { services: Tables<"services">[] }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Hizmet
            </th>
            <th scope="col" className="px-4 py-3">
              Slug
            </th>
            <th scope="col" className="px-4 py-3">
              Durum
            </th>
            <th scope="col" className="px-4 py-3">
              Öne Çıkan
            </th>
            <th scope="col" className="px-4 py-3">
              Sıralama
            </th>
            <th scope="col" className="px-4 py-3">
              Son Güncelleme
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-4 py-3 font-medium text-foreground">
                {service.title}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {service.slug}
              </td>
              <td className="px-4 py-3">
                <AdminBadge tone={service.is_active ? "success" : "neutral"}>
                  {service.is_active ? "Aktif" : "Pasif"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                {service.is_featured ? (
                  <AdminBadge tone="accent">Öne Çıkan</AdminBadge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {service.sort_order}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(service.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/hizmetler/${service.id}/duzenle`}
                    aria-label={`${service.title} hizmetini düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeleteServiceButton id={service.id} title={service.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
