import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DynamicMedia } from "@/components/ui/DynamicMedia";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DetailHero } from "@/components/sections/DetailHero";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
  getRelatedBlogPosts,
  splitBlogParagraphs,
} from "@/lib/data/blog";
import { ctaLabels } from "@/config/site";
import { buildBlogPostingSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/data/seo-settings";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    pageKey: `blog/${slug}`,
    path: `/blog/${slug}`,
    fallbackTitle: post.seo_title || post.title,
    fallbackDescription: post.seo_description || post.excerpt || "",
    fallbackImage: post.cover_image_url,
    type: "article",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post, 2);
  const paragraphs = splitBlogParagraphs(post.content);
  const postDate = post.published_at ?? post.created_at;

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <>
      <JsonLd
        data={buildBlogPostingSchema({
          title: post.title,
          excerpt: post.excerpt ?? "",
          slug: post.slug,
          publishedAt: postDate,
          imageUrl: post.cover_image_url ?? undefined,
        })}
      />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />

      <DetailHero
        src={post.cover_image_url}
        alt={post.title}
        eyebrow={post.categoryName ?? "Blog"}
        title={post.title}
        meta={formatDate(postDate)}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <Section spacing="tight">
        <Container size="narrow">
          <article className="flex flex-col gap-6">
            {post.excerpt && (
              <p className="text-pretty text-lg leading-relaxed text-foreground/80 italic">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-col gap-6">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-pretty text-base leading-relaxed whitespace-pre-line text-muted-foreground sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="sunken">
          <Container>
            <h2 className="font-display text-2xl sm:text-3xl">İlgili Yazılar</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col gap-4"
                >
                  <div className="overflow-hidden">
                    <DynamicMedia
                      src={item.cover_image_url}
                      alt={item.title}
                      aspect="portrait"
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.categoryName && (
                      <span className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                        {item.categoryName}
                      </span>
                    )}
                    <h3 className="font-display text-lg leading-snug sm:text-xl">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="tight">
        <Container size="narrow">
          <div className="flex flex-col items-start gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-pretty text-base text-muted-foreground sm:text-lg">
              Çekiminiz için hazır mısınız?
            </p>
            <Button href="/randevu-al">{ctaLabels.bookAppointment}</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
