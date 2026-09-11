import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Images, Newspaper, Inbox, Plus, Upload } from "lucide-react";
import { AdminSection } from "@/components/admin/AdminSection";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  contactMessageStatusLabel,
  contactMessageStatusTone,
  leadStatusLabel,
  leadStatusTone,
} from "@/lib/admin/lead-status";

export const metadata: Metadata = {
  title: "Genel Bakış",
  robots: {
    index: false,
    follow: false,
  },
};

const quickActions = [
  { label: "Yeni Hizmet", href: "/admin/hizmetler/yeni", icon: Plus },
  { label: "Yeni Portfolyo Projesi", href: "/admin/portfolyo/yeni", icon: Plus },
  { label: "Yeni Blog Yazısı", href: "/admin/blog/yeni", icon: Plus },
  { label: "Medya Yükle", href: "/admin/medya", icon: Upload },
];

type RecentLead = {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  createdAt: string;
  statusLabel: string;
  statusTone: "neutral" | "accent" | "warning" | "success" | "danger";
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDashboardPage() {
  const { profile } = await requireAdminSession();
  const firstName = (profile.full_name || "").split(" ")[0];

  const supabase = await createClient();
  const [
    { count: servicesCount },
    { count: portfolioCount },
    { count: blogCount },
    { count: newAppointmentsCount },
    { count: newQuotesCount },
    { count: newMessagesCount },
    { data: recentAppointments },
    { data: recentQuotes },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("portfolio_projects").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("quote_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("appointments")
      .select("id, full_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("quote_requests")
      .select("id, full_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("contact_messages")
      .select("id, full_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalNewLeads =
    (newAppointmentsCount ?? 0) + (newQuotesCount ?? 0) + (newMessagesCount ?? 0);
  const hasLeadCounts =
    newAppointmentsCount !== null && newQuotesCount !== null && newMessagesCount !== null;

  const statCards = [
    {
      label: "Hizmetler",
      icon: Camera,
      value: servicesCount === null ? "—" : String(servicesCount),
    },
    {
      label: "Portfolyo",
      icon: Images,
      value: portfolioCount === null ? "—" : String(portfolioCount),
    },
    {
      label: "Blog Yazıları",
      icon: Newspaper,
      value: blogCount === null ? "—" : String(blogCount),
    },
    {
      label: "Yeni Talepler",
      icon: Inbox,
      value: hasLeadCounts ? String(totalNewLeads) : "—",
    },
  ];

  const recentLeads: RecentLead[] = [
    ...(recentAppointments ?? []).map((item) => ({
      id: item.id,
      href: `/admin/randevular/${item.id}`,
      title: item.full_name,
      subtitle: "Randevu talebi",
      createdAt: item.created_at,
      statusLabel: leadStatusLabel(item.status),
      statusTone: leadStatusTone(item.status),
    })),
    ...(recentQuotes ?? []).map((item) => ({
      id: item.id,
      href: `/admin/teklifler/${item.id}`,
      title: item.full_name,
      subtitle: "Teklif talebi",
      createdAt: item.created_at,
      statusLabel: leadStatusLabel(item.status),
      statusTone: leadStatusTone(item.status),
    })),
    ...(recentMessages ?? []).map((item) => ({
      id: item.id,
      href: `/admin/mesajlar/${item.id}`,
      title: item.full_name,
      subtitle: "İletişim mesajı",
      createdAt: item.created_at,
      statusLabel: contactMessageStatusLabel(item.status),
      statusTone: contactMessageStatusTone(item.status),
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl leading-tight font-normal sm:text-3xl">
          Genel Bakış{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Stüdyo Zorbey web sitesini ve müşteri taleplerini buradan
          yönetebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <AdminStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <AdminSection
        title="Hızlı İşlemler"
        description="Bu kısayollar ilgili yönetim sayfasına götürür — henüz doğrudan oluşturma işlemi yapılmaz."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 border border-border bg-surface px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <action.icon className="size-4 shrink-0" aria-hidden />
              {action.label}
            </Link>
          ))}
        </div>
      </AdminSection>

      <AdminSection
        title="Son Müşteri Talepleri"
        description="Randevu, teklif ve iletişim mesajlarındaki en son talepler."
      >
        {recentLeads.length > 0 ? (
          <ul className="divide-y divide-border border border-border">
            {recentLeads.map((lead) => (
              <li key={`${lead.subtitle}-${lead.id}`}>
                <Link
                  href={lead.href}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{lead.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {lead.subtitle} · {formatDateTime(lead.createdAt)}
                    </span>
                  </div>
                  <AdminBadge tone={lead.statusTone}>{lead.statusLabel}</AdminBadge>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <AdminEmptyState
            icon={Inbox}
            title="Henüz görüntülenecek talep bulunmuyor."
            description="Web sitesindeki formlar aktif hale getirildiğinde, gelen talepler burada listelenecek."
          />
        )}
      </AdminSection>
    </div>
  );
}
