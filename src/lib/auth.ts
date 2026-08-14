import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "lumina_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

function sign(payload: string) {
  return createHmac("sha256", process.env.AUTH_SECRET ?? "dev-secret")
    .update(payload)
    .digest("hex");
}

export async function createSession(username: string) {
  const cookieStore = await cookies();
  const payload = `${username}.${Date.now() + SESSION_TTL * 1000}`;
  const token = `${payload}.${sign(payload)}`;
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [username, expStr, signature] = parts;
  const expected = sign(`${username}.${expStr}`);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() > exp) return false;

  return username === process.env.ADMIN_USERNAME;
}
