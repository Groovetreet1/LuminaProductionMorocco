import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { Wallet, ShoppingCart, Clock, MessageSquare, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [orders, messages, pendingCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.total, 0);

  const stats = [
    { icon: Wallet, label: t("admin.revenue"), value: formatPrice(revenue), accent: "text-gold" },
    { icon: ShoppingCart, label: t("admin.totalOrders"), value: String(orders.length), accent: "text-cream" },
    { icon: Clock, label: t("admin.pendingOrders"), value: String(pendingCount), accent: "text-amber-400" },
    { icon: MessageSquare, label: t("admin.messagesCount"), value: String(messages), accent: "text-emerald-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">{t("admin.dashboard")}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="border border-line rounded-2xl p-5 bg-card/50">
            <s.icon className={`w-5 h-5 ${s.accent} mb-3`} />
            <p className={`font-display text-2xl ${s.accent}`}>{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="border border-line rounded-3xl bg-card/40 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display text-lg text-cream">Commandes récentes</h2>
          <Link href="/admin/commandes" className="flex items-center gap-1 text-sm text-gold hover:gap-2 transition-all">
            Tout voir <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wider">
                <th className="text-start px-6 py-3">N°</th>
                <th className="text-start px-6 py-3">Client</th>
                <th className="text-start px-6 py-3">Ville</th>
                <th className="text-start px-6 py-3">Total</th>
                <th className="text-start px-6 py-3">Paiement</th>
                <th className="text-start px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="px-6 py-3 font-mono text-gold">{o.number}</td>
                  <td className="px-6 py-3 text-cream">{o.customerName}</td>
                  <td className="px-6 py-3 text-muted">{o.city}</td>
                  <td className="px-6 py-3 text-cream font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-6 py-3 text-muted">{o.paymentMethod}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs ${
                        o.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400"
                          : o.status === "CANCELLED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted">
                    Aucune commande pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
