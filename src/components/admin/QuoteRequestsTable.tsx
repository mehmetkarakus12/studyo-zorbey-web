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

type QuoteRequestsTableProps = {
  quoteRequests: Tables<"quote_requests">[];
  serviceTitles: Map<string, string>;
};

export function QuoteRequestsTable({ quoteRequests, serviceTitles }: QuoteRequestsTableProps) {
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
              Etkinlik Tarihi
            </th>
            <th scope="col" className="px-4 py-3">
              Lokasyon
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
          {quoteRequests.map((quote) => (
            <tr key={quote.id}>
              <td className="px-4 py-3 font-medium text-foreground">{quote.full_name}</td>
              <td className="px-4 py-3 text-muted-foreground">{quote.phone}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {quote.service_id ? (serviceTitles.get(quote.service_id) ?? "—") : "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {quote.event_date ? formatDate(quote.event_date) : "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{quote.location ?? "—"}</td>
              <td className="px-4 py-3">
                <AdminBadge tone={leadStatusTone(quote.status)}>
                  {leadStatusLabel(quote.status)}
                </AdminBadge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(quote.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/teklifler/${quote.id}`}
                    aria-label={`${quote.full_name} teklifini görüntüle`}
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
