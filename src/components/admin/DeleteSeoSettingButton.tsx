"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteSeoSettingAction } from "@/app/admin/(protected)/seo/actions";

export function DeleteSeoSettingButton({ id, pageKey }: { id: string; pageKey: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteSeoSettingAction(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${pageKey} SEO ayarını sil`}
        className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-red-700"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>

      <ConfirmDialog
        open={open}
        title="SEO ayarını sil"
        description={`"${pageKey}" sayfasına ait SEO ayarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        destructive
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => {
          setOpen(false);
          setError(null);
        }}
      />

      {error && (
        <p role="alert" className="max-w-48 text-right text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
