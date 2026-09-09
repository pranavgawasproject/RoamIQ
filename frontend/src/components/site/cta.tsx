"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/site";

const perks = [
  "Browse destinations & workspaces free \u2014 no account needed",
  "AI trip planner and multi-city cost comparison (beta)",
  "Verified Wi-Fi speeds and listing details from the database",
  "Weekly nomad intel in your inbox when you join the list",
];

export function CTA({ source = "homepage_cta" }: { source?: string }) {
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
        trackEvent("waitlist_signup", { source, status: "already_subscribed" });
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
      return;
    }

    setStatus("success");
    trackEvent("waitlist_signup", { source, status: "created" });
    setEmail("");
  }
