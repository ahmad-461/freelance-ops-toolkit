import { createClient } from "@supabase/supabase-js";

// We fallback to safe dummy strings during build-time so Next.js static generation does not crash
// if environment variables are not supplied in the build pipeline.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
