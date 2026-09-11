"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  SITE_MEDIA_BUCKET,
  buildSafeStoragePath,
  validateImageFile,
  type MediaFolder,
} from "@/lib/admin/media-upload";

type MediaUploadFieldProps = {
  /** Formda gönderilecek gizli input adı — Server Action bu alanı diğer
   * metin alanları gibi `formData.get(name)` ile okur. */
  name: string;
  label: string;
  folder: MediaFolder;
  recommendedSize: string;
  recommendedRatio: string;
  initialUrl?: string | null;
  note?: string;
  /** `useActionState`'in `pending` değeri — başarısız bir kayıttan sonra
   * bu oturumda yüklenmiş ama hiç DB'ye bağlanmamış "orphan" dosyayı
   * otomatik temizlemek için izlenir. */
  pending?: boolean;
  /** Son submit denemesi hata ile mi sonuçlandı (alan hatası ya da genel
   * hata) — `pending` true'dan false'a düştüğünde bu true ise ve bu alan
   * o oturumda yeni bir dosya yüklediyse, dosya Storage'dan silinir ve
   * alan orijinal değerine geri döner. */
  submitFailed?: boolean;
};

export function MediaUploadField({
  name,
  label,
  folder,
  recommendedSize,
  recommendedRatio,
  initialUrl,
  note,
  pending,
  submitFailed,
}: MediaUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasPendingRef = useRef(false);

  const [value, setValue] = useState(initialUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState(initialUrl ?? "");
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const wasPending = wasPendingRef.current;
    wasPendingRef.current = Boolean(pending);

    if (wasPending && !pending && submitFailed && uploadedPath) {
      const supabase = createClient();
      supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .remove([uploadedPath])
        .catch(() => {});
      setUploadedPath(null);
      setValue(initialUrl ?? "");
      setPreviewUrl(initialUrl ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, submitFailed]);

  async function handleFile(file: File) {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStatus("uploading");
    setPreviewUrl(URL.createObjectURL(file));

    const path = buildSafeStoragePath(folder, file);
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      setStatus("error");
      setError("Görsel yüklenirken bir hata oluştu.");
      setPreviewUrl(value);
      return;
    }

    if (uploadedPath) {
      supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .remove([uploadedPath])
        .catch(() => {});
    }

    const { data: publicUrlData } = supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .getPublicUrl(path);

    setUploadedPath(path);
    setValue(publicUrlData.publicUrl);
    setPreviewUrl(publicUrlData.publicUrl);
    setStatus("idle");
  }

  function handleRemove() {
    if (uploadedPath) {
      const supabase = createClient();
      supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .remove([uploadedPath])
        .catch(() => {});
      setUploadedPath(null);
    }
    setValue("");
    setPreviewUrl("");
    setError(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <input type="hidden" name={name} value={value} />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col gap-4 border border-dashed p-4 transition-colors sm:flex-row sm:items-start",
          dragOver ? "border-accent bg-accent/5" : "border-border",
        )}
      >
        <div className="relative size-32 shrink-0 overflow-hidden border border-border bg-muted">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={`${label} önizleme`}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageIcon className="size-6" aria-hidden />
            </div>
          )}
          {status === "uploading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="size-5 animate-spin text-white" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
            onChange={handleInputChange}
            className="sr-only"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              aria-label={value ? `${label} değiştir` : `${label} yükle`}
            >
              {value ? "Değiştir" : "Görsel Seç"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                aria-label={`${label} kaldır`}
              >
                <X className="size-3.5" aria-hidden />
                Kaldır
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Önerilen ölçü: {recommendedSize} ({recommendedRatio}). JPG, PNG
            veya WEBP — maksimum 8 MB. Bu yalnızca önerilir; farklı ölçüdeki
            görseller de kabul edilir.
          </p>
          {note && <p className="text-xs text-muted-foreground">{note}</p>}
          {error && (
            <p role="alert" className="text-xs text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
