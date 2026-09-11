"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { PublicPortfolioCategory, PublicPortfolioProject } from "@/lib/data/portfolio";

type PortfolioGalleryProps = {
  categories: PublicPortfolioCategory[];
  projects: PublicPortfolioProject[];
  initialCategorySlug?: string;
};

const ALL_SLUG = "tumu";

/**
 * Kategori filtresi tamamen client-side'dır. URL'deki `kategori`
 * parametresi yalnızca başlangıç değeri için okunur — hizmet detay
 * sayfasından ("İlgili portfolyo") gelen derin bağlantıların doğru
 * sekmeyle açılması içindir.
 */
export function PortfolioGallery({
  categories,
  projects,
  initialCategorySlug,
}: PortfolioGalleryProps) {
  const tabs = useMemo(
    () => [{ id: null as string | null, slug: ALL_SLUG, label: "Tümü" }, ...categories.map((c) => ({ id: c.id, slug: c.slug, label: c.name }))],
    [categories],
  );

  const initial =
    initialCategorySlug && categories.some((c) => c.slug === initialCategorySlug)
      ? initialCategorySlug
      : ALL_SLUG;
  const [active, setActive] = useState(initial);

  const filtered = useMemo(() => {
    if (active === ALL_SLUG) return projects;
    const category = categories.find((c) => c.slug === active);
    if (!category) return projects;
    return projects.filter((project) => project.category_id === category.id);
  }, [active, projects, categories]);

  return (
    <Section spacing="tight">
      <Container>
        <div
          role="tablist"
          aria-label="Portfolyo kategori filtresi"
          className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-6"
        >
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={active === tab.slug}
              onClick={() => setActive(tab.slug)}
              className={cn(
                "relative pb-2 text-sm font-medium tracking-[0.02em] transition-colors",
                active === tab.slug
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {active === tab.slug && (
                <span aria-hidden className="absolute inset-x-0 -bottom-[1px] h-px bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {filtered.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolyo/${project.slug}`}
              className="group relative block overflow-hidden"
            >
              <DynamicMedia
                src={project.cover_image_url}
                alt={project.title}
                aspect="portrait"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {project.categoryName && (
                <Badge className="absolute top-4 left-4">{project.categoryName}</Badge>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                <p className="font-display text-base text-white">{project.title}</p>
                {project.location && <p className="text-xs text-white/70">{project.location}</p>}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-sm text-muted-foreground italic">
            Bu kategoride henüz proje eklenmedi.
          </p>
        )}
      </Container>
    </Section>
  );
}
