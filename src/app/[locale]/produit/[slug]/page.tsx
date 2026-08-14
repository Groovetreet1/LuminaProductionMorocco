import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/products/ProductDetail";
import ProductCard from "@/components/landing/ProductCard";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${locale === "ar" ? product.nameAr : product.nameFr} â€” LUMINA`,
    description: locale === "ar" ? product.descriptionAr : product.descriptionFr,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { id: { not: product.id }, category: product.category },
    take: 4,
  });

  return (
    <div>
      <ProductDetail product={product} />

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
          <h2 className="font-display text-2xl md:text-3xl text-cream mb-8">{t("product.related")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
