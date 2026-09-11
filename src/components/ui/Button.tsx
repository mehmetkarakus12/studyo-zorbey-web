import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
        outline:
          "border border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground/[0.04]",
        "outline-inverse":
          "border border-white/45 text-white hover:border-white hover:bg-white/10",
        ghost: "text-foreground hover:text-accent",
      },
      size: {
        default: "h-13 px-7",
        sm: "h-10 px-5",
        lg: "h-14 px-9 text-[0.8rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  loading?: boolean;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as Omit<ButtonAsButton, keyof ButtonBaseProps>;

  return (
    <button
      className={classes}
      disabled={loading || buttonProps.disabled}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
