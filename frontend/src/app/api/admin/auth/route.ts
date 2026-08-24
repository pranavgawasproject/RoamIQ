import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side admin auth. Password is read only from ADMIN_ACCESS_KEY or
 * ADMIN_PASSWORD env (never NEXT_PUBLIC_*). Set the same value in Vercel
 * Project Settings → Environment Variables. Client never sees the secret.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = typeof body.password === "string" ? body.password : "";

    const expected =
      process.env.ADMIN_ACCESS_KEY || process.env.ADMIN_PASSWORD || "";

    if (!expected) {
      // Misconfiguration: do not fall back to any hardcoded value.
      return NextResponse.json(
        {
          ok: false,
          error:
            "Admin auth is not configured. Set ADMIN_ACCESS_KEY in the environment.",
        },
        { status: 503 }
      );
    }

    // Constant-time-ish compare to reduce timing leakage for short secrets.
    const ok =
      password.length === expected.length &&
      password.split("").every((ch, i) => ch === expected[i]);

    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin access key." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Auth request failed." },
      { status: 500 }
    );
  }
}
