import { setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — LUMINA",
  description: "Contactez LUMINA : commande spéciale, partenariat ou question sur nos bougies artisanales.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactForm />;
}