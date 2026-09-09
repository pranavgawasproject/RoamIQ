import type { Metadata } from "next";
import { Globe2, CheckCircle2, XCircle } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import { WaitlistSticky } from "@/components/site/waitlist-sticky";
import { supabase, type VisaInfo } from "@/lib/supabase";
import { NomadVisaScreener } from "@/components/site/nomad-visa-screener";
import { NomadTaxAuditCalculator } from "@/components/site/nomad-tax-audit-calculator";

const BASE_URL = "https://nomads-travel-indol.vercel.app";
