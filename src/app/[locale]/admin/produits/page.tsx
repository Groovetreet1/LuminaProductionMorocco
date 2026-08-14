import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { deleteProduct } from "../actions";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-cream">{t("admin.products")}</h1>
        <Link
          href="/admin/produits/form"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold text-sm"
        >
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      <div className="border border-line rounded-3xl bg-card/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wider">
                <th className="text-start px-6 py-3">Produit</th>
                <th className="text-start px-6 py-3">Prix</th>
                <th className="text-start px-6 py-3">Stock</th>
                <th className="text-start px-6 py-3">Catégorie</th>
                <th className="text-start px-6 py-3">En vedette</th>
                <th className="text-end px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.nameFr} className="w-12 h-14 rounded-lg object-cover border border-line" />
                      <div>
                        <p className="text-cream font-medium">{p.nameFr}</p>
                        <p className="text-xs text-muted">{p.nameAr}</p>
                        <a
                          href={`/fr/ad/${p.slug}`}
                          target="_blank"
                          className="text-[11px] text-gold hover:underline inline-flex items-center gap-1"
                        >
                          <Megaphone className="w-3 h-3" /> /ad/{p.slug}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-gold font-semibold">{formatPrice(p.price)}</p>
                    {p.compareAtPrice && <p className="text-xs text-muted line-through">{formatPrice(p.compareAtPrice)}</p>}
                  </td>
                  <td className="px-6 py-3">
                    <span className={p.stock <= 5 ? "text-red-400" : "text-emerald-400"}>{p.stock}</span>
                  </td>
                  <td className="px-6 py-3 text-muted">{p.category}</td>
                  <td className="px-6 py-3">{p.featured ? "⭐" : "—"}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produits/form?id=${p.id}`}
                        className="p-2 rounded-full text-muted hover:text-gold hover:bg-gold/10 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form action={deleteProduct.bind(null, locale, p.id)}>
                        <button className="p-2 rounded-full text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted">Aucun produit</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
