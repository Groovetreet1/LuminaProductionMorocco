import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await isAuthenticated())) {
    redirect(`/${locale}/admin-login`);
  }

  return (
    <div className="min-h-screen bg-[#0b0a08] flex" dir="ltr">
      <AdminSidebar locale={locale} />
      <div className="flex-1 min-w-0 lg:ml-64 px-4 sm:px-8 pt-16 lg:pt-20 pb-16">{children}</div>
    </div>
  );
}
