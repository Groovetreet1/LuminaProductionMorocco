import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `LM-${ts}${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, city, address, notes, paymentMethod, items, utm } = body;

    if (!name || !phone || !city || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    if (!["COD", "STRIPE"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Mode de paiement invalide" }, { status: 400 });
    }

    const ids = items.map((i: { id: string }) => i.id);
    const dbProducts = await prisma.product.findMany({ where: { id: { in: ids } } });
    if (dbProducts.length !== items.length) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 400 });
    }

    const orderItems = items.map((item: { id: string; quantity: number }) => {
      const db = dbProducts.find((p) => p.id === item.id)!;
      return {
        productId: db.id,
        name: db.nameFr,
        price: db.price,
        quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
      };
    });

    const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        number: generateOrderNumber(),
        customerName: String(name).slice(0, 120),
        phone: String(phone).slice(0, 30),
        email: email ? String(email).slice(0, 120) : null,
        city: String(city).slice(0, 80),
        address: String(address).slice(0, 300),
        notes: notes ? String(notes).slice(0, 500) : null,
        paymentMethod,
        status: paymentMethod === "STRIPE" ? "PENDING" : "PENDING",
        utmSource: utm?.utmSource ? String(utm.utmSource).slice(0, 100) : null,
        utmCampaign: utm?.utmCampaign ? String(utm.utmCampaign).slice(0, 100) : null,
        utmMedium: utm?.utmMedium ? String(utm.utmMedium).slice(0, 100) : null,
        utmContent: utm?.utmContent ? String(utm.utmContent).slice(0, 100) : null,
        total,
        items: { create: orderItems },
        statusEvents: { create: { status: "PENDING", note: "Commande passée" } },
      },
    });

    if (paymentMethod === "COD") {
      return NextResponse.json({ ok: true, number: order.number });
    }

    const stripe = getStripe();
    if (!stripe) {
      await prisma.order.delete({ where: { id: order.id } });
      return NextResponse.json(
        { error: "Le paiement en ligne n'est pas encore configuré. Utilisez le paiement à la livraison." },
        { status: 503 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: orderItems.map((i) => ({
        price_data: {
          currency: "mad",
          unit_amount: Math.round(i.price * 100),
          product_data: { name: i.name },
        },
        quantity: i.quantity,
      })),
      customer_email: email || undefined,
      metadata: { orderId: order.id },
      success_url: `${baseUrl}/commande/${order.number}?success=stripe`,
      cancel_url: `${baseUrl}/commande?cancel=1`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
