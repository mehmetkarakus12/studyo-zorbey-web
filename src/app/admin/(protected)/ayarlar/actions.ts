"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  SITE_SETTINGS_TEXT_KEYS,
  WORKING_HOURS_DAYS,
  type WorkingHours,
} from "@/lib/admin/site-settings";
import type { TablesInsert } from "@/types/database";

export type SiteSettingsActionState = { error?: string; success?: boolean };

function textValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateSiteSettingsAction(
  _prevState: SiteSettingsActionState,
  formData: FormData,
): Promise<SiteSettingsActionState> {
  await requireAdminSession();

  const workingHours: WorkingHours = {};
  for (const day of WORKING_HOURS_DAYS) {
    const value = textValue(formData, `working_hours_${day.key}`);
    if (value) workingHours[day.key] = value;
  }

  const rows: TablesInsert<"site_settings">[] = SITE_SETTINGS_TEXT_KEYS.map((key) => ({
    key,
    value: textValue(formData, key),
  }));
  rows.push({ key: "working_hours", value: workingHours });

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) {
    return { error: "Site ayarları kaydedilirken bir hata oluştu." };
  }

  revalidatePath("/admin/ayarlar");
  return { success: true };
}
