import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-w-2xl flex-col gap-4",
          centered && "items-center",
        )}
      >
        {eyebrow && (
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {eyebrow}
          </span>
        )}
        <h2 className="text-balance font-display text-4xl leading-[1.08] font-normal sm:text-5xl lg:text-[3.25rem]">
          {title}
        </h2>
        {description && (
          <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {action && !centered && <div className="shrink-0">{action}</div>}
    </div>
  );
}
