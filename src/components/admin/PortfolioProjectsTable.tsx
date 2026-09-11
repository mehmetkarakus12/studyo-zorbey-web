import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { DeletePortfolioProjectButton } from "@/components/admin/DeletePortfolioProjectButton";
import type { Tables } from "@/types/database";

type ProjectWithCategory = Tables<"portfolio_projects"> & {
  categoryName: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PortfolioProjectsTable({
  projects,
}: {
  projects: ProjectWithCategory[];
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Proje
            </th>
            <th scope="col" className="px-4 py-3">
              Kategori
            </th>
            <th scope="col" className="px-4 py-3">
              Slug
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
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-4 py-3 font-medium text-foreground">
                {project.title}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {project.categoryName ?? (
                  <span className="text-red-700">Kategori yok</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {project.slug}
              </td>
              <td className="px-4 py-3">
                <AdminBadge tone={project.is_active ? "success" : "neutral"}>
                  {project.is_active ? "Aktif" : "Pasif"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                {project.is_featured ? (
                  <AdminBadge tone="accent">Öne Çıkan</AdminBadge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {project.sort_order}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(project.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/portfolyo/${project.id}/duzenle`}
                    aria-label={`${project.title} projesini düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeletePortfolioProjectButton id={project.id} title={project.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
