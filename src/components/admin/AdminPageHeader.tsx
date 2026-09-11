type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl leading-tight font-normal sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
