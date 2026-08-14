import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { deletePost } from "../actions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default async function AdminBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-cream">Articles de blog</h1>
        <Link
          href="/admin/blog/form"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold text-sm"
        >
          <Plus className="w-4 h-4" /> Nouvel article
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((p) => (
          <div key={p.id} className="border border-line rounded-2xl bg-card/40 p-4 flex items-center gap-4">
            <img src={p.image} alt={p.titleFr} className="w-20 h-14 rounded-lg object-cover border border-line" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-cream font-medium truncate">{p.titleFr}</p>
                {!p.published && (
                  <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Brouillon</span>
                )}
              </div>
              <p className="text-xs text-muted truncate">{p.titleAr}</p>
              <p className="text-xs text-muted mt-1">
                {new Date(p.createdAt).toLocaleDateString("fr-MA")} · {p.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/blog/form?id=${p.id}`}
                className="p-2 rounded-full text-muted hover:text-gold hover:bg-gold/10 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <form action={deletePost.bind(null, locale, p.id)}>
                <button className="p-2 rounded-full text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ))}

        {posts.length === 0 && <p className="text-center text-muted py-20">Aucun article</p>}
      </div>
    </div>
  );
}
