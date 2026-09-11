import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { createClient } from "@/lib/supabase/server";
import { SITE_SETTINGS_TEXT_KEYS, type WorkingHours } from "@/lib/admin/site-settings";
import { updateSiteSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "Site Ayarları",
  robots: { index: false, follow: false },
};

export default async function AdminSiteSettingsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("site_settings")
    .select("*")
    .in("key", [...SITE_SETTINGS_TEXT_KEYS, "working_hours"]);

  const values: Record<string, string> = {};
  let workingHours: WorkingHours = {};

  for (const row of rows ?? []) {
    if (row.key === "working_hours") {
      workingHours = (row.value as WorkingHours) ?? {};
    } else if (typeof row.value === "string") {
      values[row.key] = row.value;
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Site Ayarları"
        description="İletişim bilgilerini ve genel site ayarlarını yönetin."
      />
      <SiteSettingsForm
        action={updateSiteSettingsAction}
        values={values}
        workingHours={workingHours}
      />
    </div>
  );
}
