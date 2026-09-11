import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  label: string;
  /** Henüz gerçek Supabase verisi çekilmiyor — her zaman "—" geçilir. */
  value: string;
  icon: LucideIcon;
};

export function AdminStatCard({ label, value, icon: Icon }: AdminStatCardProps) {
  return (
    <div className="flex items-center gap-4 border border-border bg-surface p-5">
      <span className="flex size-10 shrink-0 items-center justify-center bg-accent/10 text-accent">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex flex-col">
        <span className="font-display text-2xl leading-none">{value}</span>
        <span className="mt-1 text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
