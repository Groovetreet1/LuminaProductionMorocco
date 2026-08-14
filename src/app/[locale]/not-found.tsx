"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-display text-8xl text-gradient-gold">404</p>
      <h1 className="font-display text-3xl text-cream">{t("notFound.title")}</h1>
      <p className="text-muted max-w-md">{t("notFound.subtitle")}</p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
      >
        {t("notFound.cta")}
      </Link>
    </div>
  );
}