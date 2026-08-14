import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import AdLanding from "@/components/ad/AdLanding";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  const name = locale === "ar" ? product.nameAr : product.nameFr;
  const price = product.price.toFixed(0);
  return {
    title: `${name} — Offre spéciale ${price} MAD | LUMINA`,
    description:
      locale === "ar"
        ? `${product.descriptionAr} اطلب الآن وادفع عند الاستلام. توصيل 24-48 ساعة.`
        : `${product.descriptionFr} Commandez maintenant, payez à la livraison. Livraison 24-48h partout au Maroc.`,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${name} — ${price} MAD`,
      description: product.descriptionFr,
      images: [{ url: product.image }],
    },
  };
}

export default async function AdPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  return <AdLanding product={product} />;
}