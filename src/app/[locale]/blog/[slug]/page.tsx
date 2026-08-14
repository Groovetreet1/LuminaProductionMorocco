import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: `${locale === "ar" ? post.titleAr : post.titleFr} â€” LUMINA`,
  };
}

function renderContent(content: string) {
  const blocks = content.split("\n\n");
  return blocks.map((block, i) => {
    if (block.startsWith("**")) {
      const [title, ...rest] = block.split("\n");
      const cleanTitle = title.replace(/\*\*/g, "");
      return (
        <div key={i}>
          <h2 className="font-display text-2xl text-cream mt-8 mb-3">{cleanTitle}</h2>
          {rest.length > 0 && <p className="text-muted leading-relaxed mb-4">{rest.join("\n")}</p>}
        </div>
      );
    }
    if (block.startsWith("- ")) {
      return (
        <ul key={i} className="flex flex-col gap-2 my-4">
          {block.split("\n").map((line, j) => (
            <li key={j} className="text-muted leading-relaxed flex gap-2">
              <span className="text-gold mt-2">â€¢</span>
              {line.replace(/^- /, "")}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-muted leading-relaxed mb-4">
        {block}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const related = await prisma.blogPost.findMany({
    where: { id: { not: post.id }, published: true },
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  const title = locale === "ar" ? post.titleAr : post.titleFr;
  const excerpt = locale === "ar" ? post.excerptAr : post.excerptFr;
  const content = locale === "ar" ? post.contentAr : post.contentFr;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-32 pb-24 min-h-screen">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {t("blog.back")}
      </Link>

      <article>
        <div className="flex items-center gap-3 text-xs text-muted mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-MA")}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl text-cream leading-tight mb-6">{title}</h1>
        <p className="text-lg text-gold/80 font-display italic mb-10">{excerpt}</p>

        <div className="rounded-3xl overflow-hidden border border-line mb-10">
          <img src={post.image} alt={title} className="w-full aspect-[16/9] object-cover" />
        </div>

        <div className="text-base">{renderContent(content)}</div>
      </article>

      {related.length > 0 && (
        <div className="border-t border-line mt-16 pt-10">
          <h2 className="font-display text-2xl text-cream mb-6">{t("blog.related")}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group border border-line rounded-2xl overflow-hidden bg-card/50 hover:border-gold/40 transition-all hover:-translate-y-1"
              >
                <img src={p.image} alt={locale === "ar" ? p.titleAr : p.titleFr} className="w-full aspect-[16/9] object-cover" />
                <div className="p-4">
                  <h3 className="font-display text-lg text-cream group-hover:text-gold transition-colors">
                    {locale === "ar" ? p.titleAr : p.titleFr}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
