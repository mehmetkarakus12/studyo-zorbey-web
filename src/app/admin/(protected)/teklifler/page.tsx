import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminStatusLegend } from "@/components/admin/AdminStatusLegend";
import { QuoteRequestsTable } from "@/components/admin/QuoteRequestsTable";
import { LEAD_STATUS_OPTIONS } from "@/lib/admin/lead-status";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Teklif Talepleri",
  robots: { index: false, follow: false },
};

export default async function AdminQuoteRequestsPage() {
  const supabase = await createClient();

  const [{ data: quoteRequests, error }, { data: services }] = await Promise.all([
    supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("services").select("id, title"),
  ]);

  const serviceTitles = new Map((services ?? []).map((service) => [service.id, service.title]));

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Teklif Talepleri"
        description="Web sitesinden gelen teklif taleplerini görüntüleyin ve takip edin."
      />

      <AdminStatusLegend items={LEAD_STATUS_OPTIONS} />

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Teklif talepleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : quoteRequests.length > 0 ? (
        <QuoteRequestsTable quoteRequests={quoteRequests} serviceTitles={serviceTitles} />
      ) : (
        <AdminEmptyState
          icon={ClipboardList}
          title="Henüz teklif talebi yok"
          description="Teklif Al formu aktif hale getirildiğinde, gelen talepler durum bilgisiyle birlikte burada listelenecek."
        />
      )}
    </div>
  );
}
