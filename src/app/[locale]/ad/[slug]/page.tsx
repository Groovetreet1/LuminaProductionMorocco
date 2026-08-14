import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import AdLanding from "@/components/ad/AdLanding";
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
  const name = locale === "ar" ? product.nameAr : product.nameFr;
  const price = product.price.toFixed(0);
  return {
    title: `${name} â€” Offre spÃ©ciale ${price} MAD | LUMINA`,
    description:
      locale === "ar"
        ? `${product.descriptionAr} Ø§Ø·Ù„Ø¨ Ø§Ù„Ø¢Ù† ÙˆØ§Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…. ØªÙˆØµÙŠÙ„ 24-48 Ø³Ø§Ø¹Ø©.`
        : `${product.descriptionFr} Commandez maintenant, payez Ã  la livraison. Livraison 24-48h partout au Maroc.`,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${name} â€” ${price} MAD`,
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
