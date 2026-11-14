import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when real values (not the .env.example placeholders) are present. */
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("your-project-ref") && anonKey !== "your-anon-key",
);

export const supabaseUrl = url ?? "";
export const supabaseAnonKey = anonKey ?? "";

/** For server components: read-only, no session storage. */
export function createPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let browserClient: SupabaseClient | null = null;

/** For the admin area: keeps the login session in the browser. */
export function getBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  browserClient ??= createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
