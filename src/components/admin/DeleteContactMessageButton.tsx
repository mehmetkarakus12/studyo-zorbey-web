"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteContactMessageAction } from "@/app/admin/(protected)/mesajlar/actions";

export function DeleteContactMessageButton({
  id,
  senderName,
}: {
  id: string;
  senderName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteContactMessageAction(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.push("/admin/mesajlar");
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-red-700"
      >
        <Trash2 className="size-3.5" aria-hidden />
        Mesajı Sil
      </button>

      <ConfirmDialog
        open={open}
        title="Mesajı sil"
        description={`"${senderName}" tarafından gönderilen bu mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
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
