"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { isAuthenticated } from "@/lib/auth";

async function guard() {
  if (!(await isAuthenticated())) {
    redirect("/admin-login");
  }
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function num(formData: FormData, key: string, fallback = 0) {
  const v = parseFloat(String(formData.get(key) ?? ""));
  return isNaN(v) ? fallback : v;
}

export async function saveProduct(locale: string, formData: FormData) {
  await guard();

  const id = text(formData, "id");
  const slug = slugify(text(formData, "nameFr")) || `produit-${Date.now()}`;
  const data = {
    slug,
    nameFr: text(formData, "nameFr"),
    nameAr: text(formData, "nameAr"),
    descriptionFr: text(formData, "descriptionFr"),
    descriptionAr: text(formData, "descriptionAr"),
    scentFr: text(formData, "scentFr"),
    scentAr: text(formData, "scentAr"),
    price: num(formData, "price"),
    compareAtPrice: num(formData, "compareAtPrice") || null,
    colorHex: text(formData, "colorHex") || "#f2e3c0",
    image: text(formData, "image") || `/products/${slug}.svg`,
    category: text(formData, "category") || "signature",
    featured: formData.get("featured") === "on",
    stock: num(formData, "stock", 0),
    weightGr: num(formData, "weightGr", 220),
    burnHours: num(formData, "burnHours", 40),
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath(`/${locale}/produits`);
  revalidatePath(`/${locale}/produit/${slug}`);
  revalidatePath(`/${locale}/admin/produits`);
  redirect(`/${locale}/admin/produits`);
}

export async function deleteProduct(locale: string, id: string) {
  await guard();
  await prisma.product.delete({ where: { id } });
  revalidatePath(`/${locale}/admin/produits`);
  revalidatePath(`/${locale}/produits`);
}

export async function updateOrderStatus(locale: string, formData: FormData) {
  await guard();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (id && status) {
    await prisma.$transaction([
      prisma.order.update({ where: { id }, data: { status } }),
      prisma.orderStatusEvent.create({
        data: { orderId: id, status, note: "Statut mis à jour" },
      }),
    ]);
  }
  revalidatePath(`/${locale}/admin/commandes`);
}

export async function deleteOrder(locale: string, id: string) {
  await guard();
  await prisma.order.delete({ where: { id } });
  revalidatePath(`/${locale}/admin/commandes`);
}

export async function savePost(locale: string, formData: FormData) {
  await guard();

  const id = text(formData, "id");
  const slug = slugify(text(formData, "titleFr")) || `article-${Date.now()}`;
  const data = {
    slug,
    titleFr: text(formData, "titleFr"),
    titleAr: text(formData, "titleAr"),
    excerptFr: text(formData, "excerptFr"),
    excerptAr: text(formData, "excerptAr"),
    contentFr: text(formData, "contentFr"),
    contentAr: text(formData, "contentAr"),
    image: text(formData, "image") || `/blog/${slug}.svg`,
    category: text(formData, "category") || "astuce",
    published: formData.get("published") === "on",
  };

  if (id) {
    await prisma.blogPost.update({ where: { id }, data });
  } else {
    await prisma.blogPost.create({ data });
  }

  revalidatePath(`/${locale}/blog`);
  redirect(`/${locale}/admin/blog`);
}

export async function deletePost(locale: string, id: string) {
  await guard();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath(`/${locale}/admin/blog`);
  revalidatePath(`/${locale}/blog`);
}

export async function markMessageRead(locale: string, id: string, read: boolean) {
  await guard();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath(`/${locale}/admin/messages`);
}
