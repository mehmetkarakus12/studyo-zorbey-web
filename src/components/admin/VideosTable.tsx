import Link from "next/link";
import { Pencil, ImageIcon, ExternalLink } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { DeleteVideoButton } from "@/components/admin/DeleteVideoButton";
import type { Tables } from "@/types/database";

const VIDEO_TYPE_LABELS: Record<string, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  mp4: "MP4",
  other: "Diğer",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function VideosTable({ videos }: { videos: Tables<"videos">[] }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Kapak
            </th>
            <th scope="col" className="px-4 py-3">
              Başlık
            </th>
            <th scope="col" className="px-4 py-3">
              Tür
            </th>
            <th scope="col" className="px-4 py-3">
              Video URL
            </th>
            <th scope="col" className="px-4 py-3">
              Durum
            </th>
            <th scope="col" className="px-4 py-3">
              Öne Çıkan
            </th>
            <th scope="col" className="px-4 py-3">
              Sıralama
            </th>
            <th scope="col" className="px-4 py-3">
              Son Güncelleme
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {videos.map((video) => (
            <tr key={video.id}>
              <td className="px-4 py-3">
                <div className="flex size-10 items-center justify-center overflow-hidden border border-border bg-muted">
                  {video.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnail_url}
                      alt={`${video.title} kapak görseli`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-4 text-muted-foreground" aria-hidden />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{video.title}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {VIDEO_TYPE_LABELS[video.video_type] ?? video.video_type}
              </td>
              <td className="px-4 py-3">
                <a
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-56 items-center gap-1 truncate text-accent hover:underline"
                >
                  <span className="truncate">{video.video_url}</span>
                  <ExternalLink className="size-3 shrink-0" aria-hidden />
                </a>
              </td>
              <td className="px-4 py-3">
                <AdminBadge tone={video.is_active ? "success" : "neutral"}>
                  {video.is_active ? "Aktif" : "Pasif"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                {video.is_featured ? (
                  <AdminBadge tone="accent">Öne Çıkan</AdminBadge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{video.sort_order}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(video.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/videolar/${video.id}/duzenle`}
                    aria-label={`${video.title} videosunu düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeleteVideoButton id={video.id} title={video.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
