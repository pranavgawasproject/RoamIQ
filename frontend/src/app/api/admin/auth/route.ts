import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  adminSecret,
  adminSessionToken,
  hasValidAdminSession,
  tokensMatch,
} from "@/lib/admin-session";

/**
 * Server-side admin auth. Password is read only from ADMIN_ACCESS_KEY or
 * ADMIN_PASSWORD env (never NEXT_PUBLIC_*). A successful check sets an
 * httpOnly session cookie so the client cannot flip sessionStorage and
 * read waitlist rows from the public anon client.
 */
export async function GET() {
  const ok = await hasValidAdminSession();
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = typeof body.password === "string" ? body.password : "";
    const expected = adminSecret();

    if (!expected) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Admin auth is not configured. Set ADMIN_ACCESS_KEY in the environment.",
        },
        { status: 503 }
      );
    }

    if (!tokensMatch(password, expected)) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin access key." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(
      ADMIN_SESSION_COOKIE,
      adminSessionToken(expected),
      adminCookieOptions()
    );
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Auth request failed." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { ...adminCookieOptions(), maxAge: 0 });
  return res;
}
