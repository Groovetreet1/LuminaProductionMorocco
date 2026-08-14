import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { updateOrderStatus, deleteOrder } from "../actions";
import { Trash2 } from "lucide-react";
import ExportButton from "@/components/admin/ExportButton";

const STATUSES = ["PENDING", "PAID", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-cream">{t("admin.orders")}</h1>
        <ExportButton />
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((o) => (
          <div key={o.id} className="border border-line rounded-2xl bg-card/40 p-5">
            <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
              <div>
                <span className="font-mono text-gold font-bold">{o.number}</span>
                <span className="text-xs text-muted ml-3">
                  {new Date(o.createdAt).toLocaleString("fr-MA")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <form action={updateOrderStatus.bind(null, locale)} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="status" defaultValue={o.status} className="field !py-2 text-sm cursor-pointer">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm hover:bg-gold/20 transition-colors">
                    OK
                  </button>
                </form>
                <form action={deleteOrder.bind(null, locale, o.id)}>
                  <button className="p-2 rounded-full text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
              <div className="border border-line rounded-xl px-4 py-2.5">
                <p className="text-xs text-muted">Client</p>
                <p className="text-cream">{o.customerName}</p>
                <p className="text-xs text-muted">{o.phone}</p>
              </div>
              <div className="border border-line rounded-xl px-4 py-2.5">
                <p className="text-xs text-muted">Adresse</p>
                <p className="text-cream">{o.city}</p>
                <p className="text-xs text-muted">{o.address}</p>
              </div>
              <div className="border border-line rounded-xl px-4 py-2.5">
                <p className="text-xs text-muted">Paiement</p>
                <p className="text-cream">{o.paymentMethod}</p>
                {o.email && <p className="text-xs text-muted truncate">{o.email}</p>}
              </div>
              <div className="border border-line rounded-xl px-4 py-2.5">
                <p className="text-xs text-muted">Total</p>
                <p className="text-gold font-bold">{formatPrice(o.total)}</p>
                <p className="text-xs text-muted">{o.items.length} article(s)</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {o.items.map((item) => (
                <span key={item.id} className="text-xs bg-white/5 border border-line rounded-full px-3 py-1 text-muted">
                  {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                </span>
              ))}
            </div>

            {o.notes && (
              <p className="text-xs text-muted mt-3 bg-white/5 rounded-xl px-4 py-2">
                📝 {o.notes}
              </p>
            )}

            {(o.utmSource || o.utmCampaign || o.utmMedium || o.utmContent) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {o.utmSource && (
                  <span className="text-[11px] bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-full px-2.5 py-0.5">
                    📱 {o.utmSource}
                  </span>
                )}
                {o.utmCampaign && (
                  <span className="text-[11px] bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-full px-2.5 py-0.5">
                    🎯 {o.utmCampaign}
                  </span>
                )}
                {o.utmContent && (
                  <span className="text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full px-2.5 py-0.5">
                    📄 {o.utmContent}
                  </span>
                )}
                {o.utmMedium && (
                  <span className="text-[11px] bg-white/5 border border-line text-muted rounded-full px-2.5 py-0.5">
                    {o.utmMedium}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-muted py-20">Aucune commande</p>
        )}
      </div>
    </div>
  );
}
