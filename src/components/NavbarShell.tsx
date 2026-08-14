"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarShell() {
  const pathname = usePathname();
  if (pathname.includes("/admin")) return null;
  return <Navbar />;
}