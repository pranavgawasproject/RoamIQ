import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side admin auth. Compares the submitted key against ADMIN_ACCESS_KEY
 * (set in Vercel/hosting env). Never hardcode secrets in client bundles.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const key = typeof body?.key === "string" ? body.key.trim() : "";

    if (!key) {
      return NextResponse.json(
        { ok: false, error: "Access key is required." },
        { status: 400 }
      );
    }

    const expected = process.env.ADMIN_ACCESS_KEY?.trim();

    if (!expected) {
      console.error(
        "[admin/auth] ADMIN_ACCESS_KEY is not configured on the server."
      );
      return NextResponse.json(
        {
          ok: false,
          error:
            "Admin access is not configured. Set ADMIN_ACCESS_KEY on the server.",
        },
        { status: 503 }
      );
    }

    // Constant-time-ish compare for short secrets (avoids trivial timing leaks).
    if (key.length !== expected.length) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin access key." },
        { status: 401 }
      );
    }

    let mismatch = 0;
    for (let i = 0; i < key.length; i++) {
      mismatch |= key.charCodeAt(i) ^ expected.charCodeAt(i);
    }

    if (mismatch !== 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin access key." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/auth] unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Unable to verify access key." },
      { status: 500 }
    );
  }
}
