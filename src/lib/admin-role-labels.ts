import type { ProfileRole } from "@/types/database";

const roleLabels: Record<ProfileRole, string> = {
  admin: "Yönetici",
  editor: "Editör",
};

/**
 * UI'da gösterilecek Türkçe rol etiketi. Bu SADECE görsel bir etikettir —
 * gerçek yetkilendirme her zaman server-side (`requireAdminSession`, RLS)
 * üzerinden yapılır, bu fonksiyon güvenlik mekanizması değildir.
 */
export function getRoleLabel(role: ProfileRole): string {
  return roleLabels[role];
}
