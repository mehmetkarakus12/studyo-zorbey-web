"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CONTACT_MESSAGE_STATUS_OPTIONS } from "@/lib/admin/lead-status";
import type { ContactMessageStatus } from "@/types/database";

export type ContactMessageStatusActionState = { error?: string };

type ContactMessageStatusFormProps = {
  action: (
    prevState: ContactMessageStatusActionState,
    formData: FormData,
  ) => Promise<ContactMessageStatusActionState>;
  initialStatus: ContactMessageStatus;
};

const initialState: ContactMessageStatusActionState = {};

export function ContactMessageStatusForm({ action, initialStatus }: ContactMessageStatusFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="message-status">Durum</Label>
        <Select id="message-status" name="status" defaultValue={initialStatus}>
          {CONTACT_MESSAGE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Button type="submit" size="sm" loading={pending}>
          Durumu Kaydet
        </Button>
      </div>
    </form>
  );
}
