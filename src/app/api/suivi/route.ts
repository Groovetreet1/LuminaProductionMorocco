import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = (searchParams.get("number") ?? "").trim().toUpperCase();

  if (!number) {
    return NextResponse.json({ error: "Numéro de commande requis" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { number },
    include: {
      items: true,
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  return NextResponse.json(order);
}