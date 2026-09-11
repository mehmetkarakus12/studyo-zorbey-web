import type { ContactMessageStatus, LeadStatus } from "@/types/database";

type StatusTone = "neutral" | "accent" | "warning" | "success" | "danger";

/**
 * `appointments` ve `quote_requests` — ikisi de aynı `LeadStatus` CHECK
 * kısıtını paylaşır (bkz. supabase/migrations/20260910120700_leads.sql),
 * bu yüzden durum etiketleri/tonları tek yerden yönetilir.
 */
export const LEAD_STATUS_OPTIONS: {
  value: LeadStatus;
  label: string;
  tone: StatusTone;
}[] = [
  { value: "new", label: "Yeni", tone: "accent" },
  { value: "contacted", label: "İletişime Geçildi", tone: "neutral" },
  { value: "confirmed", label: "Onaylandı", tone: "success" },
  { value: "completed", label: "Tamamlandı", tone: "success" },
  { value: "cancelled", label: "İptal Edildi", tone: "danger" },
];

export function leadStatusLabel(status: LeadStatus): string {
  return LEAD_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function leadStatusTone(status: LeadStatus): StatusTone {
  return LEAD_STATUS_OPTIONS.find((option) => option.value === status)?.tone ?? "neutral";
}

export const CONTACT_MESSAGE_STATUS_OPTIONS: {
  value: ContactMessageStatus;
  label: string;
  tone: StatusTone;
}[] = [
  { value: "new", label: "Yeni", tone: "accent" },
  { value: "read", label: "Okundu", tone: "neutral" },
  { value: "replied", label: "Yanıtlandı", tone: "success" },
  { value: "archived", label: "Arşivlendi", tone: "neutral" },
];

export function contactMessageStatusLabel(status: ContactMessageStatus): string {
  return (
    CONTACT_MESSAGE_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export function contactMessageStatusTone(status: ContactMessageStatus): StatusTone {
  return (
    CONTACT_MESSAGE_STATUS_OPTIONS.find((option) => option.value === status)?.tone ??
    "neutral"
  );
}
