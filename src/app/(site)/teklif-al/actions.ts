"use server";

import { createClient } from "@/lib/supabase/server";
import { parseQuoteRequestFormData, type QuoteRequestFieldErrors } from "@/lib/public/quote-validation";
import {
  checkRateLimit,
  getRateLimitKey,
  isHoneypotTriggered,
} from "@/lib/public/spam-protection";

export type QuoteRequestActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: QuoteRequestFieldErrors;
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function createQuoteRequestAction(
  _prevState: QuoteRequestActionState,
  formData: FormData,
): Promise<QuoteRequestActionState> {
  if (isHoneypotTriggered(formData)) {
    return { success: true };
  }

  const rateLimitKey = await getRateLimitKey("quote");
  const { allowed } = checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return {
      error: "Çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.",
    };
  }

  const { values, errors } = parseQuoteRequestFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").insert(values);

  if (error) {
    return {
      error: "Teklif talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }

  return { success: true };
}
