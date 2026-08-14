import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (await isAuthenticated()) {
    redirect(`/${locale}/admin`);
  }
  return <AdminLogin />;
}
