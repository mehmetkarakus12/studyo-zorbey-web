import { siteConfig } from "@/config/site";

/**
 * Bu dosyadaki her tip yalnızca ilgili Supabase tablosunda GERÇEKTEN var
 * olan kolonları taşır (bkz. supabase/migrations/20260910120700_leads.sql).
 * Şemada bulunmayan alan uydurulmaz.
 */

export type AppointmentNotificationData = {
  id: string;
  full_name: string;
  phone: string;
  serviceTitle: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  createdAt: string;
};

export type QuoteNotificationData = {
  id: string;
  full_name: string;
  phone: string;
  serviceTitle: string | null;
  event_date: string | null;
  location: string | null;
  message: string | null;
  createdAt: string;
};

export type ContactNotificationData = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
};

type EmailRow = { label: string; value: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateTr(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeTr(value: string | null): string | null {
  if (!value) return null;
  // Supabase `time` kolonu "HH:MM:SS" döner.
  return value.slice(0, 5);
}

function formatDateTimeTr(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderEmailHtml(
  heading: string,
  rows: EmailRow[],
  detailUrl: string,
): string {
  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:8px 12px;color:#6b6459;font-size:14px;white-space:nowrap;vertical-align:top;">${escapeHtml(row.label)}</td>
          <td style="padding:8px 12px;color:#211d18;font-size:14px;">${escapeHtml(row.value).replace(/\n/g, "<br>")}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:24px;background:#f7f2e8;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" style="max-width:480px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #e7e0d3;border-collapse:collapse;">
      <tr>
        <td style="padding:20px 12px 4px;">
          <h1 style="margin:0;font-size:18px;color:#211d18;font-family:Georgia,serif;">${escapeHtml(heading)}</h1>
        </td>
      </tr>
      ${rowsHtml}
      <tr>
        <td colspan="2" style="padding:16px 12px 20px;">
          <a href="${detailUrl}" style="display:inline-block;background:#211d18;color:#f7f2e8;padding:10px 20px;text-decoration:none;font-size:14px;">Admin panelde görüntüle</a>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// --- Randevu ---------------------------------------------------------

export function buildAppointmentEmail(data: AppointmentNotificationData): {
  subject: string;
  html: string;
} {
  const rows: EmailRow[] = [
    { label: "Müşteri", value: data.full_name },
    { label: "Telefon", value: data.phone },
  ];
  if (data.serviceTitle) rows.push({ label: "Hizmet", value: data.serviceTitle });

  const dateLabel = formatDateTr(data.preferred_date);
  const timeLabel = formatTimeTr(data.preferred_time);
  if (dateLabel) {
    rows.push({
      label: "Tarih",
      value: timeLabel ? `${dateLabel}, ${timeLabel}` : dateLabel,
    });
  }
  rows.push({ label: "Oluşturulma", value: formatDateTimeTr(data.createdAt) });

  return {
    subject: "Yeni Randevu Talebi — Stüdyo Zorbey",
    html: renderEmailHtml(
      "Yeni Randevu Talebi",
      rows,
      `${siteConfig.url}/admin/randevular/${data.id}`,
    ),
  };
}

export function buildAppointmentWhatsAppText(
  data: AppointmentNotificationData,
): string {
  const lines = [
    "📅 Yeni Randevu Talebi",
    "",
    `Müşteri: ${data.full_name}`,
    `Telefon: ${data.phone}`,
  ];
  if (data.serviceTitle) lines.push(`Hizmet: ${data.serviceTitle}`);

  const dateLabel = formatDateTr(data.preferred_date);
  const timeLabel = formatTimeTr(data.preferred_time);
  if (dateLabel) {
    lines.push(`Tarih: ${timeLabel ? `${dateLabel}, ${timeLabel}` : dateLabel}`);
  }
  lines.push("", "Stüdyo Zorbey Admin Panel");
  return lines.join("\n");
}

// --- Teklif ------------------------------------------------------------

export function buildQuoteEmail(data: QuoteNotificationData): {
  subject: string;
  html: string;
} {
  const rows: EmailRow[] = [
    { label: "Müşteri", value: data.full_name },
    { label: "Telefon", value: data.phone },
  ];
  if (data.serviceTitle) rows.push({ label: "Hizmet", value: data.serviceTitle });

  const dateLabel = formatDateTr(data.event_date);
  if (dateLabel) rows.push({ label: "Etkinlik Tarihi", value: dateLabel });
  if (data.location) rows.push({ label: "Lokasyon", value: data.location });
  if (data.message) rows.push({ label: "Mesaj", value: data.message });
  rows.push({ label: "Oluşturulma", value: formatDateTimeTr(data.createdAt) });

  return {
    subject: "Yeni Teklif Talebi — Stüdyo Zorbey",
    html: renderEmailHtml(
      "Yeni Teklif Talebi",
      rows,
      `${siteConfig.url}/admin/teklifler/${data.id}`,
    ),
  };
}

export function buildQuoteWhatsAppText(data: QuoteNotificationData): string {
  const lines = [
    "📋 Yeni Teklif Talebi",
    "",
    `Müşteri: ${data.full_name}`,
    `Telefon: ${data.phone}`,
  ];
  if (data.serviceTitle) lines.push(`Hizmet: ${data.serviceTitle}`);

  const dateLabel = formatDateTr(data.event_date);
  if (dateLabel) lines.push(`Etkinlik Tarihi: ${dateLabel}`);
  if (data.location) lines.push(`Lokasyon: ${data.location}`);
  lines.push("", "Stüdyo Zorbey Admin Panel");
  return lines.join("\n");
}

// --- İletişim ------------------------------------------------------------

export function buildContactEmail(data: ContactNotificationData): {
  subject: string;
  html: string;
} {
  const rows: EmailRow[] = [{ label: "Ad Soyad", value: data.full_name }];
  rows.push({ label: "E-posta", value: data.email });
  if (data.phone) rows.push({ label: "Telefon", value: data.phone });
  if (data.subject) rows.push({ label: "Konu", value: data.subject });
  rows.push({ label: "Mesaj", value: data.message });
  rows.push({ label: "Oluşturulma", value: formatDateTimeTr(data.createdAt) });

  return {
    subject: "Yeni İletişim Mesajı — Stüdyo Zorbey",
    html: renderEmailHtml(
      "Yeni İletişim Mesajı",
      rows,
      `${siteConfig.url}/admin/mesajlar/${data.id}`,
    ),
  };
}

export function buildContactWhatsAppText(data: ContactNotificationData): string {
  const lines = [
    "💬 Yeni İletişim Mesajı",
    "",
    `Ad Soyad: ${data.full_name}`,
    `E-posta: ${data.email}`,
  ];
  if (data.phone) lines.push(`Telefon: ${data.phone}`);
  if (data.subject) lines.push(`Konu: ${data.subject}`);
  lines.push("", "Stüdyo Zorbey Admin Panel");
  return lines.join("\n");
}
