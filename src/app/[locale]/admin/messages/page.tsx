import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { markMessageRead } from "../actions";
import { Mail, Phone, MessageSquare } from "lucide-react";
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">{t("admin.messages")}</h1>

      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`border rounded-2xl p-5 ${
              m.read ? "border-line bg-card/30 opacity-70" : "border-gold/40 bg-card/60"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-gold" />
                </span>
                <div>
                  <p className="text-cream font-semibold">
                    {m.name}
                    {!m.read && (
                      <span className="ml-2 text-xs bg-gold/15 text-gold px-2 py-0.5 rounded-full">Non lu</span>
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(m.createdAt).toLocaleString("fr-MA")} Â· {m.subject || "Sans sujet"}
                  </p>
                </div>
              </div>
              <form action={markMessageRead.bind(null, locale, m.id, !m.read)}>
                <button className="text-xs px-4 py-2 rounded-full border border-line text-muted hover:border-gold/40 hover:text-gold transition-colors">
                  {m.read ? "Marquer non lu" : "Marquer lu"}
                </button>
              </form>
            </div>
            <p className="text-muted text-sm leading-relaxed mb-3">{m.message}</p>
            <div className="flex gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gold" /> {m.email}
              </span>
              {m.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gold" /> {m.phone}
                </span>
              )}
            </div>
          </div>
        ))}

        {messages.length === 0 && <p className="text-center text-muted py-20">Aucun message</p>}
      </div>
    </div>
  );
}
