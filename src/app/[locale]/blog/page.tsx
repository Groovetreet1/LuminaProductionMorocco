import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le journal LUMINA — Blog",
  description: "Conseils, inspirations et l'envers du décor de notre atelier de bougies artisanales.",
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 pb-24 min-h-screen">
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">{t("blog.title")}</h1>
        <p className="text-muted max-w-xl mx-auto">{t("blog.subtitle")}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => {
          const title = locale === "ar" ? post.titleAr : post.titleFr;
          const excerpt = locale === "ar" ? post.excerptAr : post.excerptFr;
          const featured = i === 0;
          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`group border border-line rounded-3xl overflow-hidden bg-card/50 hover:border-gold/40 transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gold/10 ${
                featured ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={title}
                  className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-MA")}
                  </span>
                </div>
                <h2 className="font-display text-xl text-cream group-hover:text-gold transition-colors mb-2 leading-snug">
                  {title}
                </h2>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">{excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-gold mt-4 group-hover:gap-2.5 transition-all">
                  {t("blog.readMore")}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}