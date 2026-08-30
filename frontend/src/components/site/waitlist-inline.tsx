"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type WaitlistInlineProps = {
  source: string;
  heading?: string;
  description?: string;
  compact?: boolean;
};

export function WaitlistInline({
  source,
  heading = "Get workspace shortlists in your inbox",
  description = "Free to join. No spam — we only email when there is something useful for your next move.",
  compact = false,
}: WaitlistInlineProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: email.trim().toLowerCase(), source });

    if (error) {
      if (error.code === "23505") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
      return;
    }

    setStatus("success");
    setEmail("");
  }

  return (
    <div className={compact ? "w-full" : "w-full max-w-md"}>
      {heading ? (
        <p className={compact ? "text-sm font-semibold text-foreground" : "text-sm font-medium text-foreground"}>
          {heading}
        </p>
      ) : null}
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}

      {status === "success" ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground">
          <Check className="h-4 w-4 shrink-0 text-forest" />
          You&apos;re on the list. We&apos;ll email only when it is useful.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center"
        >
          <label htmlFor={`waitlist-email-${source}`} className="sr-only">
            Email address
          </label>
          <input
            id={`waitlist-email-${source}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            placeholder="you@nomad.life"
            className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Join free <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}
