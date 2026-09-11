"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  SITE_MEDIA_BUCKET,
  buildSafeStoragePath,
  validateImageFile,
  type MediaFolder,
} from "@/lib/admin/media-upload";
import { createMediaAction } from "@/app/admin/(protected)/medya/actions";

const FOLDER_OPTIONS: { value: MediaFolder; label: string }[] = [
  { value: "general", label: "Genel" },
  { value: "services", label: "Hizmetler" },
  { value: "portfolio", label: "Portfolyo" },
  { value: "blog", label: "Blog" },
  { value: "video", label: "Video" },
];

function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    image.src = objectUrl;
  });
}

export function MediaLibraryUploader() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState<MediaFolder>("general");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  async function handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError(null);
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    const supabase = createClient();

    for (const file of files) {
      const path = buildSafeStoragePath(folder, file);
      const { error: uploadError } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError(`"${file.name}" yüklenirken bir hata oluştu.`);
        setProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : null));
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .getPublicUrl(path);

      const dimensions = await readImageDimensions(file);

      const result = await createMediaAction({
        file_name: file.name,
        file_path: path,
        public_url: publicUrlData.publicUrl,
        mime_type: file.type,
        file_size: file.size,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
        folder,
      });

      if (result.error) {
        setError(result.error);
        await supabase.storage
          .from(SITE_MEDIA_BUCKET)
          .remove([path])
          .catch(() => {});
      }

      setProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : null));
    }

    setUploading(false);
    setProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      handleFiles(event.target.files);
    }
  }

  return (
    <div className="flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2 sm:w-56">
        <Label htmlFor="media-upload-folder">Klasör</Label>
        <Select
          id="media-upload-folder"
          value={folder}
          onChange={(event) => setFolder(event.target.value as MediaFolder)}
        >
          {FOLDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col items-start gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
          onChange={handleInputChange}
          className="sr-only"
          id="media-upload-input"
        />
        <Button
          type="button"
          size="sm"
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="size-4" aria-hidden />
          Dosya Yükle
        </Button>
        {progress && (
          <p className="text-xs text-muted-foreground">
            Yükleniyor: {progress.done}/{progress.total}
          </p>
        )}
        {error && (
          <p role="alert" className="text-xs text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
