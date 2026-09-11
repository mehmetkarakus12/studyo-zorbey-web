type AdminSectionProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

/** Dashboard ve yönetim sayfalarındaki içerik bloklarını başlıklandırır. */
export function AdminSection({
  title,
  description,
  action,
  children,
}: AdminSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
