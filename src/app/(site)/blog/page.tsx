import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { PageHero } from "@/components/sections/PageHero";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { ctaLabels } from "@/config/site";
import { buildPageMetadata } from "@/lib/data/seo-settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "blog",
    path: "/blog",
    fallbackTitle: "Blog",
    fallbackDescription:
      "Fotoğraf, düğün hazırlığı, çekim önerileri ve Stüdyo Zorbey rehberleri.",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const [featured, ...rest] = posts;
  const featuredDate = featured ? (featured.published_at ?? featured.created_at) : null;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Rehber ve İlham"
        description="Fotoğraf, düğün hazırlığı, çekim önerileri ve Stüdyo Zorbey rehberleri."
      />

      {!featured ? (
        <Section spacing="tight">
          <Container>
            <p className="text-sm text-muted-foreground italic">
              Henüz yayınlanmış bir yazı yok — yakında burada yer alacak.
            </p>
          </Container>
        </Section>
      ) : (
        <>
          <Section spacing="tight">
            <Container>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-14"
              >
                <div className="overflow-hidden">
                  <DynamicMedia
                    src={featured.cover_image_url}
                    alt={featured.title}
                    aspect="landscape"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                    {[featured.categoryName, featuredDate && formatDate(featuredDate)]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  <h2 className="text-balance font-display text-3xl leading-[1.15] font-normal sm:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-pretty leading-relaxed text-muted-foreground sm:text-lg">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="mt-1 text-xs font-semibold tracking-[0.1em] text-foreground uppercase">
                    {ctaLabels.readArticle} →
                  </span>
                </div>
              </Link>
            </Container>
          </Section>

          {rest.length > 0 && (
            <Section spacing="tight">
              <Container>
                <div className="grid grid-cols-1 gap-10 border-t border-border pt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {rest.map((post) => {
                    const postDate = post.published_at ?? post.created_at;
                    return (
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
                            sizes="(min-width: 1024px) 33vw, 50vw"
                            className="transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                            {[post.categoryName, formatDate(postDate)]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                          <h3 className="font-display text-lg leading-snug sm:text-xl">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Container>
            </Section>
          )}
        </>
      )}
    </>
  );
}
