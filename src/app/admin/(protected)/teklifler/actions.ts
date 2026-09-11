"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { LEAD_STATUS_OPTIONS } from "@/lib/admin/lead-status";
import type { LeadStatus } from "@/types/database";

export type LeadStatusActionState = { error?: string };

const VALID_STATUSES = new Set<LeadStatus>(LEAD_STATUS_OPTIONS.map((option) => option.value));

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

export async function updateQuoteRequestStatusAction(
  id: string,
  _prevState: LeadStatusActionState,
  formData: FormData,
): Promise<LeadStatusActionState> {
  await requireAdminSession();

  const status = String(formData.get("status") ?? "");
  if (!VALID_STATUSES.has(status as LeadStatus)) {
    return { error: "Geçersiz durum seçildi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_requests")
    .update({
      status: status as LeadStatus,
      notes: optionalText(formData.get("notes")),
    })
    .eq("id", id);

  if (error) {
    return { error: "Teklif talebi güncellenirken bir hata oluştu." };
  }

  revalidatePath(`/admin/teklifler/${id}`);
  revalidatePath("/admin/teklifler");
  revalidatePath("/admin");
  return {};
}
