import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteSeoSettingButton } from "@/components/admin/DeleteSeoSettingButton";
import type { Tables } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SeoSettingsTable({ settings }: { settings: Tables<"seo_settings">[] }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Sayfa Anahtarı
            </th>
            <th scope="col" className="px-4 py-3">
              Sayfa Başlığı
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
          {settings.map((setting) => (
            <tr key={setting.id}>
              <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">
                {setting.page_key}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {setting.meta_title ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(setting.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/seo/${setting.id}/duzenle`}
                    aria-label={`${setting.page_key} SEO ayarını düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeleteSeoSettingButton id={setting.id} pageKey={setting.page_key} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
