import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { CheckCircle2, Home } from "lucide-react";
import CopyOrderNumber from "@/components/checkout/CopyOrderNumber";

const STATUS_LABELS: Record<string, { fr: string; ar: string }> = {
  PENDING: { fr: "En attente", ar: "قيد الانتظار" },
  PAID: { fr: "Payée", ar: "مدفوعة" },
  CONFIRMED: { fr: "Confirmée", ar: "مؤكدة" },
  SHIPPED: { fr: "Expédiée", ar: "تم الشحن" },
  DELIVERED: { fr: "Livrée", ar: "تم التسليم" },
  CANCELLED: { fr: "Annulée", ar: "ملغاة" },
};

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; number: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { locale, number } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();

  const order = await prisma.order.findUnique({ where: { number } });
  if (!order) notFound();

  const isStripe = order.paymentMethod === "STRIPE";
  const paid = order.status === "PAID" || (isStripe && sp.success === "stripe");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-lg w-full border border-gold/25 rounded-[2rem] bg-card/50 p-10 text-center glow-gold">
        <span className="inline-flex w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">{t("orderSuccess.title")}</h1>
        <p className="text-muted leading-relaxed mb-8">
          {paid ? t("orderSuccess.cardMsg") : t("orderSuccess.codMsg")}
        </p>

        <div className="border border-line rounded-2xl divide-y divide-line mb-8 text-start">
          <div className="flex justify-between items-center px-5 py-3.5">
            <span className="text-muted text-sm">{t("orderSuccess.number")}</span>
            <CopyOrderNumber number={order.number} />
          </div>
          <div className="flex justify-between px-5 py-3.5">
            <span className="text-muted text-sm">{t("orderSuccess.total")}</span>
            <span className="text-cream font-semibold">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between px-5 py-3.5">
            <span className="text-muted text-sm">{t("orderSuccess.payment")}</span>
            <span className="text-cream font-semibold">{isStripe ? "Stripe" : "COD"}</span>
          </div>
          <div className="flex justify-between px-5 py-3.5">
            <span className="text-muted text-sm">{t("orderSuccess.status")}</span>
            <span className="text-emerald-400 font-semibold">
              {STATUS_LABELS[order.status]?.[locale as "fr" | "ar"] ?? order.status}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted mb-8">
          📋 Gardez votre numéro de commande — vous en aurez besoin pour suivre votre commande.{" "}
          <Link href="/suivi" className="text-gold underline underline-offset-2 hover:opacity-80 transition-opacity">
            Suivre ma commande
          </Link>
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          {t("orderSuccess.backHome")}
        </Link>
      </div>
    </div>
  );
}
