import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import Stats from "@/components/landing/Stats";
import Collection from "@/components/landing/Collection";
import Story from "@/components/landing/Story";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Gift from "@/components/landing/Gift";
import FAQ from "@/components/landing/FAQ";
import Newsletter from "@/components/landing/Newsletter";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LUMINA â€” Bougies dÃ©coratives artisanales",
  description:
    "Bougies dÃ©coratives artisanales faites Ã  la main au Maroc. Cire naturelle, parfums premium, design luxueux. Livraison partout au Maroc.",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Collection products={products} />
      <Story />
      <Features />
      <Testimonials />
      <Gift />
      <FAQ />
      <Newsletter />
    </>
  );
}
