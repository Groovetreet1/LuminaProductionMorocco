"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/store/cart";
import { Flame, Menu, ShoppingBag, X, Globe, PackageSearch } from "lucide-react";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/produits", key: "nav.products" },
  { href: "/blog", key: "nav.blog" },
  { href: "/contact", key: "nav.contact" },
];

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const { items, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const isAdPage = pathname.startsWith("/ad");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2 group min-w-0">
          <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 text-background" />
          </span>
          <span className="font-display text-lg sm:text-xl md:text-2xl tracking-[0.18em] sm:tracking-[0.25em] text-cream">
            LUMINA
          </span>
        </Link>

        {isAdPage ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gold font-semibold animate-pulse">
              🔥 {t("ad.strip")}
            </span>
            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label={t("nav.cart")}
            >
              <ShoppingBag className="w-5 h-5 text-cream" />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold text-background text-[11px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        ) : (
          <>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-gold ${
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-gold"
                  : "text-cream/80"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            href="/suivi"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/50 bg-gold/10 text-gold text-sm font-semibold hover:bg-gold/20 transition-colors"
          >
            <PackageSearch className="w-4 h-4" />
            {t("nav.tracking")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href={pathname.replace(/^\/(fr|ar)/, "")}
            locale="fr"
            className="flex items-center gap-1 text-xs text-cream/70 hover:text-gold transition-colors"
            title="Français"
          >
            <Globe className="w-4 h-4" /> FR
          </Link>
          <span className="text-cream/20">|</span>
          <Link
            href={pathname.replace(/^\/(fr|ar)/, "")}
            locale="ar"
            className="text-xs text-cream/70 hover:text-gold transition-colors"
            title="العربية"
          >
            AR
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label={t("nav.cart")}
          >
            <ShoppingBag className="w-5 h-5 text-cream" />
            {mounted && count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold text-background text-[11px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-full hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6 text-cream" /> : <Menu className="w-6 h-6 text-cream" />}
          </button>
        </div>
        </>
        )}
      </div>

      {!isAdPage && mobileOpen && (
        <div className="md:hidden glass border-t border-line">
          <nav className="px-6 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm tracking-wide ${
                  pathname === link.href ? "text-gold" : "text-cream/80"
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
            <Link
              href="/suivi"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 text-sm text-gold font-semibold"
            >
              <PackageSearch className="w-4 h-4" /> {t("nav.tracking")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
