import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  tone?: "default" | "sunken" | "dark";
  spacing?: "default" | "tight" | "none";
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-background text-foreground",
  sunken: "bg-surface-sunken text-foreground",
  dark: "bg-secondary text-secondary-foreground",
};

const spacingClasses: Record<NonNullable<SectionProps["spacing"]>, string> = {
  default: "py-20 sm:py-28 lg:py-32",
  tight: "py-12 sm:py-16 lg:py-20",
  none: "",
};

export function Section({
  tone = "default",
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(toneClasses[tone], spacingClasses[spacing], className)}
      {...props}
    />
  );
}
