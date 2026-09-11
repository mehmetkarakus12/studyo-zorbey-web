import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { DeleteTestimonialButton } from "@/components/admin/DeleteTestimonialButton";
import type { Tables } from "@/types/database";

export function TestimonialsTable({
  testimonials,
}: {
  testimonials: Tables<"testimonials">[];
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Müşteri
            </th>
            <th scope="col" className="px-4 py-3">
              Çekim Türü
            </th>
            <th scope="col" className="px-4 py-3">
              Puan
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
            <th scope="col" className="px-4 py-3 text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {testimonials.map((testimonial) => (
            <tr key={testimonial.id}>
              <td className="px-4 py-3 font-medium text-foreground">
                {testimonial.customer_name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {testimonial.shooting_type ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {testimonial.rating ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-accent text-accent" aria-hidden />
                    {testimonial.rating}/5
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                <AdminBadge tone={testimonial.is_active ? "success" : "neutral"}>
                  {testimonial.is_active ? "Aktif" : "Pasif"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                {testimonial.is_featured ? (
                  <AdminBadge tone="accent">Öne Çıkan</AdminBadge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{testimonial.sort_order}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/yorumlar/${testimonial.id}/duzenle`}
                    aria-label={`${testimonial.customer_name} yorumunu düzenle`}
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeleteTestimonialButton
                    id={testimonial.id}
                    customerName={testimonial.customer_name}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
