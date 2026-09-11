import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: "default" | "inverse";
};

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
        tone === "default" &&
          "border-border bg-surface/95 text-foreground backdrop-blur-sm",
        tone === "inverse" &&
          "border-white/35 bg-black/20 text-white backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
