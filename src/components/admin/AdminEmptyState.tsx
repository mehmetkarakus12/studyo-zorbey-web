import type { LucideIcon } from "lucide-react";

type AdminEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

/**
 * Gerçek liste/tablo verisi gelene kadar (Faz 2.4+) her yönetim sayfasında
 * kullanılan tutarlı, profesyonel "boş durum" gösterimi.
 */
export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-border px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="font-display text-lg">{title}</p>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
