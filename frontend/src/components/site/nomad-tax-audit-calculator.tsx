"use client";

import { useState } from "react";
import {
  Calculator,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Globe,
  FileText,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import {
  calculateNomadFeieTaxExclusionCompliance,
  calculateNomadSchengenRollingWindowCompliance,
  calculateNomadSubstantialPresenceTestRisk,
  calculateNomadUkStatutoryResidenceTestRisk,
  calculateNomadTaxTreatyTieBreakerRisk,
} from "@/lib/nomadCostCalculator";

type AuditTab = "feie" | "schengen" | "us_spt" | "uk_srt" | "tiebreaker";

export function NomadTaxAuditCalculator() {
  const [activeTab, setActiveTab] = useState<AuditTab>("feie");

  // State for FEIE
  const [earnedIncome, setEarnedIncome] = useState<number>(120000);
  const [foreignDays, setForeignDays] = useState<number>(335);

  // State for Schengen
  const [plannedSchengenDays, setPlannedSchengenDays] = useState<number>(60);
  const [pastSchengenDays, setPastSchengenDays] = useState<number>(40);

  // State for US Substantial Presence Test (SPT)
  const [currentUsDays, setCurrentUsDays] = useState<number>(120);
  const [prior1UsDays, setPrior1UsDays] = useState<number>(120);
  const [prior2UsDays, setPrior2UsDays] = useState<number>(120);
  const [hasCloserConnection, setHasCloserConnection] = useState<boolean>(true);

  // State for UK Statutory Residence Test (SRT)
  const [ukDaysCurrent, setUkDaysCurrent] = useState<number>(45);
  const [wasUkResidentPast3Years, setWasUkResidentPast3Years] = useState<boolean>(false);

  // State for OECD Tie-Breaker
  const [countryADays, setCountryADays] = useState<number>(200);
  const [countryBDays, setCountryBDays] = useState<number>(165);
  const [permanentHomeA, setPermanentHomeA] = useState<boolean>(true);
  const [permanentHomeB, setPermanentHomeB] = useState<boolean>(false);

  // Perform active calculations using tested lib helpers
  const feieResult = calculateNomadFeieTaxExclusionCompliance({
    annualEarnedIncomeUsd: earnedIncome,
    daysInForeignCountriesCount: foreignDays,
  });

  const schengenResult = calculateNomadSchengenRollingWindowCompliance({
    plannedSchengenDaysCount: plannedSchengenDays,
    past180DaysSchengenCount: pastSchengenDays,
  });

  const sptResult = calculateNomadSubstantialPresenceTestRisk({
    currentYearUsDaysCount: currentUsDays,
    priorYearUsDaysCount: prior1UsDays,
    twoYearsPriorUsDaysCount: prior2UsDays,
    hasCloserConnectionToForeignCountry: hasCloserConnection,
    annualGlobalIncomeUsd: earnedIncome,
  });

  const srtResult = calculateNomadUkStatutoryResidenceTestRisk({
    daysInUkCurrentTaxYear: ukDaysCurrent,
    daysInUkPriorYear1: wasUkResidentPast3Years ? 183 : 30,
    daysInUkPriorYear2: wasUkResidentPast3Years ? 183 : 30,
    daysInUkPriorYear3: wasUkResidentPast3Years ? 183 : 30,
    annualGlobalIncomeGbp: Math.round(earnedIncome * 0.78),
  });

  const tieBreakerResult = calculateNomadTaxTreatyTieBreakerRisk({
    primaryCountryName: "Spain",
    secondaryCountryName: "US",
    primaryCountryDaysCount: countryADays,
    secondaryCountryDaysCount: countryBDays,
    hasPermanentHomePrimary: permanentHomeA,
    hasPermanentHomeSecondary: permanentHomeB,
    annualGlobalIncomeUsd: earnedIncome,
  });

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-forest">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Nomad Tax & Residency Audit
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
            IRS FEIE, Schengen 90/180 & Tax Residency Compliance Calculator
          </h2>
          <p className="text-sm text-muted-foreground">
            Audit physical presence days, foreign earned income exclusion (IRS Form 2555), Schengen stay limits, and dual tax residency risks.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-foreground self-start sm:self-auto">
          <Calculator className="h-4 w-4 text-forest" />
          <span>OECD & IRS Standard Compliant</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
        <TabButton
          active={activeTab === "feie"}
          onClick={() => setActiveTab("feie")}
          icon={DollarSign}
          label="US FEIE 330-Day Audit"
        />
        <TabButton
          active={activeTab === "schengen"}
          onClick={() => setActiveTab("schengen")}
          icon={Globe}
          label="Schengen 90/180 Tracker"
        />
        <TabButton
          active={activeTab === "us_spt"}
          onClick={() => setActiveTab("us_spt")}
          icon={FileText}
          label="US Substantial Presence (SPT)"
        />
        <TabButton
          active={activeTab === "uk_srt"}
          onClick={() => setActiveTab("uk_srt")}
          icon={Calendar}
          label="UK Statutory Residence (SRT)"
        />
        <TabButton
          active={activeTab === "tiebreaker"}
          onClick={() => setActiveTab("tiebreaker")}
          icon={ShieldCheck}
          label="OECD Treaty Tie-Breaker"
        />
      </div>

      {/* Tab 1: FEIE 330-Day Audit */}
      {activeTab === "feie" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span>Annual Foreign Earned Income</span>
                <span className="font-mono text-sm font-bold text-forest">
                  ${earnedIncome.toLocaleString()}/yr
                </span>
              </label>
              <input
                type="range"
                min="30000"
                max="250000"
                step="5000"
                value={earnedIncome}
                onChange={(e) => setEarnedIncome(parseInt(e.target.value, 10))}
                className="w-full accent-forest cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$30,000</span>
                <span>$126,500 Cap</span>
                <span>$250,000+</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span>Full Days Outside US (365-Day Window)</span>
                <span className="font-mono text-sm font-bold text-forest">
                  {foreignDays} days
                </span>
              </label>
              <input
                type="range"
                min="180"
                max="365"
                step="1"
                value={foreignDays}
                onChange={(e) => setForeignDays(parseInt(e.target.value, 10))}
                className="w-full accent-forest cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>180 days</span>
                <span>330 days threshold</span>
                <span>365 days</span>
              </div>
            </div>
          </div>

          {/* Result Banner */}
          <div
            className={`rounded-2xl border p-5 ${
              feieResult.meetsPhysicalPresenceTest
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {feieResult.meetsPhysicalPresenceTest ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold">
                  {feieResult.meetsPhysicalPresenceTest
                    ? "IRS Form 2555 FEIE Qualified"
                    : "Action Required: Insufficient Days Abroad"}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {feieResult.recommendation}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-current/15 pt-4 text-xs sm:grid-cols-4">
              <div>
                <span className="opacity-75 block">Physical Presence Test</span>
                <strong className="text-sm font-semibold">
                  {feieResult.meetsPhysicalPresenceTest ? "QUALIFIED (330+ days)" : "NOT MET"}
                </strong>
              </div>
              <div>
                <span className="opacity-75 block">Eligible Income Exclusion</span>
                <strong className="text-sm font-semibold">
                  ${(feieResult.eligibleExclusionUsd ?? 0).toLocaleString()}
                </strong>
              </div>
              <div>
                <span className="opacity-75 block">Est. Federal Tax Savings</span>
                <strong className="text-sm font-semibold">
                  ${(feieResult.estimatedTaxSavingsUsd ?? 0).toLocaleString()}
                </strong>
              </div>
              <div>
                <span className="opacity-75 block">Days Needed Abroad</span>
                <strong className="text-sm font-semibold">
                  {feieResult.daysNeededForQualificationCount ?? 0} days
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schengen 90/180 Tracker */}
      {activeTab === "schengen" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span>Days Spent in Schengen in Past 180 Days</span>
                <span className="font-mono text-sm font-bold text-forest">
                  {pastSchengenDays} days
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={pastSchengenDays}
                onChange={(e) => setPastSchengenDays(parseInt(e.target.value, 10))}
                className="w-full accent-forest cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0 days</span>
                <span>45 days</span>
                <span>90 days max</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span>Planned Upcoming Stay Duration</span>
                <span className="font-mono text-sm font-bold text-forest">
                  {plannedSchengenDays} days
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="90"
                step="1"
                value={plannedSchengenDays}
                onChange={(e) => setPlannedSchengenDays(parseInt(e.target.value, 10))}
                className="w-full accent-forest cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 day</span>
                <span>30 days</span>
                <span>90 days</span>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              schengenResult.isCompliant
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                : "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {schengenResult.isCompliant ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold">
                  {schengenResult.isCompliant
                    ? "Schengen 90/180 Rule Compliant"
                    : "Schengen Overstay Warning"}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {schengenResult.recommendation}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-current/15 pt-4 text-xs sm:grid-cols-4">
              <div>
                <span className="opacity-75 block">Total Days in 180d Window</span>
                <strong className="text-sm font-semibold">
                  {schengenResult.totalDaysInWindow ?? 0} / 90 days
                </strong>
              </div>
              <div>
                <span className="opacity-75 block">Remaining Quota</span>
                <strong className="text-sm font-semibold">
                  {schengenResult.daysRemainingAllowed ?? 0} days
                </strong>
              </div>
              <div>
                <span className="opacity-75 block">Overstay Risk</span>
                <strong className="text-sm font-semibold">
                  {schengenResult.overstayDaysCount ?? 0} days
                </strong>
              </div>
              <div>
                <span className="opacity-75 block">Est. Fine / Exposure</span>
                <strong className="text-sm font-semibold">
                  €{(schengenResult.estimatedFineEur ?? 0).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: US Substantial Presence Test (SPT) */}
      {activeTab === "us_spt" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
              <label className="text-xs font-semibold text-foreground/80 block">
                Current Year US Days
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={currentUsDays}
                onChange={(e) => setCurrentUsDays(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-forest"
              />
            </div>
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
              <label className="text-xs font-semibold text-foreground/80 block">
                1st Prior Year US Days (×1/3)
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={prior1UsDays}
                onChange={(e) => setPrior1UsDays(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-forest"
              />
            </div>
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
              <label className="text-xs font-semibold text-foreground/80 block">
                2nd Prior Year US Days (×1/6)
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={prior2UsDays}
                onChange={(e) => setPrior2UsDays(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-forest"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/20 p-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-forest" />
              <span className="text-xs font-semibold text-foreground/80">
                Closer Connection Exception (IRS Form 8840 Eligible)?
              </span>
            </div>
            <input
              type="checkbox"
              checked={hasCloserConnection}
              onChange={(e) => setHasCloserConnection(e.target.checked)}
              className="h-4 w-4 rounded accent-forest cursor-pointer"
            />
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              sptResult.usTaxResidencyStatus === "NON_RESIDENT_ALIEN" ||
              sptResult.usTaxResidencyStatus === "EXEMPT_VIA_FORM_8840"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <FileText className="h-6 w-6 text-forest shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold">
                  Substantial Presence Formula: {sptResult.sptWeightedDaysCount} Weighted Days
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {sptResult.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: UK Statutory Residence Test (SRT) */}
      {activeTab === "uk_srt" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span>Days in UK in Current Tax Year</span>
                <span className="font-mono text-sm font-bold text-forest">
                  {ukDaysCurrent} days
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="183"
                step="1"
                value={ukDaysCurrent}
                onChange={(e) => setUkDaysCurrent(parseInt(e.target.value, 10))}
                className="w-full accent-forest cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0 days</span>
                <span>45 days</span>
                <span>183 days</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground/80 block">
                  UK Tax Resident in Past 3 Years?
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Affects Automatic Overseas & Ties Test limits.
                </span>
              </div>
              <input
                type="checkbox"
                checked={wasUkResidentPast3Years}
                onChange={(e) => setWasUkResidentPast3Years(e.target.checked)}
                className="h-4 w-4 rounded accent-forest cursor-pointer"
              />
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              !srtResult.isUkTaxResident
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                : "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <Calendar className="h-6 w-6 text-forest shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold">
                  HMRC SRT Category: {srtResult.srtTestCategory.replace(/_/g, " ")}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {srtResult.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: OECD Tie-Breaker */}
      {activeTab === "tiebreaker" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/80">Country A (Spain) Days</span>
                <span className="font-mono text-sm font-bold text-forest">{countryADays}d</span>
              </div>
              <input
                type="range"
                min="0"
                max="365"
                value={countryADays}
                onChange={(e) => setCountryADays(parseInt(e.target.value, 10))}
                className="w-full accent-forest cursor-pointer"
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <input
                  type="checkbox"
                  checked={permanentHomeA}
                  onChange={(e) => setPermanentHomeA(e.target.checked)}
                  className="rounded accent-forest"
                />
                Permanent Home in Spain
              </label>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/80">Country B (US) Days</span>
                <span className="font-mono text-sm font-bold text-forest">{countryBDays}d</span>
              </div>
              <input
                type="range"
                min="0"
                max="365"
                value={countryBDays}
                onChange={(e) => setCountryBDays(parseInt(e.target.value, 10))}
                className="w-full accent-forest cursor-pointer"
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <input
                  type="checkbox"
                  checked={permanentHomeB}
                  onChange={(e) => setPermanentHomeB(e.target.checked)}
                  className="rounded accent-forest"
                />
                Permanent Home in US
              </label>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              tieBreakerResult.complianceTier === "SINGLE_RESIDENCY_TREATY_SAFE"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-forest shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold">
                  OECD Article 4 Tie-Breaker: Sole Residency in {tieBreakerResult.tieBreakerResultCountry}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {tieBreakerResult.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof DollarSign;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
        active
          ? "bg-forest text-white"
          : "bg-secondary/70 text-foreground/80 hover:bg-secondary"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
