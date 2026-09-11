import Link from "next/link";
import { Pencil, ImageIcon } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { DeleteBlogPostButton } from "@/components/admin/DeleteBlogPostButton";
import type { Tables } from "@/types/database";

type PostWithCategory = Tables<"blog_posts"> & { categoryName: string | null };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogPostsTable({ posts }: { posts: PostWithCategory[] }) {
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
              Yayın Tarihi
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
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-4 py-3">
                <div className="flex size-10 items-center justify-center overflow-hidden border border-border bg-muted">
                  {post.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt={`${post.title} kapak görseli`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-4 text-muted-foreground" aria-hidden />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{post.title}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {post.categoryName ?? <span className="text-muted-foreground">—</span>}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {post.slug}
              </td>
              <td className="px-4 py-3">
                <AdminBadge tone={post.status === "published" ? "success" : "neutral"}>
                  {post.status === "published" ? "Yayında" : "Taslak"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                {post.is_featured ? (
                  <AdminBadge tone="accent">Öne Çıkan</AdminBadge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(post.published_at)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(post.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/blog/${post.id}/duzenle`}
                    aria-label={`${post.title} yazısını düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeleteBlogPostButton id={post.id} title={post.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
