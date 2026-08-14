import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { saveProduct } from "../../actions";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function ProductFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;
  setRequestLocale(locale);

  const product = id
    ? await prisma.product.findUnique({ where: { id } })
    : null;

  const v = (key: string) =>
    product ? String((product as Record<string, unknown>)[key] ?? "") : "";

  const input = "field";
  const label = "block text-sm text-muted mb-1.5";
  const section = "border border-line rounded-2xl p-5 bg-card/40";

  return (
    <div className="max-w-3xl">
      <Link href="/admin/produits" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>
      <h1 className="font-display text-3xl text-cream mb-8">
        {product ? `Modifier : ${product.nameFr}` : "Nouveau produit"}
      </h1>

      <form action={saveProduct.bind(null, locale)} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={product?.id ?? ""} />

        <div className={section}>
          <h2 className="font-display text-lg text-cream mb-4">Identité</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Nom (FR) *</label>
              <input required className={input} name="nameFr" defaultValue={v("nameFr")} />
            </div>
            <div>
              <label className={label}>Nom (AR) *</label>
              <input required dir="rtl" className={input} name="nameAr" defaultValue={v("nameAr")} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Description (FR) *</label>
              <textarea required rows={3} className={input} name="descriptionFr" defaultValue={v("descriptionFr")} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Description (AR) *</label>
              <textarea required rows={3} dir="rtl" className={input} name="descriptionAr" defaultValue={v("descriptionAr")} />
            </div>
            <div>
              <label className={label}>Parfum (FR)</label>
              <input className={input} name="scentFr" defaultValue={v("scentFr")} />
            </div>
            <div>
              <label className={label}>Parfum (AR)</label>
              <input dir="rtl" className={input} name="scentAr" defaultValue={v("scentAr")} />
            </div>
          </div>
        </div>

        <div className={section}>
          <h2 className="font-display text-lg text-cream mb-4">Prix & stock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={label}>Prix (MAD) *</label>
              <input required type="number" step="0.01" className={input} name="price" defaultValue={v("price")} />
            </div>
            <div>
              <label className={label}>Ancien prix</label>
              <input type="number" step="0.01" className={input} name="compareAtPrice" defaultValue={v("compareAtPrice")} />
            </div>
            <div>
              <label className={label}>Stock</label>
              <input type="number" className={input} name="stock" defaultValue={v("stock") || "0"} />
            </div>
            <div>
              <label className={label}>Poids (g)</label>
              <input type="number" className={input} name="weightGr" defaultValue={v("weightGr") || "220"} />
            </div>
            <div>
              <label className={label}>Autonomie (h)</label>
              <input type="number" className={input} name="burnHours" defaultValue={v("burnHours") || "40"} />
            </div>
            <div>
              <label className={label}>Catégorie</label>
              <select className={`${input} cursor-pointer`} name="category" defaultValue={v("category") || "signature"}>
                <option value="signature" className="bg-card">signature</option>
                <option value="luxe" className="bg-card">luxe</option>
                <option value="saison" className="bg-card">saison</option>
              </select>
            </div>
            <div>
              <label className={label}>Couleur cire</label>
              <input type="color" className="field h-12 p-1 cursor-pointer" name="colorHex" defaultValue={v("colorHex") || "#f2e3c0"} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-cream cursor-pointer">
                <input type="checkbox" name="featured" defaultChecked={product?.featured} className="accent-gold w-4 h-4" />
                En vedette
              </label>
            </div>
          </div>
        </div>

        <div className={section}>
          <h2 className="font-display text-lg text-cream mb-4">Image</h2>
          <label className={label}>Chemin image (ou laissez vide pour générer automatiquement)</label>
          <input className={input} name="image" defaultValue={v("image")} placeholder={`/products/${v("slug") || "nom"}.svg`} />
          <p className="text-xs text-muted mt-2">
            Astuce : pour générer une image SVG automatique, laissez vide et utilisez un slug propre en anglais (ex: vanille-royale).
          </p>
        </div>

        <button
          type="submit"
          className="self-start px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
        >
          {product ? "Enregistrer les modifications" : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}
