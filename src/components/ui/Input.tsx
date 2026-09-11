import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full border-b border-border bg-transparent py-3 text-base text-foreground",
        "placeholder:text-muted-foreground/70",
        "transition-colors duration-200 focus-visible:border-accent focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
