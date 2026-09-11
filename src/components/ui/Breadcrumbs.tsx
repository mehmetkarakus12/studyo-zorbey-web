import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/**
 * Sadece detay sayfalarında (hizmet/portfolyo/blog) kullanılan sade
 * breadcrumb. Son öğe her zaman geçerli sayfadır ve link değildir
 * (`aria-current="page"`). JSON-LD (BreadcrumbList) ayrıca ilgili sayfada
 * `buildBreadcrumbSchema` ile eklenir — bu bileşen yalnızca görünür UI'dır.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border bg-background", className)}>
      <Container>
        <nav aria-label="Breadcrumb" className="py-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <li key={item.label} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight
                      className="size-3.5 text-muted-foreground/50"
                      aria-hidden
                    />
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? "page" : undefined}
                      className={isLast ? "text-foreground" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </div>
  );
}
