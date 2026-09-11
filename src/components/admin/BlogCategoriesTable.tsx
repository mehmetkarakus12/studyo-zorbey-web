import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteBlogCategoryButton } from "@/components/admin/DeleteBlogCategoryButton";
import type { Tables } from "@/types/database";

type CategoryWithCount = Tables<"blog_categories"> & { postCount: number };

export function BlogCategoriesTable({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Kategori
            </th>
            <th scope="col" className="px-4 py-3">
              Slug
            </th>
            <th scope="col" className="px-4 py-3">
              Yazı Sayısı
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
              <td className="px-4 py-3 text-muted-foreground">{category.postCount}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/blog/kategoriler/${category.id}/duzenle`}
                    aria-label={`${category.name} kategorisini düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeleteBlogCategoryButton id={category.id} name={category.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
