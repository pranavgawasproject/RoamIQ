"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  Globe2,
  FileCheck,
  Zap,
  ChevronRight,
  TrendingDown,
  Building,
} from "lucide-react";
import { type VisaInfo } from "@/lib/supabase";

interface NomadVisaScreenerProps {
  initialCountries: VisaInfo[];
}

export function NomadVisaScreener({ initialCountries }: NomadVisaScreenerProps) {
  const [activeTab, setActiveTab] = useState<"table" | "wizard">("wizard");

  // Screener state
  const [monthlyIncomeUsd, setMonthlyIncomeUsd] = useState<number>(3500);
  const [onlyDnv, setOnlyDnv] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Wizard state
  const [passportRegion, setPassportRegion] = useState<"US" | "EU" | "UK" | "GLOBAL">("US");
  const [employmentType, setEmploymentType] = useState<"W2" | "1099" | "FREELANCE" | "FOUNDER">("1099");
  const [primaryGoal, setPrimaryGoal] = useState<"TAX" | "RESIDENCY" | "LOW_COST" | "FAST">("TAX");

  // Helper to parse income minimum string into USD numerical value
  const parseMinIncomeUsd = (incomeStr?: string | null): number | null => {
    if (!incomeStr || incomeStr === "N/A" || incomeStr === "Varies" || incomeStr === "Proof of funds" || incomeStr === "Proof of income") return null;

    const cleanStr = incomeStr.replace(/,/g, "");
    const isYearly = cleanStr.includes("/yr") || cleanStr.includes("/year");

    const matchUsd = cleanStr.match(/\$(\d+)/);
    const matchEuro = cleanStr.match(/€(\d+)/);
    const matchYen = cleanStr.match(/¥(\d+)/);
    const matchReais = cleanStr.match(/R\$(\d+)/);
    const matchCzk = cleanStr.match(/CZK\s*(\d+)/i);
    const matchRm = cleanStr.match(/RM\s*(\d+)/i);
    const matchRand = cleanStr.match(/R\s*(\d+)/i);
    const matchNumber = cleanStr.match(/(\d+)/);

    let val: number | null = null;

    if (matchUsd) val = parseInt(matchUsd[1], 10);
    else if (matchEuro) val = Math.round(parseInt(matchEuro[1], 10) * 1.08);
    else if (matchYen) val = Math.round(parseInt(matchYen[1], 10) / 155);
    else if (matchCzk) val = Math.round(parseInt(matchCzk[1], 10) / 23);
    else if (matchRm) val = Math.round(parseInt(matchRm[1], 10) / 4.4);
    else if (matchRand) val = Math.round(parseInt(matchRand[1], 10) / 18);
    else if (matchReais) val = Math.round(parseInt(matchReais[1], 10) / 5.5);
    else if (matchNumber) val = parseInt(matchNumber[1], 10);

    if (val && isYearly) {
      val = Math.round(val / 12);
    }

    return val;
  };

  const countriesWithEligibility = initialCountries.map((country) => {
    const requiredIncome = parseMinIncomeUsd(country.min_income);
    let status: "eligible" | "near" | "short" | "no_dnv" = "no_dnv";

    if (!country.has_dn_visa) {
      status = "no_dnv";
    } else if (!requiredIncome) {
      status = "eligible";
    } else if (monthlyIncomeUsd >= requiredIncome) {
      status = "eligible";
    } else if (monthlyIncomeUsd >= requiredIncome * 0.8) {
      status = "near";
    } else {
      status = "short";
    }

    // Scoring engine for wizard matches
    let matchScore = 0;
    if (country.has_dn_visa) matchScore += 30;
    if (status === "eligible") matchScore += 40;
    else if (status === "near") matchScore += 20;

    if (primaryGoal === "TAX" && (country.tax_notes?.includes("0%") || country.tax_notes?.includes("exempt") || country.tax_notes?.includes("15%") || country.tax_notes?.includes("1%"))) {
      matchScore += 30;
    }
    if (primaryGoal === "RESIDENCY" && country.path_to_residency?.toLowerCase().includes("path")) {
      matchScore += 25;
    }
    if (primaryGoal === "FAST" && country.processing_time?.includes("1-2") || country.processing_time?.includes("2-4")) {
      matchScore += 20;
    }

    return {
      ...country,
      requiredIncomeUsd: requiredIncome,
      status,
      matchScore,
    };
  });

  const filteredCountries = countriesWithEligibility.filter((c) => {
    if (searchQuery && !c.country.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (onlyDnv && !c.has_dn_visa) {
      return false;
    }
    return true;
  });

  const topWizardMatches = [...countriesWithEligibility]
    .filter((c) => c.has_dn_visa)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  const eligibleCount = filteredCountries.filter((c) => c.status === "eligible" && c.has_dn_visa).length;
  const totalDnvCount = filteredCountries.filter((c) => c.has_dn_visa).length;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
      {/* Top Header & Tab Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-forest">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Nomad Visa Intelligence</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
            Digital Nomad Visa Screener & Tax Strategy Matcher
          </h2>
          <p className="text-sm text-muted-foreground">
            Compare minimum remote income rules, tax exemptions, and document checklists across official DNV programs.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-2xl border border-border bg-secondary/40 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("wizard")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "wizard"
                ? "bg-card text-forest shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="h-3.5 w-3.5" /> AI Match Wizard
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "table"
                ? "bg-card text-forest shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" /> Full Country Table ({eligibleCount}/{totalDnvCount})
          </button>
        </div>
      </div>

      {activeTab === "wizard" ? (
        /* WIZARD MODE */
        <div className="mt-6 space-y-8">
          {/* Controls Bar */}
          <div className="grid gap-4 sm:grid-cols-4 rounded-2xl border border-border bg-secondary/30 p-5">
            {/* Income Slider */}
            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span>Monthly Income</span>
                <span className="font-mono text-xs font-bold text-forest">${monthlyIncomeUsd.toLocaleString()}/mo</span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="250"
                value={monthlyIncomeUsd}
                onChange={(e) => setMonthlyIncomeUsd(parseInt(e.target.value, 10))}
                className="mt-2.5 w-full accent-forest cursor-pointer"
              />
            </div>

            {/* Passport */}
            <div>
              <label className="text-xs font-semibold text-foreground/80">Citizenship / Passport</label>
              <select
                value={passportRegion}
                onChange={(e: any) => setPassportRegion(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="US">🇺🇸 United States Passport</option>
                <option value="EU">🇪🇺 European Union Passport</option>
                <option value="UK">🇬🇧 United Kingdom Passport</option>
                <option value="GLOBAL">🌐 Global Passport (Other)</option>
              </select>
            </div>

            {/* Work Structure */}
            <div>
              <label className="text-xs font-semibold text-foreground/80">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e: any) => setEmploymentType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="1099">1099 Remote Contractor</option>
                <option value="W2">W-2 Full-Time Employee</option>
                <option value="FREELANCE">Independent Freelancer</option>
                <option value="FOUNDER">Startup Founder / Business Owner</option>
              </select>
            </div>

            {/* Priority Goal */}
            <div>
              <label className="text-xs font-semibold text-foreground/80">Primary Objective</label>
              <select
                value={primaryGoal}
                onChange={(e: any) => setPrimaryGoal(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="TAX">Max Tax Exemption / Savings</option>
                <option value="RESIDENCY">Path to Permanent Residency</option>
                <option value="LOW_COST">Affordable Living Budget</option>
                <option value="FAST">Fast Visa Processing (&lt;4 Weeks)</option>
              </select>
            </div>
          </div>

          {/* Special Tax Note Alert for US Citizens */}
          {passportRegion === "US" && (
            <div className="rounded-2xl border border-forest/30 bg-forest/5 p-4 flex items-start gap-3 text-xs text-foreground/90">
              <ShieldCheck className="h-5 w-5 text-forest shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-forest">US Tax Optimization Note (IRS FEIE):</span> As a U.S. citizen working abroad on any of these digital nomad visas, you may qualify for the IRS Foreign Earned Income Exclusion (FEIE, Form 2555), excluding up to <strong className="font-mono">$126,500/year</strong> in foreign earned income if you meet the 330-day physical presence test.
              </div>
            </div>
          )}

          {/* Top Matched Cards */}
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground">
              Top Matched Digital Nomad Visas for Your Profile
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked based on your monthly income (${monthlyIncomeUsd.toLocaleString()}/mo), visa rules, and {primaryGoal.toLowerCase()} objective.
            </p>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {topWizardMatches.map((c) => (
                <div
                  key={c.id || c.country}
                  className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-forest/40 hover:shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-xl font-semibold">
                        {c.flag} {c.country}
                      </div>
                      {c.status === "eligible" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Qualified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                          <AlertCircle className="h-3.5 w-3.5" /> Near Income Threshold
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5">
                        <span className="text-muted-foreground block text-[10px]">Min. Income</span>
                        <span className="font-mono font-bold text-foreground">{c.min_income || "Proof of funds"}</span>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5">
                        <span className="text-muted-foreground block text-[10px]">Duration</span>
                        <span className="font-bold text-foreground">{c.dn_visa_duration || "1 year"}</span>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5">
                        <span className="text-muted-foreground block text-[10px]">Fee / Cost</span>
                        <span className="font-mono font-bold text-foreground">{c.dn_visa_cost || "N/A"}</span>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5">
                        <span className="text-muted-foreground block text-[10px]">Processing</span>
                        <span className="font-bold text-foreground">{c.processing_time || "2-4 weeks"}</span>
                      </div>
                    </div>

                    {/* Tax & Residency Benefit */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-forest font-medium">
                        <TrendingDown className="h-4 w-4 shrink-0" />
                        <span>{c.tax_exemption_status || c.tax_notes}</span>
                      </div>
                      {c.path_to_residency && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Building className="h-4 w-4 shrink-0" />
                          <span>{c.path_to_residency}</span>
                        </div>
                      )}
                    </div>

                    {/* Document Checklist Preview */}
                    {c.required_docs && c.required_docs.length > 0 && (
                      <div className="mt-4 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground/80 block mb-1">Required Application Docs:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {c.required_docs.map((doc, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-foreground/80">
                              <FileCheck className="h-3 w-3 text-forest" /> {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 border-t border-border pt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Apply via {c.application_method || "Online Portal"}</span>
                    <span className="font-semibold text-forest hover:underline flex items-center gap-1">
                      View country rules <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* TABLE MODE */
        <div>
          {/* Screener Controls */}
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4">
              <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span>Monthly Remote Income</span>
                <span className="font-mono text-sm font-bold text-forest">${monthlyIncomeUsd.toLocaleString()}/mo</span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="250"
                value={monthlyIncomeUsd}
                onChange={(e) => setMonthlyIncomeUsd(parseInt(e.target.value, 10))}
                className="mt-3 w-full accent-forest cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>$1,000</span>
                <span>$3,500</span>
                <span>$10,000+</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex flex-col justify-between">
              <label className="text-xs font-semibold text-foreground/80">Search Country</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Spain, Thailand, Japan…"
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                  <Filter className="h-4 w-4 text-forest" />
                  Dedicated Nomad Visas Only
                </span>
                <input
                  type="checkbox"
                  checked={onlyDnv}
                  onChange={(e) => setOnlyDnv(e.target.checked)}
                  className="h-4 w-4 rounded accent-forest cursor-pointer"
                />
              </div>
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                Hide tourist-stay-only countries and show only official remote worker visas.
              </p>
            </div>
          </div>

          {/* Results Table */}
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Country</th>
                  <th className="px-5 py-3.5 font-medium">Qualification Status</th>
                  <th className="px-5 py-3.5 font-medium">Min. Income Req.</th>
                  <th className="px-5 py-3.5 font-medium">Visa Duration</th>
                  <th className="px-5 py-3.5 font-medium">Application Fee</th>
                  <th className="px-5 py-3.5 font-medium">Processing Time</th>
                  <th className="px-5 py-3.5 font-medium">Application Method</th>
                  <th className="px-5 py-3.5 font-medium">Tax Residency Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCountries.map((c) => (
                  <tr key={c.id || c.country} className="transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-4 font-serif text-base font-semibold">
                      {c.flag} {c.country}
                    </td>
                    <td className="px-5 py-4">
                      {c.status === "eligible" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Income Qualified
                        </span>
                      ) : c.status === "near" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600">
                          <AlertCircle className="h-3.5 w-3.5" /> Near Target Income
                        </span>
                      ) : c.status === "short" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                          Higher Income Needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                          Tourist Stay ({c.tourist_days}d)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground/80">
                      {c.has_dn_visa ? (c.min_income || "Varies") : "N/A (Tourist)"}
                    </td>
                    <td className="px-5 py-4 text-foreground/80 text-xs">
                      {c.has_dn_visa ? c.dn_visa_duration : `${c.tourist_days} days tourist`}
                    </td>
                    <td className="px-5 py-4 text-foreground/80 text-xs">
                      {c.has_dn_visa ? c.dn_visa_cost : "N/A"}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {c.has_dn_visa ? (c.processing_time || "2-4 weeks") : "Instant"}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {c.has_dn_visa ? (c.application_method || "Online Portal") : "Entry Visa"}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {c.tax_residency_days ? `${c.tax_residency_days}d residency` : "183d rule"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
