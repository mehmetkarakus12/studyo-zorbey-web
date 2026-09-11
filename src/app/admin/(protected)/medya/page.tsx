import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MediaLibraryUploader } from "@/components/admin/MediaLibraryUploader";
import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Medya",
  robots: { index: false, follow: false },
};

const FOLDER_FILTER_OPTIONS = [
  { value: "", label: "Tüm klasörler" },
  { value: "general", label: "Genel" },
  { value: "services", label: "Hizmetler" },
  { value: "portfolio", label: "Portfolyo" },
  { value: "blog", label: "Blog" },
  { value: "video", label: "Video" },
];

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function AdminMediaPage(props: PageProps<"/admin/medya">) {
  const searchParams = await props.searchParams;
  const query = firstValue(searchParams.q).trim();
  const folder = firstValue(searchParams.folder).trim();

  const supabase = await createClient();
  let mediaQuery = supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    mediaQuery = mediaQuery.ilike("file_name", `%${query}%`);
  }
  if (folder) {
    mediaQuery = mediaQuery.eq("folder", folder);
  }

  const { data: media, error } = await mediaQuery;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Medya"
        description="Web sitesinde kullanılan fotoğraf ve dosyaları yönetin."
      />

      <MediaLibraryUploader />

      <form method="get" className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2 sm:w-64">
          <Input type="search" name="q" placeholder="Dosya adına göre ara" defaultValue={query} />
        </div>
        <div className="flex flex-col gap-2 sm:w-48">
          <Select name="folder" defaultValue={folder}>
            {FOLDER_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" variant="outline" size="sm">
          Filtrele
        </Button>
        {(query || folder) && (
          <Button href="/admin/medya" variant="ghost" size="sm">
            Temizle
          </Button>
        )}
      </form>

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Medya kütüphanesi yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : media.length > 0 ? (
        <MediaLibraryGrid items={media} />
      ) : (
        <AdminEmptyState
          icon={FolderOpen}
          title={query || folder ? "Eşleşen dosya bulunamadı" : "Henüz dosya yüklenmedi"}
          description={
            query || folder
              ? "Arama ya da filtre kriterlerinizle eşleşen bir dosya yok."
              : "Yukarıdan ilk fotoğrafınızı yükleyerek başlayın."
          }
        />
      )}
    </div>
  );
}
