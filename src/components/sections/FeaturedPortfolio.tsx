import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getFeaturedPortfolioProjects } from "@/lib/data/portfolio";
import { ctaLabels } from "@/config/site";

export async function FeaturedPortfolio() {
  const projects = await getFeaturedPortfolioProjects();

  if (projects.length === 0) return null;

  return (
    <Section tone="sunken">
      <Container>
        <SectionHeading
          eyebrow="Portfolyo"
          title="Öne Çıkan Düğün Hikâyeleri"
          description="Manisa'da çektiğimiz düğün hikâyelerinden seçkiler."
          action={
            <Button href="/portfolyo" variant="ghost" size="sm">
              {ctaLabels.viewAllPortfolio}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                aria-hidden
              />
            </Button>
          }
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {projects.map((project) => (
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
      </Container>
    </Section>
  );
}
