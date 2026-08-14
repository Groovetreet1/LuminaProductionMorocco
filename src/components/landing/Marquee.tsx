import { useTranslations } from "next-intl";
import { Flame } from "lucide-react";

export default function Marquee() {
  const t = useTranslations();
  const items = t.raw("marquee") as string[];

  const row = (key: number) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-6 px-6 text-cream/60 font-display tracking-widest text-sm uppercase whitespace-nowrap">
          <Flame className="w-4 h-4 text-gold" />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden py-5 border-b border-line bg-gradient-to-r from-gold/10 via-transparent to-gold/10">
      <div className="flex w-max animate-marquee">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
