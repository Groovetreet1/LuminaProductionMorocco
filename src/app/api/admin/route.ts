import { NextResponse } from "next/server";
import { createSession, destroySession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      await createSession(username);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
