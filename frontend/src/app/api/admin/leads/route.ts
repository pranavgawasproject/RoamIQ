import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const ok = await hasValidAdminSession();
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("waitlist_signups")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to load waitlist." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, leads: data ?? [] });
}
