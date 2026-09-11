"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  SITE_MEDIA_BUCKET,
  GALLERY_RECOMMENDED_SIZES,
  MAX_GALLERY_FILES_PER_UPLOAD,
  buildGalleryStoragePath,
  validateImageFile,
} from "@/lib/admin/media-upload";
import {
  addPortfolioGalleryImageAction,
  deletePortfolioGalleryImageAction,
  movePortfolioGalleryImageAction,
  updatePortfolioGalleryAltTextAction,
} from "@/app/admin/(protected)/portfolyo/gallery-actions";
import type { Tables } from "@/types/database";

type PortfolioGalleryManagerProps = {
  projectId: string;
  images: Tables<"portfolio_images">[];
};

/**
 * `MediaUploadField`'dan farklı olarak tek bir form alanına değil,
 * doğrudan `portfolio_images` tablosuna bağlıdır — her dosya yüklendiğinde
 * kendi DB satırını hemen oluşturur (proje formunun ana submit'ini
 * beklemez), bu yüzden Server Action'ları burada doğrudan çağırır ve
 * `router.refresh()` ile sunucu verisini tazeler.
 */
export function PortfolioGalleryManager({
  projectId,
  images,
}: PortfolioGalleryManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [, startTransition] = useTransition();

  async function handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (files.length > MAX_GALLERY_FILES_PER_UPLOAD) {
      setUploadError(
        `Tek seferde en fazla ${MAX_GALLERY_FILES_PER_UPLOAD} görsel yükleyebilirsiniz.`,
      );
      return;
    }

    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }
    }

    setUploadError(null);
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    const supabase = createClient();

    for (const file of files) {
      const path = buildGalleryStoragePath(projectId, file);
      const { error: uploadErr } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadErr) {
        setUploadError(`"${file.name}" yüklenirken bir hata oluştu.`);
        setUploadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : null));
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .getPublicUrl(path);

      const result = await addPortfolioGalleryImageAction(
        projectId,
        publicUrlData.publicUrl,
      );

      if (result.error) {
        setUploadError(result.error);
        await supabase.storage
          .from(SITE_MEDIA_BUCKET)
          .remove([path])
          .catch(() => {});
      }

      setUploadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : null));
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      handleFiles(event.target.files);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
    }
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deletePortfolioGalleryImageAction(projectId, id);
      if (result.error) setUploadError(result.error);
      router.refresh();
    });
  }

  function handleMove(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await movePortfolioGalleryImageAction(projectId, id, direction);
      if (result.error) setUploadError(result.error);
      router.refresh();
    });
  }

  function handleAltTextBlur(id: string, value: string) {
    startTransition(async () => {
      await updatePortfolioGalleryAltTextAction(projectId, id, value);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-3 border border-dashed p-6 text-center transition-colors",
          dragOver ? "border-accent bg-accent/5" : "border-border",
        )}
      >
        <ImageIcon className="size-6 text-muted-foreground" aria-hidden />
        <div className="flex flex-col gap-1">
          <p className="text-sm text-foreground">
            Görselleri buraya sürükleyin ya da seçin.
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG veya WEBP — görsel başına maksimum 8 MB, tek seferde en
            fazla {MAX_GALLERY_FILES_PER_UPLOAD} görsel.
          </p>
          <p className="max-w-md text-xs text-muted-foreground">
            Önerilen ölçüler:{" "}
            {GALLERY_RECOMMENDED_SIZES.map(
              (size) => `${size.label} ${size.size} (${size.ratio})`,
            ).join(" · ")}
            . Galeride farklı oranlardaki görseller birlikte kullanılabilir —
            ölçüler önerilir, yanlış çözünürlük yüklemeyi engellemez.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
          onChange={handleInputChange}
          className="sr-only"
          id={`gallery-upload-${projectId}`}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          Görsel Seç
        </Button>
        {uploadProgress && (
          <p className="text-xs text-muted-foreground">
            Yükleniyor: {uploadProgress.done}/{uploadProgress.total}
          </p>
        )}
        {uploadError && (
          <p role="alert" className="text-xs text-red-700">
            {uploadError}
          </p>
        )}
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Bu projeye henüz galeri görseli eklenmedi.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="flex flex-col gap-2 border border-border p-3"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.image_url}
                  alt={image.alt_text ?? ""}
                  className="size-full object-cover"
                />
              </div>
              <Input
                defaultValue={image.alt_text ?? ""}
                placeholder="Alt metin (SEO ve erişilebilirlik için)"
                onBlur={(event) => handleAltTextBlur(image.id, event.target.value)}
                className="text-sm"
                aria-label="Görsel alt metni"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(image.id, "up")}
                    aria-label="Yukarı taşı"
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => handleMove(image.id, "down")}
                    aria-label="Aşağı taşı"
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  aria-label="Görseli sil"
                  className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-red-700"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
