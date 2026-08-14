import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { savePost } from "../../actions";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function PostFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;
  setRequestLocale(locale);

  const post = id ? await prisma.blogPost.findUnique({ where: { id } }) : null;

  const v = (key: string) => (post ? String((post as Record<string, unknown>)[key] ?? "") : "");

  const input = "field";
  const label = "block text-sm text-muted mb-1.5";
  const section = "border border-line rounded-2xl p-5 bg-card/40";

  return (
    <div className="max-w-3xl">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>
      <h1 className="font-display text-3xl text-cream mb-8">
        {post ? `Modifier : ${post.titleFr}` : "Nouvel article"}
      </h1>

      <form action={savePost.bind(null, locale)} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={post?.id ?? ""} />

        <div className={section}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Titre (FR) *</label>
              <input required className={input} name="titleFr" defaultValue={v("titleFr")} />
            </div>
            <div>
              <label className={label}>Titre (AR) *</label>
              <input required dir="rtl" className={input} name="titleAr" defaultValue={v("titleAr")} />
            </div>
            <div>
              <label className={label}>Extrait (FR) *</label>
              <textarea required rows={2} className={input} name="excerptFr" defaultValue={v("excerptFr")} />
            </div>
            <div>
              <label className={label}>Extrait (AR) *</label>
              <textarea required rows={2} dir="rtl" className={input} name="excerptAr" defaultValue={v("excerptAr")} />
            </div>
          </div>
        </div>

        <div className={section}>
          <label className={label}>Contenu (FR) * — markdown simple (**titre**, - liste, paragraphes)</label>
          <textarea required rows={10} className={`${input} font-mono text-sm`} name="contentFr" defaultValue={v("contentFr")} />
          <label className={`${label} mt-4`}>Contenu (AR) *</label>
          <textarea required rows={10} dir="rtl" className={`${input} font-mono text-sm`} name="contentAr" defaultValue={v("contentAr")} />
        </div>

        <div className={section}>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>Image</label>
              <input className={input} name="image" defaultValue={v("image")} placeholder="/blog/mon-article.svg" />
            </div>
            <div>
              <label className={label}>Catégorie</label>
              <select className={`${input} cursor-pointer`} name="category" defaultValue={v("category") || "astuce"}>
                <option value="astuce" className="bg-card">astuce</option>
                <option value="guide" className="bg-card">guide</option>
                <option value="cadeau" className="bg-card">cadeau</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-cream cursor-pointer">
                <input type="checkbox" name="published" defaultChecked={post ? post.published : true} className="accent-gold w-4 h-4" />
                Publié
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="self-start px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
        >
          {post ? "Enregistrer les modifications" : "Publier l'article"}
        </button>
      </form>
    </div>
  );
}
