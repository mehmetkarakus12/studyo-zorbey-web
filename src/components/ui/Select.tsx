import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none border-b border-border bg-transparent py-3 pr-8 text-base text-foreground",
          "transition-colors duration-200 focus-visible:border-accent focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}
