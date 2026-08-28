import { createClient } from "@supabase/supabase-js";

// Listings live in PranavProject (`davvpymbybvniexmkgcu`), not the later
// Composio-connected empty project. Prefer env when it already points at
// that host; otherwise pin the listings project so /workspaces cannot
// render 0 rows because NEXT_PUBLIC_* was aimed at the wrong ref.
const LISTINGS_SUPABASE_URL = "https://davvpymbybvniexmkgcu.supabase.co";
const LISTINGS_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdnZweW1ieWJ2bmlleG1rZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDkyNzYsImV4cCI6MjA5NjkyNTI3Nn0.am0GEETtim_xQiwoGiHmBduCzzITnS8mpAruCrDUPdU";

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const envPointsAtListings = envUrl.includes("davvpymbybvniexmkgcu");

const supabaseUrl = envPointsAtListings && envUrl ? envUrl : LISTINGS_SUPABASE_URL;
const supabaseAnonKey = envPointsAtListings && envKey ? envKey : LISTINGS_SUPABASE_ANON_KEY;


/**
 * Single shared Supabase client using the public anon key.
 * Safe to use in both server components and client components —
 * access is governed entirely by Row Level Security policies on the
 * `PranavProject` (Nomads Travel) database.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
