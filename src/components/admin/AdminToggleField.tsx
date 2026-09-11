type AdminToggleFieldProps = {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
};

/**
 * Native (uncontrolled) checkbox — form `action` (Server Action) ile
 * gönderildiğinde `FormData` üzerinden otomatik okunur, ekstra client
 * state/handler gerekmez.
 */
export function AdminToggleField({
  name,
  label,
  description,
  defaultChecked,
}: AdminToggleFieldProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-border px-4 py-3 transition-colors hover:border-foreground/30">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-accent"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </span>
    </label>
  );
}
