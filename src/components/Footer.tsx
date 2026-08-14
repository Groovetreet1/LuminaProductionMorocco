"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Flame, MapPin, Phone, Mail, Camera, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-[#0d0b08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center">
              <Flame className="w-5 h-5 text-background" />
            </span>
            <span className="font-display text-2xl tracking-[0.25em] text-cream">LUMINA</span>
          </div>
          <p className="text-sm text-muted max-w-sm leading-relaxed">{t("footer.tagline")}</p>
          <div className="flex gap-3 mt-6">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <Camera className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-cream mb-4">{t("footer.shop")}</h4>
          <div className="flex flex-col gap-2.5 text-sm text-muted">
            <Link href="/produits" className="hover:text-gold transition-colors">Bougies classiques</Link>
            <Link href="/produits?cat=luxe" className="hover:text-gold transition-colors">Collection luxe</Link>
            <Link href="/produits?cat=saison" className="hover:text-gold transition-colors">Collection saison</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-cream mb-4">{t("footer.contact")}</h4>
          <div className="flex flex-col gap-2.5 text-sm text-muted">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> Casablanca, Maroc</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> +212 6 00 00 00 00</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> hello@lumina.ma</span>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>© {year} LUMINA. {t("footer.rights")}</span>
          <span className="flex items-center gap-1.5">
            Vidéo par <a href="https://www.vecteezy.com/free-videos" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gold transition-colors">Vecteezy</a>
            <span>·</span>
            Fait avec <span className="text-gold">♥</span> au Maroc
          </span>
        </div>
      </div>
    </footer>
  );
}
