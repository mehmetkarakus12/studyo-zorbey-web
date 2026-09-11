"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { AdminSection } from "@/components/admin/AdminSection";
import { AdminToggleField } from "@/components/admin/AdminToggleField";
import type { TestimonialActionState } from "@/app/admin/(protected)/yorumlar/actions";
import type { Tables } from "@/types/database";

type TestimonialFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: TestimonialActionState,
    formData: FormData,
  ) => Promise<TestimonialActionState>;
  initialValues?: Tables<"testimonials">;
};

const initialState: TestimonialActionState = {};

export function TestimonialForm({ mode, action, initialValues }: TestimonialFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <AdminSection title="Müşteri Bilgileri">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="testimonial-customer-name">Müşteri Adı</Label>
            <Input
              id="testimonial-customer-name"
              name="customer_name"
              required
              defaultValue={initialValues?.customer_name}
              aria-invalid={Boolean(state.fieldErrors?.customer_name)}
              aria-describedby={
                state.fieldErrors?.customer_name
                  ? "testimonial-customer-name-error"
                  : undefined
              }
            />
            {state.fieldErrors?.customer_name && (
              <p
                id="testimonial-customer-name-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.customer_name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="testimonial-shooting-type">Çekim Türü</Label>
            <Input
              id="testimonial-shooting-type"
              name="shooting_type"
              placeholder="ör. Düğün, Nişan, Dış Çekim"
              defaultValue={initialValues?.shooting_type ?? ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="testimonial-event-date">Etkinlik Tarihi</Label>
            <Input
              id="testimonial-event-date"
              name="event_date"
              type="date"
              defaultValue={initialValues?.event_date ?? ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="testimonial-rating">Puan</Label>
            <Select
              id="testimonial-rating"
              name="rating"
              defaultValue={initialValues?.rating ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.rating)}
              aria-describedby={
                state.fieldErrors?.rating ? "testimonial-rating-error" : undefined
              }
            >
              <option value="">Puan yok</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} / 5
                </option>
              ))}
            </Select>
            {state.fieldErrors?.rating && (
              <p id="testimonial-rating-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.rating}
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <AdminSection title="Yorum">
        <div className="flex flex-col gap-2">
          <Label htmlFor="testimonial-content">Yorum Metni</Label>
          <Textarea
            id="testimonial-content"
            name="content"
            rows={5}
            required
            defaultValue={initialValues?.content}
            aria-invalid={Boolean(state.fieldErrors?.content)}
            aria-describedby={
              state.fieldErrors?.content ? "testimonial-content-error" : undefined
            }
          />
          {state.fieldErrors?.content && (
            <p id="testimonial-content-error" role="alert" className="text-xs text-red-700">
              {state.fieldErrors.content}
            </p>
          )}
        </div>
      </AdminSection>

      <AdminSection title="Yayın Ayarları">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminToggleField
              name="is_active"
              label="Aktif"
              description="Kapalıyken bu yorum public sitede gösterilmez."
              defaultChecked={initialValues?.is_active ?? true}
            />
            <AdminToggleField
              name="is_featured"
              label="Öne Çıkan"
              description="Öne çıkan yorumlar arasında gösterilebilir."
              defaultChecked={initialValues?.is_featured ?? false}
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <Label htmlFor="testimonial-sort-order">Sıralama</Label>
            <Input
              id="testimonial-sort-order"
              name="sort_order"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={initialValues?.sort_order ?? 0}
              aria-invalid={Boolean(state.fieldErrors?.sort_order)}
              aria-describedby={
                state.fieldErrors?.sort_order ? "testimonial-sort-order-error" : undefined
              }
            />
            {state.fieldErrors?.sort_order && (
              <p
                id="testimonial-sort-order-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.sort_order}
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Yorumu Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/yorumlar" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
