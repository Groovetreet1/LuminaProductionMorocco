"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

const CATS = [
  { value: "all", key: "products.all" },
  { value: "signature", key: "categories.signature" },
  { value: "luxe", key: "categories.luxe" },
  { value: "saison", key: "categories.saison" },
] as const;

const SORTS = [
  { value: "newest", key: "products.sortNewest" },
  { value: "priceAsc", key: "products.sortPriceAsc" },
  { value: "priceDesc", key: "products.sortPriceDesc" },
] as const;

export function ProductsToolbar({
  currentCat,
  currentSort,
}: {
  currentCat: string;
  currentSort: string;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const setFilter = (value: string, type: "cat" | "sort") => {
    const params = new URLSearchParams();
    if (type === "cat") {
      if (value !== "all") params.set("cat", value);
      if (currentSort !== "newest") params.set("sort", currentSort);
    } else {
      if (currentCat !== "all") params.set("cat", currentCat);
      if (value !== "newest") params.set("sort", value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {CATS.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value, "cat")}
            className={`px-5 py-2 rounded-full text-sm transition-all border ${
              currentCat === c.value
                ? "bg-gradient-to-r from-gold to-gold-light text-background font-semibold border-transparent"
                : "border-line text-muted hover:border-gold/40 hover:text-cream"
            }`}
          >
            {t(c.key)}
          </button>
        ))}
      </div>

      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => setFilter(e.target.value, "sort")}
          className="field appearance-none pr-10 cursor-pointer text-sm w-44"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-card">
              {t(s.key)}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
      </div>
    </div>
  );
}
