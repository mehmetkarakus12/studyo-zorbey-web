"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  deleteMediaAction,
  updateMediaAltTextAction,
} from "@/app/admin/(protected)/medya/actions";
import type { Tables } from "@/types/database";

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MediaItem({ item }: { item: Tables<"media"> }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteMediaAction(item.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setConfirmOpen(false);
      router.refresh();
    });
  }

  function handleAltTextBlur(value: string) {
    startTransition(async () => {
      await updateMediaAltTextAction(item.id, value);
    });
  }

  return (
    <li className="flex flex-col gap-2 border border-border p-3">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.public_url}
          alt={item.alt_text ?? item.file_name}
          className="size-full object-cover"
        />
      </div>
      <p className="truncate text-xs font-medium text-foreground" title={item.file_name}>
        {item.file_name}
      </p>
      <p className="text-xs text-muted-foreground">
        {item.mime_type.replace("image/", "").toUpperCase()} ·{" "}
        {formatFileSize(item.file_size)}
        {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
      </p>
      <p className="text-xs text-muted-foreground">
        {item.folder ?? "genel"} · {formatDate(item.created_at)}
      </p>
      <Input
        defaultValue={item.alt_text ?? ""}
        placeholder="Alt metin"
        onBlur={(event) => handleAltTextBlur(event.target.value)}
        className="text-sm"
        aria-label="Dosya alt metni"
      />
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={`${item.file_name} dosyasını sil`}
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-red-700"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Dosyayı sil"
        description={`"${item.file_name}" dosyasını silmek istediğinize emin misiniz? Aktif bir içerikte kullanılıyorsa silme işlemi engellenir.`}
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        destructive
        pending={pending}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setError(null);
        }}
      />
    </li>
  );
}

export function MediaLibraryGrid({ items }: { items: Tables<"media">[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <MediaItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
