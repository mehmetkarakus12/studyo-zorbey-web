"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ctaLabels } from "@/config/site";
import { HONEYPOT_FIELD_NAME } from "@/lib/public/honeypot";
import type { AppointmentActionState } from "@/app/(site)/randevu-al/actions";
import type { Tables } from "@/types/database";

type AppointmentFormProps = {
  action: (
    prevState: AppointmentActionState,
    formData: FormData,
  ) => Promise<AppointmentActionState>;
  services: Pick<Tables<"services">, "id" | "title">[];
};

const initialState: AppointmentActionState = {};

export function AppointmentForm({ action, services }: AppointmentFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-3 border border-emerald-200 bg-emerald-50 px-6 py-8"
      >
        <CheckCircle2 className="size-6 text-emerald-700" aria-hidden />
        <p className="font-display text-xl text-foreground">Talebiniz alındı.</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Randevu talebiniz başarıyla gönderildi. Ekibimiz en kısa sürede sizinle iletişime
          geçecek.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-7">
      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      {/* Honeypot — gerçek kullanıcılar bu alanı görmez/doldurmaz. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="appointment-website">Web sitesi</label>
        <input
          id="appointment-website"
          name={HONEYPOT_FIELD_NAME}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointment-name">Ad Soyad</Label>
          <Input
            id="appointment-name"
            name="full_name"
            autoComplete="name"
            required
            aria-invalid={Boolean(state.fieldErrors?.full_name)}
            aria-describedby={
              state.fieldErrors?.full_name ? "appointment-name-error" : undefined
            }
          />
          {state.fieldErrors?.full_name && (
            <p id="appointment-name-error" role="alert" className="text-xs text-red-700">
              {state.fieldErrors.full_name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointment-phone">Telefon</Label>
          <Input
            id="appointment-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            aria-invalid={Boolean(state.fieldErrors?.phone)}
            aria-describedby={
              state.fieldErrors?.phone ? "appointment-phone-error" : undefined
            }
          />
          {state.fieldErrors?.phone && (
            <p id="appointment-phone-error" role="alert" className="text-xs text-red-700">
              {state.fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="appointment-email">E-posta</Label>
        <Input
          id="appointment-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "appointment-email-error" : undefined}
        />
        {state.fieldErrors?.email && (
          <p id="appointment-email-error" role="alert" className="text-xs text-red-700">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      {services.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointment-service">Hizmet</Label>
          <Select id="appointment-service" name="service_id" defaultValue="">
            <option value="">Bir hizmet seçin</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointment-date">Tercih Edilen Tarih</Label>
          <Input id="appointment-date" name="preferred_date" type="date" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointment-time">Tercih Edilen Saat</Label>
          <Input id="appointment-time" name="preferred_time" type="time" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="appointment-message">Mesaj / Not</Label>
        <Textarea id="appointment-message" name="message" rows={4} />
      </div>

      <Button type="submit" loading={pending} className="mt-2 w-full sm:w-auto">
        {ctaLabels.bookAppointment}
      </Button>
    </form>
  );
}
