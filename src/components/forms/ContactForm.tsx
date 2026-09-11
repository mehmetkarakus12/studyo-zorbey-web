"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { HONEYPOT_FIELD_NAME } from "@/lib/public/honeypot";
import type { ContactMessageActionState } from "@/app/(site)/iletisim/actions";

type ContactFormProps = {
  action: (
    prevState: ContactMessageActionState,
    formData: FormData,
  ) => Promise<ContactMessageActionState>;
};

const initialState: ContactMessageActionState = {};

export function ContactForm({ action }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-3 border border-emerald-200 bg-emerald-50 px-6 py-8"
      >
        <CheckCircle2 className="size-6 text-emerald-700" aria-hidden />
        <p className="font-display text-xl text-foreground">Mesajınız iletildi.</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          En kısa sürede size dönüş yapacağız.
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

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Web sitesi</label>
        <input
          id="contact-website"
          name={HONEYPOT_FIELD_NAME}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Ad Soyad</Label>
          <Input
            id="contact-name"
            name="full_name"
            autoComplete="name"
            required
            aria-invalid={Boolean(state.fieldErrors?.full_name)}
            aria-describedby={state.fieldErrors?.full_name ? "contact-name-error" : undefined}
          />
          {state.fieldErrors?.full_name && (
            <p id="contact-name-error" role="alert" className="text-xs text-red-700">
              {state.fieldErrors.full_name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-phone">Telefon</Label>
          <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">E-posta</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "contact-email-error" : undefined}
        />
        {state.fieldErrors?.email && (
          <p id="contact-email-error" role="alert" className="text-xs text-red-700">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject">Konu</Label>
        <Input id="contact-subject" name="subject" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Mesaj</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? "contact-message-error" : undefined}
        />
        {state.fieldErrors?.message && (
          <p id="contact-message-error" role="alert" className="text-xs text-red-700">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      <Button type="submit" loading={pending} className="mt-2 w-full sm:w-auto">
        Mesajı Gönder
      </Button>
    </form>
  );
}
