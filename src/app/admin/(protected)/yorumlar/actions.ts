"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  parseTestimonialFormData,
  type TestimonialFieldErrors,
} from "@/lib/admin/testimonial-validation";

export type TestimonialActionState = {
  error?: string;
  fieldErrors?: TestimonialFieldErrors;
};

export type DeleteTestimonialState = { error?: string };

export async function createTestimonialAction(
  _prevState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  await requireAdminSession();

  const { values, errors } = parseTestimonialFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(values);

  if (error) {
    return { error: "Yorum kaydedilirken bir hata oluştu." };
  }

  revalidatePath("/admin/yorumlar");
  redirect("/admin/yorumlar");
}

export async function updateTestimonialAction(
  id: string,
  _prevState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  await requireAdminSession();

  const { values, errors } = parseTestimonialFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(values).eq("id", id);

  if (error) {
    return { error: "Yorum kaydedilirken bir hata oluştu." };
  }

  revalidatePath("/admin/yorumlar");
  redirect("/admin/yorumlar");
}

export async function deleteTestimonialAction(id: string): Promise<DeleteTestimonialState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return { error: "Yorum silinirken bir hata oluştu." };
  }

  revalidatePath("/admin/yorumlar");
  return {};
}
