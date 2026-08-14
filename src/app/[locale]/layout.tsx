import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NavbarShell from "@/components/NavbarShell";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CandleCursor from "@/components/CandleCursor";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={locale === "ar" ? "rtl" : "ltr"}>
        <NavbarShell />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CandleCursor />
      </div>
    </NextIntlClientProvider>
  );
}
