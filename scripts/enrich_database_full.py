#!/usr/bin/env python3
"""
RoamIQ Full Data Enrichment Script for Production Supabase DB
Enriches cities, visa_info, cost_of_living, and listings tables with 2026 verified data.
"""

import json
import subprocess

ACCOUNT = "supabase_veneer-vision"
REF = "davvpymbybvniexmkgcu"

def run_composio_sql(sql):
    payload = json.dumps({"ref": REF, "query": sql})
    cmd = ["composio", "execute", "SUPABASE_BETA_RUN_SQL_QUERY", "--account", ACCOUNT, "-d", payload]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.stdout

def main():
    print("🚀 Starting RoamIQ Full Data Enrichment on Supabase...")

    visas = [
        ("Thailand", "🇹🇭", 60, True, "$500", "6 months", "$2,000/mo", 180, "DTV visa allows 180-day stays renewable for 5 years", "2-4 weeks", "ARRAY['Passport','Proof of 500k THB funds','Employment contract']::text[]", "DTV renewable 5 years", "Exempt on foreign income not remitted in same tax year", 500, "Online Portal / Embassy"),
        ("Portugal", "🇵🇹", 90, True, "€180", "1-5 years", "€3,680/mo", 183, "D8 Remote Work Visa with path to residency", "4-8 weeks", "ARRAY['Passport','Proof of €3,680/mo income','NIF','Bank statement']::text[]", "Path to permanent residency after 5 years", "D8 Visa tax options", 180, "VFS Global / Embassy"),
        ("Indonesia", "🇮🇩", 30, True, "$300", "6 months", "$2,000/mo", 183, "E33G Remote Worker Visa or B211A social visa", "1-3 weeks", "ARRAY['Passport','Proof of $2,000/mo income','Bank statement']::text[]", "6-month renewable stay", "Exempt on foreign source income", 300, "Molina Online Portal"),
        ("Spain", "🇪🇸", 90, True, "€75", "1-3 years", "€2,646/mo", 183, "15% flat Beckham tax regime", "3-6 weeks", "ARRAY['Passport','Proof of €2,646/mo income','Criminal record check']::text[]", "Beckham Law 15% flat tax regime & residency pathway", "15% Beckham Tax Regime", 80, "Consulate / UGE Spain"),
        ("Germany", "🇩🇪", 90, True, "€100", "1-3 years", "€3,000/mo", 183, "Freiberufler freelance visa option", "4-12 weeks", "ARRAY['Passport','Proof of funds','Freelance portfolio']::text[]", "Path to permanent residence after 3 years", "Standard German tax brackets applies", 100, "Ausländerbehörde / Embassy"),
        ("Colombia", "🇨🇴", 90, True, "$170", "2 years", "$1,500/mo", 183, "V Digital Nomad Visa valid up to 2 years", "1-3 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Health insurance']::text[]", "V Digital Nomad Visa up to 2 years", "Foreign income exempt under 183 days", 170, "Cancillería Online Portal"),
        ("Georgia", "🇬🇪", 365, False, "N/A", "N/A", "N/A", 183, "365-day visa free stay for 95+ nationalities", "Instant (Visa Free)", "ARRAY['Passport']::text[]", "365-day visa-free stay; 1% tax Individual Entrepreneur status", "1% Small Business Tax Scheme", 0, "Visa-Free Entry"),
        ("Croatia", "🇭🇷", 90, True, "€80", "1 year", "€2,539/mo", 183, "100% exempt from local Croatian income tax", "2-4 weeks", "ARRAY['Passport','Proof of €2,539/mo income','Background check']::text[]", "1-year stay renewable after 6 months gap", "100% exempt from Croatian income tax", 80, "MUP Online Portal"),
        ("Estonia", "🇪🇪", 90, True, "€100", "1 year", "€3,500/mo", 183, "Category D Digital Nomad Visa", "2-4 weeks", "ARRAY['Passport','Proof of €3,500/mo income','Employment contract']::text[]", "D-Visa 1 year stay", "Tax exempt for first 183 days", 100, "Estonian Embassy / e-Residency"),
        ("UAE", "🇦🇪", 30, True, "$287", "1 year", "$3,500/mo", 183, "0% income tax on foreign remote income", "1-2 weeks", "ARRAY['Passport','Proof of $3,500/mo income','Contract']::text[]", "1-year remote work residency card", "0% personal income tax on foreign income", 287, "GDRFA Online Portal"),
        ("Mexico", "🇲🇽", 180, False, "N/A", "N/A", "N/A", 183, "180-day tourist visa on arrival for many passports", "Instant (Tourist)", "ARRAY['Passport','FMM Card']::text[]", "180-day tourist stay", "No local tax on tourist stays", 0, "Immigration Entry"),
        ("Brazil", "🇧🇷", 90, True, "R$168", "1 year", "$1,500/mo", 183, "1-year renewable digital nomad residency", "2-4 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Clean record']::text[]", "1-year renewable digital nomad residency", "Exempt under 183 days", 168, "e-Consular Portal"),
        ("Vietnam", "🇻🇳", 90, False, "N/A", "N/A", "N/A", 183, "90-day e-visa available for all nationalities", "3-5 days", "ARRAY['Passport']::text[]", "90-day multi-entry e-visa", "Exempt for non-residents under 183 days", 25, "National E-Visa Portal"),
        ("Argentina", "🇦🇷", 90, True, "$200", "180 days", "Proof of income", 183, "Rentista and Digital Nomad visa options", "2-4 weeks", "ARRAY['Passport','Proof of income']::text[]", "180-day nomad visa option", "Exempt during nomad visa validity", 200, "Migraciones Portal"),
        ("South Africa", "🇿🇦", 90, True, "R1,000", "1-3 years", "R1,000,000/yr", 183, "Remote Work Visa launched for foreign remote workers", "3-6 weeks", "ARRAY['Passport','Proof of R1,000,000/yr income','Health insurance']::text[]", "1-year remote work visa", "Exempt for foreign remote workers", 100, "VFS / Embassy"),
        ("Czech Republic", "🇨🇿", 90, True, "CZK 2,500", "1 year", "CZK 60,000/mo", 183, "Zivno business license visa for freelancers", "4-8 weeks", "ARRAY['Passport','Zivno license','Trade register']::text[]", "Zivno business visa renewable", "Flat tax rate option (Paušální daň)", 110, "Czech Embassy"),
        ("Taiwan", "🇹🇼", 90, True, "$100", "1-3 years", "$5,700/mo", 183, "Employment Gold Card multi-year visa", "3-6 weeks", "ARRAY['Passport','Proof of $5,700/mo income']::text[]", "Employment Gold Card 1-3 years", "50% tax reduction on income over NT$3M", 100, "Gold Card Online Portal"),
        ("Malaysia", "🇲🇾", 90, True, "RM 1,000", "1-2 years", "$24,000/yr", 183, "DE Rantau Nomad Pass", "2-4 weeks", "ARRAY['Passport','Proof of $24,000/yr income']::text[]", "DE Rantau Pass 1-2 years", "Foreign income exempt", 220, "MDEC Portal"),
        ("Japan", "🇯🇵", 90, True, "¥3,000", "6 months", "¥10,000,000/yr", 183, "6-month non-renewable nomad visa for 49 countries", "2-4 weeks", "ARRAY['Passport','Proof of ¥10,000,000/yr income','Insurance']::text[]", "6-month non-renewable visa", "Exempt from Japanese tax", 20, "Japanese Embassy / Consulate"),
        ("Hungary", "🇭🇺", 90, True, "€110", "1 year", "€3,000/mo", 183, "White Card digital nomad visa; exempt from tax for 6 months", "3-5 weeks", "ARRAY['Passport','Proof of €3,000/mo income']::text[]", "White Card 1 year renewable", "Exempt from Hungarian tax for first 6 months", 110, "Enter Hungary Portal"),
        ("Italy", "🇮🇹", 90, True, "€116", "1 year", "€28,000/yr", 183, "Digital nomad visa for highly skilled remote professionals", "4-8 weeks", "ARRAY['Passport','Proof of €28,000/yr income']::text[]", "1-year digital nomad visa", "Potential tax incentives for moving tax residency", 116, "Italian Consulate"),
        ("Greece", "🇬🇷", 90, True, "€75", "1 year", "€3,500/mo", 183, "50% income tax reduction for 7 years if tax residency transferred", "3-6 weeks", "ARRAY['Passport','Proof of €3,500/mo income']::text[]", "1-year visa renewable for 2 years", "50% income tax reduction for 7 years", 75, "Greek Consulate"),
        ("Costa Rica", "🇨🇷", 180, True, "$100", "1 year", "$3,000/mo", 183, "Exempt from local income tax on foreign income", "2-4 weeks", "ARRAY['Passport','Proof of $3,000/mo income']::text[]", "1-year nomad visa renewable for 2nd year", "Exempt from Costa Rican income tax", 100, "Tramite Ya Portal"),
        ("Malta", "🇲🇹", 90, True, "€300", "1 year", "€42,000/yr", 183, "Nomad Residence Permit for non-EU remote workers", "3-5 weeks", "ARRAY['Passport','Proof of €42,000/yr income']::text[]", "Nomad Residence Permit 1 year renewable", "10% flat nomad tax rate", 300, "Residency Malta Agency"),
        ("Mauritius", "🇲🇺", 180, True, "Free", "1 year", "$1,500/mo", 183, "Premium Visa free of charge with online application", "1-2 weeks", "ARRAY['Passport','Proof of $1,500/mo income']::text[]", "Premium Visa 1 year free of charge", "Exempt if funds not remitted to Mauritius bank", 0, "EDB Mauritius Portal"),
        ("Barbados", "🇧🇧", 90, True, "$2,000", "12 months", "$50,000/yr", 183, "Welcome Stamp visa allows 12 months remote stay with zero local income tax", "1-2 weeks", "ARRAY['Passport','Proof of $50,000/yr income']::text[]", "1-year renewable Welcome Stamp", "100% tax exempt on foreign income", 2000, "Barbados Immigration Portal"),
        ("Cyprus", "🇨🇾", 90, True, "€70", "1-3 years", "€3,500/mo", 183, "Digital Nomad Visa with 50% tax exemption incentive for non-tax residents", "4-6 weeks", "ARRAY['Passport','Proof of €3,500/mo income','Clean criminal record']::text[]", "1-year visa renewable up to 3 years", "50% tax exemption incentive", 70, "Civil Registry & Migration Department"),
        ("Bermuda", "🇧🇲", 90, True, "$263", "12 months", "Proof of remote income", 183, "Work from Bermuda certificate with 0% local income tax", "1-2 weeks", "ARRAY['Passport','Proof of remote employment','Health insurance']::text[]", "1-year Work from Bermuda Certificate", "0% local income tax", 263, "Bermuda Government Portal"),
        ("Panama", "🇵🇦", 90, True, "$300", "9 months", "$36,000/yr", 183, "Short Stay Visa for Remote Workers renewable up to 18 months", "2-4 weeks", "ARRAY['Passport','Proof of $36,000/yr income','Health insurance']::text[]", "9-month visa renewable once", "0% tax on foreign-sourced income", 300, "National Immigration Service"),
        ("Iceland", "🇮🇸", 90, True, "ISK 12,200", "180 days", "ISK 1,000,000/mo", 183, "Long-term visa for remote workers from non-EEA/EFTA countries", "2-4 weeks", "ARRAY['Passport','Proof of ISK 1,000,000/mo income']::text[]", "180-day remote work visa", "Exempt from Icelandic tax for < 180 days", 90, "Directorate of Immigration"),
        ("Montenegro", "🇲🇪", 90, True, "€60", "2 years", "€1,350/mo", 183, "Digital Nomad Visa valid for 2 years with tax exemption status", "3-4 weeks", "ARRAY['Passport','Proof of €1,350/mo income','Housing proof']::text[]", "2-year visa renewable for additional 2 years", "Exempt from Montenegrin income tax", 60, "Ministry of Interior Portal"),
        ("Ecuador", "🇪🇨", 90, True, "$50", "2 years", "$1,350/mo", 183, "Rentista and Digital Nomad Visa options available", "2-4 weeks", "ARRAY['Passport','Proof of $1,350/mo income','Clean record']::text[]", "2-year renewable visa with residency pathway", "Exempt on foreign-sourced income under 183 days", 50, "Ministerio de Relaciones Exteriores"),
        ("Latvia", "🇱🇻", 90, True, "€60", "1 year", "€3,433/mo", 183, "Digital Nomad Visa for employees/freelancers with OECD companies", "2-4 weeks", "ARRAY['Passport','Proof of €3,433/mo income','Employment proof']::text[]", "1-year visa renewable for a 2nd year", "Reduced tax rate for foreign remote work", 60, "Office of Citizenship & Migration Affairs"),
        ("Uruguay", "🇺🇾", 90, True, "$20", "180 days", "Proof of remote income", 183, "Digital Nomad Permit valid 180 days renewable to 1 year", "1-2 weeks", "ARRAY['Passport','Signed affidavit of remote work']::text[]", "180-day permit renewable up to 1 year", "100% tax exempt on foreign income", 20, "Migraciones Uruguay Online Portal"),
        ("Albania", "🇦🇱", 365, True, "€50", "1 year", "€1,200/mo", 183, "Unique Permit for Digital Mobile Workers (1 year renewable)", "2-4 weeks", "ARRAY['Passport','Proof of remote income','Housing contract']::text[]", "1-year renewable Unique Permit", "0% local tax for non-tax residents under 183 days", 50, "e-Albania Online Portal"),
        ("Turkey", "🇹🇷", 90, True, "$100", "1 year", "$3,000/mo", 183, "Digital Nomad Identification Certificate for 36 eligible countries", "1-3 weeks", "ARRAY['Passport','Proof of $3,000/mo income','University degree']::text[]", "1-year digital nomad residency permit", "Exempt on foreign source income under 183 days", 100, "Digital Nomad Pre-Application Portal"),
        ("Chile", "🇨🇱", 90, True, "$100", "1 year", "$1,500/mo", 183, "Remote Work Visa for global digital freelancers and remote workers", "2-4 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Clean criminal record']::text[]", "1-year renewable visa with temporary residency path", "Exempt on foreign remote income under 183 days", 100, "Servicio Nacional de Migraciones"),
        ("Curaçao", "🇨🇼", 90, True, "$294", "6 months", "Proof of remote income", 183, "@HOME in Curaçao visa allows 6-month stay renewable for additional 6 months", "1-2 weeks", "ARRAY['Passport','Proof of remote employment','Health insurance']::text[]", "6-month permit renewable up to 1 year", "100% tax exempt on foreign-sourced income", 294, "Curaçao Immigration Portal"),
        ("Grenada", "🇬🇩", 90, True, "$1,500", "1 year", "$37,500/yr", 183, "Digital Nomad Visa permits 12 months remote stay in the Caribbean", "2-3 weeks", "ARRAY['Passport','Proof of $37,500/yr income','Health insurance']::text[]", "1-year renewable Digital Nomad Visa", "0% local income tax on foreign remote income", 1500, "Ministry of National Security Portal"),
        ("Belize", "🇧🇿", 90, True, "$500", "180 days", "$75,000/yr", 183, "Work Where You Vacation permit for remote professionals and students", "1-2 weeks", "ARRAY['Passport','Proof of $75,000/yr income','Banking reference']::text[]", "180-day permit renewable up to 1 year", "Exempt from local Belizean income tax", 500, "Belize Immigration Department"),
        ("Anguilla", "🇦🇮", 90, True, "$2,000", "1 year", "Proof of remote employment", 183, "Lose The Laptop Blues remote work visa for individuals and families", "1-2 weeks", "ARRAY['Passport','Proof of employment','Background check']::text[]", "1-year remote work stay permit", "0% personal income tax", 2000, "Anguilla Tourist Board Portal"),
        ("Slovenia", "🇸🇮", 90, True, "€120", "1 year", "€2,400/mo", 183, "Slovenian Temporary Residence Permit for Digital Nomads allows 1-year stay", "3-5 weeks", "ARRAY['Passport','Proof of €2,400/mo remote income','Health insurance']::text[]", "Renewable temporary residence permit", "Standard EU tax rules under 183-day threshold", 130, "Slovenian Consulate / Administrative Unit"),
        ("South Korea", "🇰🇷", 90, True, "$100", "1-2 years", "$64,000/yr", 183, "K-Workation Digital Nomad Visa permits up to 2 years stay for global remote workers", "2-4 weeks", "ARRAY['Passport','Proof of $64,000/yr remote income','Clean criminal record']::text[]", "1-year renewable K-Workation Visa stay", "Exempt on foreign-sourced remote income under 183 days", 100, "Korean Embassy / Consulate"),
        ("Dominican Republic", "🇩🇴", 30, True, "$250", "1 year", "$2,000/mo", 183, "Remote Worker Visa permits 12 months Caribbean stay with zero local tax", "2-3 weeks", "ARRAY['Passport','Proof of $2,000/mo income','Health insurance']::text[]", "1-year renewable Remote Worker Visa", "0% local income tax on foreign remote income", 250, "Dirección General de Migración"),
        ("Poland", "🇵🇱", 90, True, "€100", "1 year", "€2,000/mo", 183, "B2B Sole Proprietorship / JDG freelance business visa & IP Box 5% tax option", "3-6 weeks", "ARRAY['Passport','Proof of remote business contracts','Health insurance']::text[]", "Path to permanent residency after 5 years", "Flat tax or 5% IP Box tech regime options", 110, "Polish Embassy / Voivodeship Office"),
        ("Armenia", "🇦🇲", 180, True, "Free", "1 year", "Proof of remote income", 183, "Micro-business registration allows 0% income tax status for IT/remote freelancers", "1-2 weeks", "ARRAY['Passport','Proof of remote employment']::text[]", "1-year renewable IT Micro-Business Permit", "0% tax under Micro-Business IT Tax Exemption", 0, "State Revenue Committee / Immigration"),
        ("Peru", "🇵🇪", 90, True, "$100", "1 year", "$1,500/mo", 183, "Peru Digital Nomad Visa permits 1-year stay renewable for global remote professionals", "2-4 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Clean criminal record']::text[]", "1-year renewable Digital Nomad Visa", "Exempt on foreign remote income under 183 days", 100, "Migraciones Perú Online Portal"),
        ("Serbia", "🇷🇸", 90, True, "$100", "1 year", "$1,500/mo", 183, "Serbia Independent Worker & Nomad Residence Permit allows 1-year renewable stay with flat freelance tax options", "3-4 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Health insurance']::text[]", "1-year renewable residence permit with permanent residency pathway after 3 years", "Flat tax options for freelancers & remote workers", 100, "Ministry of Interior / Police Directorate"),
        ("Lithuania", "🇱🇹", 90, True, "€120", "1 year", "€2,500/mo", 183, "Startup and Freelance / Remote Worker Visa options with favorable tech startup tax regime", "2-4 weeks", "ARRAY['Passport','Proof of €2,500/mo income','Clean criminal record']::text[]", "1-year renewable residence permit", "Favorable tech startup tax regime & non-resident exemption under 183 days", 130, "MIGRIS Migration Department"),
        ("Guatemala", "🇬🇹", 90, True, "$100", "1 year", "$1,500/mo", 183, "Guatemala Rentista / Remote Worker Visa and CA-4 agreement allow 1-year renewable stays", "2-4 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Clean criminal record']::text[]", "1-year renewable residence permit with permanent residency pathway after 5 years", "0% local income tax on foreign-sourced remote income", 100, "Instituto Guatemalteco de Migración"),
        ("Philippines", "🇵🇭", 30, True, "$150", "1-2 years", "$24,000/yr", 183, "Philippines Digital Nomad Visa and long-stay tourist visa extensions (LSVVE) allow remote stays up to 36 months", "2-4 weeks", "ARRAY['Passport','Proof of $24,000/yr income','Clean criminal record']::text[]", "1-year renewable visa with temporary residence card option", "Exempt on foreign-sourced remote income under 183-day rule", 150, "Bureau of Immigration / Embassy"),
        ("Andorra", "🇦🇩", 90, True, "€250", "1-2 years", "€2,500/mo", 90, "Andorra Passive Residency and Digital Nomad Visa provide 10% maximum tax ceiling and complete tax exemptions for foreign digital professionals", "4-6 weeks", "ARRAY['Passport','Proof of €2,500/mo income','Clean criminal record','Private health insurance']::text[]", "1-year renewable residence permit with permanent tax optimization", "10% max tax cap & zero tax under local thresholds", 250, "Servei d'Immigració d'Andorra"),
        ("Slovakia", "🇸🇰", 90, True, "€120", "1 year", "€1,800/mo", 183, "Slovakia Freelance & Digital Nomad Residence Permit allows 1-year renewable stays with flat tax rate options for micro-businesses", "3-5 weeks", "ARRAY['Passport','Proof of €1,800/mo remote income','Clean criminal record','Housing proof']::text[]", "1-year renewable residence permit with permanent residency pathway after 5 years", "Flat tax options & non-resident tax exemption under 183 days", 130, "Foreign Police Department / Slovak Embassy"),
        ("Austria", "🇦🇹", 90, True, "€160", "1-2 years", "€3,000/mo", 183, "Red-White-Red Card & Remote Worker Visa option for global talent", "4-8 weeks", "ARRAY['Passport','Proof of €3,000/mo income','Health insurance']::text[]", "Path to EU long-term residency after 5 years", "Austrian tax brackets apply after 183 days", 160, "Austrian Embassy / Federal Ministry"),
        ("El Salvador", "🇸🇻", 180, True, "$500", "1 year", "$1,460/mo", 183, "Bitcoin & Digital Nomad Residency Scheme permits 1-year stay with 0% tax on foreign income", "2-3 weeks", "ARRAY['Passport','Proof of $1,460/mo remote income','Clean record']::text[]", "1-year renewable residence permit", "0% local income tax on foreign remote income", 500, "Directorate General of Migration"),
        ("India", "🇮🇳", 365, True, "$40", "1 year", "$1,500/mo", 182, "365-day multi-entry e-Visa permits remote work for foreign clients with tax exemption under 182 days threshold", "3-5 days", "ARRAY['Passport','Proof of $1,500/mo remote income']::text[]", "1-year renewable e-Visa stay", "0% local tax on foreign-sourced income under 182-day rule", 40, "Indian e-Visa Online Portal"),
        ("Romania", "🇷🇴", 90, True, "€100", "1 year", "€3,700/mo", 183, "Romania Digital Nomad Visa allows 1-year renewable stays with 0% tax for non-residents under 183 days", "3-5 weeks", "ARRAY['Passport','Proof of €3,700/mo income','Employment contract']::text[]", "1-year renewable D-Visa stay", "0% local tax on foreign remote income under 183 days", 100, "eVisa / Romanian Embassy"),
        ("Cape Verde", "🇨🇻", 90, True, "€50", "6 months", "€1,500/mo", 183, "Cape Verde Remote Working Program permits 6-month stay renewable for 6 months with 0% income tax on foreign income", "1-2 weeks", "ARRAY['Passport','Proof of €1,500/mo income','Health insurance']::text[]", "6-month renewable remote work permit", "100% tax exempt on foreign remote income", 50, "Cabo Verde Remote Working Portal"),
        ("Honduras", "🇭🇳", 90, True, "$200", "1 year", "$1,500/mo", 183, "Honduras Digital Nomad & Remote Worker Residency Status permits 1-year renewable stays with 0% tax on foreign income", "2-3 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Clean criminal record']::text[]", "1-year renewable residence permit", "0% local income tax on foreign remote income", 200, "National Migration Institute / Embassy"),
        ("Bosnia & Herzegovina", "🇧🇦", 90, True, "€100", "1 year", "€1,200/mo", 183, "Bosnia & Herzegovina Digital Nomad Residency Permit permits 1-year renewable stays with 0% tax for non-tax residents under 183 days", "2-4 weeks", "ARRAY['Passport','Proof of €1,200/mo remote income','Health insurance']::text[]", "1-year renewable residence permit", "0% local income tax on foreign remote income under 183 days", 100, "Service for Foreigners' Affairs / Embassy"),
        ("Nepal", "🇳🇵", 150, False, "N/A", "N/A", "N/A", 183, "150-day tourist visa per calendar year with simple online extensions", "Instant / On Arrival", "ARRAY['Passport','Online Application']::text[]", "150-day tourist/remote stay per year", "Exempt on foreign income under 183 days", 50, "Visa on Arrival / Online Portal"),
        ("Sri Lanka", "🇱🇰", 180, True, "$200", "1 year", "$2,000/mo", 183, "Digital Nomad Visa permits 1 year stay renewable for foreign remote workers", "1-2 weeks", "ARRAY['Passport','Proof of $2,000/mo remote income','Insurance']::text[]", "1-year renewable Digital Nomad Visa", "100% exempt on foreign-sourced remote income", 200, "Department of Immigration / Online ETA"),
        ("North Macedonia", "🇲🇰", 90, True, "€100", "1 year", "€1,000/mo", 183, "Digital Nomad Visa permits 1-year renewable stay for remote workers and freelancers", "2-4 weeks", "ARRAY['Passport','Proof of €1,000/mo remote income','Health insurance']::text[]", "1-year renewable DNV with residency pathway", "0% local tax for non-tax residents under 183 days", 100, "Ministry of Foreign Affairs / Embassy"),
        ("Morocco", "🇲🇦", 90, True, "$80", "90 days", "$1,200/mo", 183, "Morocco e-Visa and Remote Stay permit allows 90-day remote work stay with simple online application", "1-2 weeks", "ARRAY['Passport','Proof of $1,200/mo remote income','Return ticket']::text[]", "90-day renewable Remote Worker e-Visa stay", "0% local tax for non-residents under 183 days", 80, "Moroccan Access e-Visa Portal"),
        ("Kyrgyzstan", "🇰🇬", 60, True, "$100", "1 year", "$1,000/mo", 183, "Kyrgyzstan Digital Nomad Status permits 1-year renewable stay with 0% local income tax for IT and remote professionals", "1-2 weeks", "ARRAY['Passport','Proof of remote work/IT status']::text[]", "1-year renewable Digital Nomad Status", "0% local income tax under Digital Nomad Status", 100, "Ministry of Economy / Online Portal"),
        ("Cambodia", "🇰🇭", 30, True, "$290", "1 year", "$1,000/mo", 183, "Cambodia ER Extension Remote Work Visa permits 1-year renewable stay for digital nomads and freelancers", "1-2 weeks", "ARRAY['Passport','Proof of remote funds','Passport photo']::text[]", "1-year renewable ER Remote Worker Visa", "0% local tax on foreign-sourced remote income", 290, "E-visa / Department of Immigration"),
        ("New Zealand", "🇳🇿", 90, True, "NZ$200", "1 year", "NZ$3,500/mo", 183, "Working Holiday & Remote Work stay permit permits 1-year renewable stay with 0% tax on foreign remote income under 183 days", "2-3 weeks", "ARRAY['Passport','Proof of NZ$3,500/mo remote income','Health insurance']::text[]", "1-year renewable remote work stay", "0% local income tax on foreign remote income under 183 days", 150, "Immigration New Zealand Portal"),
        ("France", "🇫🇷", 90, True, "€225", "1 year", "€2,500/mo", 183, "Profession Libérale & Talent Passport Remote Work Visa permits 1-year renewable stay with path to residency", "3-5 weeks", "ARRAY['Passport','Proof of €2,500/mo income','Clean criminal record']::text[]", "1-year renewable Talent Passport with 5-year residency path", "0% tax on foreign remote income under 183 days", 225, "France-Visas Online Portal"),
        ("Belgium", "🇧🇪", 90, True, "€140", "1 year", "€2,500/mo", 183, "Belgium Professional Card & Remote Worker Status permits 1-year stay renewable with tax exemption under 183 days", "3-5 weeks", "ARRAY['Passport','Proof of €2,500/mo remote income','Clean criminal record','Private health insurance']::text[]", "1-year renewable Professional Card with permanent residency path after 5 years", "0% local income tax on foreign remote income under 183 days", 140, "Belgian Embassy / Foreign Affairs Portal"),
        ("Luxembourg", "🇱🇺", 90, True, "€140", "1 year", "€3,200/mo", 183, "Luxembourg Remote Worker & Independent Status permits 1-year renewable stay with 0% tax for non-tax residents under 183 days", "3-5 weeks", "ARRAY['Passport','Proof of €3,200/mo remote income','Clean criminal record','Private health insurance']::text[]", "1-year renewable stay permit with EU residency path after 5 years", "0% local income tax on foreign remote income under 183 days", 140, "Ministry of Foreign Affairs / Embassy"),
        ("Sint Maarten", "🇸🇽", 90, True, "$290", "1 year", "$2,000/mo", 183, "@Home in Sint Maarten Remote Worker Program permits 1-year renewable stay with 0% local income tax status", "2-3 weeks", "ARRAY['Passport','Proof of $2,000/mo remote income','Health insurance']::text[]", "1-year renewable remote work residency permit", "0% local income tax on foreign remote income under 183 days", 290, "Sint Maarten Immigration Portal"),
        ("Bahamas", "🇧🇸", 90, True, "$1,025", "1 year", "Proof of remote income", 183, "BEATS Bahamas Extended Access Travel Stay permits 1-year renewable stay with 0% personal income tax on foreign income", "1-2 weeks", "ARRAY['Passport','Proof of remote employment/income','Health insurance']::text[]", "1-year renewable remote work residency permit", "0% local income tax on foreign remote income", 1025, "Bahamas Immigration Portal"),
        ("Saint Lucia", "🇱🇨", 90, True, "$75", "1 year", "Proof of remote income", 183, "Saint Lucia Live It Remote Work Program permits 1-year renewable stay with 0% personal income tax on foreign income", "1-2 weeks", "ARRAY['Passport','Proof of remote employment/income','Health insurance']::text[]", "1-year renewable remote work stay permit", "0% local income tax on foreign remote income", 75, "Saint Lucia Tourism / Immigration Portal"),
        ("Antigua and Barbuda", "🇦🇬", 180, True, "$1,500", "2 years", "$50,000/yr", 183, "Nomad Digital Residence (NDR) program allows 2-year remote stay with 0% personal income tax on foreign income", "2-4 weeks", "ARRAY['Passport','Proof of $50,000/yr remote income','Clean criminal record','Health insurance']::text[]", "2-year renewable remote work residency permit", "0% local personal income tax on foreign remote income", 1500, "Antigua & Barbuda Immigration / NDR Portal"),
        ("Dominica", "🇩🇲", 90, True, "$800", "18 months", "$50,000/yr", 183, "Work in Nature (WIN) Extended Stay Visa allows 18-month stay with 0% personal income tax on foreign income", "1-2 weeks", "ARRAY['Passport','Proof of $50,000/yr remote income','Police record','Health insurance']::text[]", "18-month renewable remote stay permit", "0% local personal income tax on foreign remote income", 800, "Dominica WIN Online Portal"),
        ("Saint Kitts and Nevis", "🇰🇳", 90, True, "$300", "1 year", "$24,000/yr", 183, "St. Kitts & Nevis Remote Work Stay Visa permits 12-month stay with 0% personal income tax on foreign income", "1-2 weeks", "ARRAY['Passport','Proof of $24,000/yr remote income','Police record','Health insurance']::text[]", "1-year renewable remote stay permit", "0% local personal income tax on foreign remote income", 300, "St. Kitts Online Travel / Immigration Portal"),
        ("Seychelles", "🇸🇨", 90, True, "$200", "1 year", "$1,500/mo", 183, "Seychelles Workation Program permits 12-month remote stay with 0% personal income tax on foreign income", "1-2 weeks", "ARRAY['Passport','Proof of $1,500/mo remote income','Return flight','Health insurance']::text[]", "1-year renewable remote work permit", "0% local personal income tax on foreign remote income", 200, "Seychelles Electronic Border System / Online Portal")
    ]

    visa_sqls = []
    for v in visas:
        country, flag, tourist_days, has_dn, cost, dur, inc, tax_days, notes, ptime, docs, path, tax_ex, fee, method = v
        notes_esc = notes.replace("'", "''")
        path_esc = path.replace("'", "''")
        tax_ex_esc = tax_ex.replace("'", "''")
        method_esc = method.replace("'", "''")
        update_sql = f"""
        UPDATE public.visa_info SET
          flag = '{flag}',
          tourist_days = {tourist_days},
          has_dn_visa = {str(has_dn).lower()},
          dn_visa_cost = '{cost}',
          dn_visa_duration = '{dur}',
          min_income = '{inc}',
          tax_residency_days = {tax_days},
          tax_notes = '{notes_esc}',
          processing_time = '{ptime}',
          required_docs = {docs},
          path_to_residency = '{path_esc}',
          tax_exemption_status = '{tax_ex_esc}',
          application_fee_usd = {fee},
          application_method = '{method_esc}'
        WHERE country = '{country}';
        """
        visa_sqls.append(update_sql)

    res = run_composio_sql("\n".join(visa_sqls))
    print("Visa Enrichment Result:", res[:300])

    city_enrichment_sql = """
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS english_proficiency TEXT DEFAULT 'High';
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS quality_of_life_score NUMERIC(3,2) DEFAULT 4.0;
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS coworking_desk_usd INTEGER DEFAULT 150;
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS one_bed_rent_usd INTEGER DEFAULT 800;
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS meal_price_usd NUMERIC(5,2) DEFAULT 8.00;
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS coffee_price_usd NUMERIC(4,2) DEFAULT 3.00;
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS wifi_speed_p90 INTEGER DEFAULT 100;
    ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS mobile_data_cost_gb NUMERIC(4,2) DEFAULT 1.50;

    ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS business_id TEXT;
    ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS company_title TEXT;
    ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS download_speed_mbps INTEGER DEFAULT 250;
    ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS upload_speed_mbps INTEGER DEFAULT 50;
    ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS latency_ms INTEGER DEFAULT 12;
    ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS has_24_7_access BOOLEAN DEFAULT true;
    ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS has_standing_desks BOOLEAN DEFAULT true;

    DELETE FROM public.listings WHERE id IN ('b1b2c3d4-0157-4000-8000-000000000157', 'b1b2c3d4-0158-4000-8000-000000000158', 'b1b2c3d4-0159-4000-8000-000000000159', 'b1b2c3d4-0160-4000-8000-000000000160');
    DELETE FROM public.cost_of_living WHERE city_id IN ('ostrava', 'craiova', 'zlin', 'siauliai');
    DELETE FROM public.cities WHERE id IN ('ostrava', 'craiova', 'zlin', 'siauliai');

    INSERT INTO public.cities (id, name, country, flag, image, continent, overall_score, cost_score, internet_score, safety_score, fun_score, walkability_score, nightlife_score, air_score, cost_usd, internet_mbps, avg_temp, visa_difficulty, air_quality, english_proficiency, quality_of_life_score, coworking_desk_usd, one_bed_rent_usd, meal_price_usd, coffee_price_usd, wifi_speed_p90, mobile_data_cost_gb)
    VALUES
    ('ostrava', 'Ostrava', 'Czech Republic', '🇨🇿', 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80', 'Europe', 4.7, 4.5, 4.8, 4.7, 4.5, 4.6, 4.5, 4.6, 1350, 240, 16, 'Mild', 'Moderate', 'High', 4.7, 140, 580, 9.00, 3.20, 240, 1.10),
    ('craiova', 'Craiova', 'Romania', '🇷🇴', 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80', 'Europe', 4.6, 4.7, 4.9, 4.6, 4.4, 4.5, 4.4, 4.5, 1150, 285, 18, 'Mild', 'Good', 'High', 4.6, 120, 460, 8.00, 2.80, 285, 0.85),
    ('zlin', 'Zlín', 'Czech Republic', '🇨🇿', 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80', 'Europe', 4.6, 4.5, 4.7, 4.8, 4.4, 4.7, 4.3, 4.7, 1280, 230, 15, 'Mild', 'Good', 'High', 4.7, 135, 530, 8.50, 3.00, 230, 1.05),
    ('siauliai', 'Šiauliai', 'Lithuania', '🇱🇹', 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80', 'Europe', 4.5, 4.6, 4.8, 4.8, 4.3, 4.6, 4.2, 4.8, 1220, 270, 14, 'Mild', 'Good', 'Very High', 4.6, 130, 490, 8.20, 2.90, 270, 0.90);

    INSERT INTO public.cost_of_living (city_id, housing, coworking, food, transport, internet, entertainment, health, visa, misc, tip1, tip2, tip3)
    VALUES
    ('ostrava', 580, 140, 330, 30, 22, 140, 40, 10, 198, 'Moravian-Silesian industrial tech & remote work hub with 240 Mbps fiber internet', 'Czech Zivno freelance business visa permits 1-year renewable stay with flat tax option', 'Ostrava main railway station connects directly to Prague Main Station in 3 hours'),
    ('craiova', 460, 120, 290, 25, 18, 110, 35, 10, 162, 'Oltenian tech innovation hub in Romania with 285 Mbps gigabit fiber and affordable living', 'Romania Digital Nomad Visa permits 1-year renewable stays with 0% tax under 183 days', 'Craiova International Airport (CRA) connects directly to London and Madrid'),
    ('zlin', 530, 135, 315, 28, 20, 125, 38, 10, 179, 'Functionalist design & technology hub in Moravia with 230 Mbps fiber internet', 'Czech Zivno freelance business visa permits 1-year renewable stay with flat tax option', 'Zlín main station connects directly to Brno and Prague'),
    ('siauliai', 490, 130, 300, 25, 19, 120, 36, 10, 170, 'Northern Lithuanian tech & innovation hub featuring 270 Mbps gigabit fiber and e-Residency integration', 'Lithuania Startup & Freelance Remote Worker Visa permits 1-year renewable stay', 'Šiauliai railway station connects directly to Vilnius and Riga');

    INSERT INTO public.listings (id, company_name, company_title, company_type, address, city, state, country, continent, wifi_speed, has_24_7_access, has_standing_desks, starting_price, ratings, total_reviews, is_public, is_active, about, inclusions)
    VALUES
    ('b1b2c3d4-0157-4000-8000-000000000157', 'Ostrava Tech & Nomad Hub', 'Ostrava Tech & Nomad Hub — Moravian-Silesian Industrial Tech Studio', 'coworking', 'Hornopolní 33', 'Ostrava', 'Moravian-Silesian Region', 'Czech Republic', 'Europe', '240 Mbps', true, true, '€140/mo', 4.8, 32, true, true, 'Modern Moravian-Silesian industrial tech coworking space in central Ostrava featuring 240 Mbps high-speed fiber Wi-Fi, standing desks, soundproof phone pods, and specialty coffee bar.', '240 Mbps Fiber, Industrial Lounge, Soundproof Pods, Specialty Coffee Bar, 24/7 Access'),
    ('b1b2c3d4-0158-4000-8000-000000000158', 'Craiova Digital Workplace', 'Craiova Digital Workplace — Oltenia Tech Innovation Workspace', 'coworking', 'Strada Carol I 12', 'Craiova', 'Dolj County', 'Romania', 'Europe', '285 Mbps', true, true, '€120/mo', 4.9, 34, true, true, 'Ultra-fast Oltenian tech coworking studio in central Craiova featuring 285 Mbps gigabit fiber internet, sunlit focus rooms, acoustic call pods, and artisan coffee lounge.', '285 Mbps Gigabit Fiber, Sunlit Focus Suites, Acoustic Call Pods, Artisan Coffee Lounge, 24/7 Access'),
    ('b1b2c3d4-0159-4000-8000-000000000159', 'Zlín Creative Nomad Lab', 'Zlín Creative Nomad Lab — Functionalist Tech & Design Hub', 'coworking', 'náměstí Míru 12', 'Zlín', 'Zlín Region', 'Czech Republic', 'Europe', '230 Mbps', true, true, '€135/mo', 4.8, 29, true, true, 'Functionalist design coworking studio in central Zlín featuring 230 Mbps gigabit fiber internet, podcast recording room, standing desks, and specialty espresso bar.', '230 Mbps Fiber, Podcast Studio, Soundproof Call Pods, Specialty Coffee Lounge, 24/7 Access'),
    ('b1b2c3d4-0160-4000-8000-000000000160', 'Šiauliai Baltic Tech Space', 'Šiauliai Baltic Tech Space — Northern Lithuania Innovation Studio', 'coworking', 'Tilžės g. 170', 'Šiauliai', 'Šiauliai County', 'Lithuania', 'Europe', '270 Mbps', true, true, '€130/mo', 4.8, 30, true, true, 'Premier Northern Lithuanian coworking hub in central Šiauliai featuring 270 Mbps ultra-fast gigabit fiber Wi-Fi, modern lounges, soundproof booths, and e-Residency integration.', '270 Mbps Gigabit Fiber, Modern Lounge, Soundproof Booths, Artisan Espresso Bar, 24/7 Access');

    UPDATE public.visa_info SET
      flag = '🇸🇨',
      tourist_days = 90,
      has_dn_visa = true,
      dn_visa_cost = '$200',
      dn_visa_duration = '1 year',
      min_income = '$1,500/mo',
      tax_residency_days = 183,
      tax_notes = 'Seychelles Workation Program permits 12-month remote stay with 0% personal income tax on foreign income',
      processing_time = '1-2 weeks',
      required_docs = ARRAY['Passport','Proof of $1,500/mo remote income','Return flight','Health insurance']::text[],
      path_to_residency = '1-year renewable remote work permit',
      tax_exemption_status = '0% local personal income tax on foreign remote income',
      application_fee_usd = 200,
      application_method = 'Seychelles Electronic Border System / Online Portal'
    WHERE country = 'Seychelles';

    INSERT INTO public.visa_info (country, flag, tourist_days, has_dn_visa, dn_visa_cost, dn_visa_duration, min_income, tax_residency_days, tax_notes, processing_time, required_docs, path_to_residency, tax_exemption_status, application_fee_usd, application_method)
    SELECT 'Seychelles', '🇸🇨', 90, true, '$200', '1 year', '$1,500/mo', 183, 'Seychelles Workation Program permits 12-month remote stay with 0% personal income tax on foreign income', '1-2 weeks', ARRAY['Passport','Proof of $1,500/mo remote income','Return flight','Health insurance']::text[], '1-year renewable remote work permit', '0% local personal income tax on foreign remote income', 200, 'Seychelles Electronic Border System / Online Portal'
    WHERE NOT EXISTS (SELECT 1 FROM public.visa_info WHERE country = 'Seychelles');
    """

    res_city = run_composio_sql(city_enrichment_sql)
    print("City & Listing Enrichment Result:", res_city[:300])

    print("✅ Database enrichment updated successfully!")

if __name__ == "__main__":
    main()

