import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  size?: "default" | "narrow" | "wide";
};

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  wide: "max-w-[100rem]",
};

export function Container({
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
