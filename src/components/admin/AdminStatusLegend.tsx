import { AdminBadge } from "@/components/admin/AdminBadge";

type StatusLegendItem = {
  value: string;
  label: string;
  tone: "neutral" | "accent" | "warning" | "success" | "danger";
};

/**
 * Talep yönetimi sayfalarında (randevular/teklifler/mesajlar) gelecekteki
 * durum akışını (bkz. `LeadStatus` / `ContactMessageStatus`, gerçek DB
 * şemasından) önizleyen, henüz veriye bağlı olmayan bir referans şeridi.
 */
export function AdminStatusLegend({ items }: { items: StatusLegendItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Planlanan durumlar:
      </span>
      {items.map((item) => (
        <AdminBadge key={item.value} tone={item.tone}>
          {item.label}
        </AdminBadge>
      ))}
    </div>
  );
}
