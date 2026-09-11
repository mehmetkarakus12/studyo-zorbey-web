import Link from "next/link";
import { Eye } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { contactMessageStatusLabel, contactMessageStatusTone } from "@/lib/admin/lead-status";
import type { Tables } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ContactMessagesTable({
  messages,
}: {
  messages: Tables<"contact_messages">[];
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              İsim
            </th>
            <th scope="col" className="px-4 py-3">
              Konu
            </th>
            <th scope="col" className="px-4 py-3">
              E-posta
            </th>
            <th scope="col" className="px-4 py-3">
              Telefon
            </th>
            <th scope="col" className="px-4 py-3">
              Durum
            </th>
            <th scope="col" className="px-4 py-3">
              Tarih
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {messages.map((message) => (
            <tr key={message.id} className={message.status === "new" ? "bg-accent/5" : undefined}>
              <td className="px-4 py-3 font-medium text-foreground">{message.full_name}</td>
              <td className="px-4 py-3 text-muted-foreground">{message.subject ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{message.email}</td>
              <td className="px-4 py-3 text-muted-foreground">{message.phone ?? "—"}</td>
              <td className="px-4 py-3">
                <AdminBadge tone={contactMessageStatusTone(message.status)}>
                  {contactMessageStatusLabel(message.status)}
                </AdminBadge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(message.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/mesajlar/${message.id}`}
                    aria-label={`${message.full_name} mesajını görüntüle`}
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
