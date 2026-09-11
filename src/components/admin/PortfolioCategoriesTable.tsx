import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { DeletePortfolioCategoryButton } from "@/components/admin/DeletePortfolioCategoryButton";
import type { Tables } from "@/types/database";

type CategoryWithCount = Tables<"portfolio_categories"> & { projectCount: number };

export function PortfolioCategoriesTable({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
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
              Sıralama
            </th>
            <th scope="col" className="px-4 py-3">
              Proje Sayısı
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-4 py-3 font-medium text-foreground">
                {category.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {category.slug}
              </td>
              <td className="px-4 py-3">
                <AdminBadge tone={category.is_active ? "success" : "neutral"}>
                  {category.is_active ? "Aktif" : "Pasif"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {category.sort_order}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {category.projectCount}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/portfolyo/kategoriler/${category.id}/duzenle`}
                    aria-label={`${category.name} kategorisini düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeletePortfolioCategoryButton id={category.id} name={category.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
