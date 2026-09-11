"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { CONTACT_MESSAGE_STATUS_OPTIONS } from "@/lib/admin/lead-status";
import type { ContactMessageStatus } from "@/types/database";

export type ContactMessageStatusActionState = { error?: string };
export type DeleteContactMessageState = { error?: string };

const VALID_STATUSES = new Set<ContactMessageStatus>(
  CONTACT_MESSAGE_STATUS_OPTIONS.map((option) => option.value),
);

export async function updateContactMessageStatusAction(
  id: string,
  _prevState: ContactMessageStatusActionState,
  formData: FormData,
): Promise<ContactMessageStatusActionState> {
  await requireAdminSession();

  const status = String(formData.get("status") ?? "");
  if (!VALID_STATUSES.has(status as ContactMessageStatus)) {
    return { error: "Geçersiz durum seçildi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status: status as ContactMessageStatus })
    .eq("id", id);

  if (error) {
    return { error: "Mesaj güncellenirken bir hata oluştu." };
  }

  revalidatePath(`/admin/mesajlar/${id}`);
  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin");
  return {};
}

export async function deleteContactMessageAction(
  id: string,
): Promise<DeleteContactMessageState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);

  if (error) {
    return { error: "Mesaj silinirken bir hata oluştu." };
  }

  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin");
  return {};
}
