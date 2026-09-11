"use server";

import { createClient } from "@/lib/supabase/server";
import { parseContactMessageFormData, type ContactMessageFieldErrors } from "@/lib/public/contact-validation";
import {
  checkRateLimit,
  getRateLimitKey,
  isHoneypotTriggered,
} from "@/lib/public/spam-protection";

export type ContactMessageActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: ContactMessageFieldErrors;
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function createContactMessageAction(
  _prevState: ContactMessageActionState,
  formData: FormData,
): Promise<ContactMessageActionState> {
  if (isHoneypotTriggered(formData)) {
    return { success: true };
  }

  const rateLimitKey = await getRateLimitKey("contact");
  const { allowed } = checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return {
      error: "Çok fazla mesaj gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.",
    };
  }

  const { values, errors } = parseContactMessageFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(values);

  if (error) {
    return {
      error: "Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }

  return { success: true };
}
