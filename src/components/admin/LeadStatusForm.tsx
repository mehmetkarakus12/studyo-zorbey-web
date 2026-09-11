"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LEAD_STATUS_OPTIONS } from "@/lib/admin/lead-status";
import type { LeadStatus } from "@/types/database";

export type LeadStatusActionState = { error?: string };

type LeadStatusFormProps = {
  action: (
    prevState: LeadStatusActionState,
    formData: FormData,
  ) => Promise<LeadStatusActionState>;
  initialStatus: LeadStatus;
  initialNotes: string | null;
};

const initialState: LeadStatusActionState = {};

/**
 * `appointments` ve `quote_requests` detay sayfaları arasında paylaşılan
 * durum/iç-not formu — ikisi de aynı `LeadStatus` şemasını kullanır.
 */
export function LeadStatusForm({ action, initialStatus, initialNotes }: LeadStatusFormProps) {
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
        <Label htmlFor="lead-status">Durum</Label>
        <Select id="lead-status" name="status" defaultValue={initialStatus}>
          {LEAD_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-notes">İç Not</Label>
        <Textarea
          id="lead-notes"
          name="notes"
          rows={4}
          defaultValue={initialNotes ?? ""}
          placeholder="Yalnızca ekip içinde görünür, müşteriye gösterilmez."
        />
      </div>
      <div>
        <Button type="submit" size="sm" loading={pending}>
          Durumu Kaydet
        </Button>
      </div>
    </form>
  );
}
