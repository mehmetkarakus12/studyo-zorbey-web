import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { Button } from "@/components/ui/Button";
import { getFeaturedBlogPosts } from "@/lib/data/blog";
import { ctaLabels } from "@/config/site";

export async function BlogPreview() {
  const posts = await getFeaturedBlogPosts(3);

  if (posts.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Rehber ve İlham"
          description="Çekim öncesi hazırlık, lokasyon önerileri ve planlama üzerine yazılarımız."
          action={
            <Button href="/blog" variant="ghost" size="sm">
              Tüm Yazılar
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                aria-hidden
              />
            </Button>
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-4"
            >
              <div className="overflow-hidden">
                <DynamicMedia
                  src={post.cover_image_url}
                  alt={post.title}
                  aspect="portrait"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                {post.categoryName && (
                  <span className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                    {post.categoryName}
                  </span>
                )}
                <h3 className="font-display text-lg leading-snug sm:text-xl">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-1 text-xs font-semibold tracking-[0.1em] text-foreground uppercase">
                  {ctaLabels.readArticle} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
