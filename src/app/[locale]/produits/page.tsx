import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/landing/ProductCard";
import { ProductsToolbar } from "@/components/products/ProductsToolbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique — LUMINA",
  description: "Bougies décoratives artisanales marocaines : cire de soja naturelle, parfums premium.",
};

const CATEGORIES = ["all", "signature", "luxe", "saison"];

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; sort?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const sp = await searchParams;

  const cat = CATEGORIES.includes(sp.cat ?? "") ? sp.cat! : "all";
  const sort = sp.sort ?? "newest";

  const products = await prisma.product.findMany({
    where: cat === "all" ? {} : { category: cat },
    orderBy: {
      ...(sort === "priceAsc" && { price: "asc" }),
      ...(sort === "priceDesc" && { price: "desc" }),
      ...(sort === "newest" && { createdAt: "desc" }),
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-24 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">{t("products.title")}</h1>
        <p className="text-muted max-w-xl mx-auto">{t("products.subtitle")}</p>
      </div>

      <ProductsToolbar currentCat={cat} currentSort={sort} />

      {products.length === 0 ? (
        <p className="text-center text-muted py-20">{t("products.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
