import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !email.includes("@") || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        name: String(name).slice(0, 120),
        email: String(email).slice(0, 120),
        phone: phone ? String(phone).slice(0, 30) : null,
        subject: String(subject ?? "").slice(0, 160),
        message: String(message).slice(0, 2000),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
