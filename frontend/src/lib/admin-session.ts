import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "roamiq_admin_session";

export function adminSecret(): string {
  return process.env.ADMIN_ACCESS_KEY || process.env.ADMIN_PASSWORD || "";
}

export function adminSessionToken(secret: string): string {
  return createHmac("sha256", secret).update("roamiq-admin-session-v1").digest("hex");
}

export function tokensMatch(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

export async function hasValidAdminSession(): Promise<boolean> {
  const secret = adminSecret();
  if (!secret) return false;
  const jar = await cookies();
  const raw = jar.get(ADMIN_SESSION_COOKIE)?.value || "";
  if (!raw) return false;
  return tokensMatch(raw, adminSessionToken(secret));
}
