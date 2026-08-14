"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, ShoppingCart, Package, Newspaper, MessageSquare, LogOut, Flame } from "lucide-react";

const items = [
  { href: "/admin", key: "admin.dashboard", icon: LayoutDashboard },
  { href: "/admin/commandes", key: "admin.orders", icon: ShoppingCart },
  { href: "/admin/produits", key: "admin.products", icon: Package },
  { href: "/admin/blog", key: "nav.blog", icon: Newspaper },
  { href: "/admin/messages", key: "admin.messages", icon: MessageSquare },
];

export default function AdminSidebar({ locale }: { locale: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin", { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-line bg-[#0d0b08] flex-col p-5">
        <Link href="/admin" className="flex items-center gap-2 mb-8 px-2">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center">
            <Flame className="w-5 h-5 text-background" />
          </span>
          <span className="font-display text-xl tracking-[0.2em] text-cream">LUMINA</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {items.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                  active ? "bg-gold/10 text-gold border border-gold/25" : "text-muted hover:text-cream hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-1 pt-4 border-t border-line">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-cream hover:bg-white/5">
            ← Voir le site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />
            {t("admin.logout")}
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed top-0 inset-x-0 z-40 glass border-b border-line flex items-center gap-1 px-3 py-2 overflow-x-auto">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              pathname === item.href ? "bg-gold/10 text-gold" : "text-muted"
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {t(item.key)}
          </Link>
        ))}
        <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 whitespace-nowrap">
          <LogOut className="w-3.5 h-3.5" />
          {t("admin.logout")}
        </button>
      </nav>
    </>
  );
}
