/**
 * Supabase wiring, with demo mode as the fallback.
 *
 * The whole kit is built so that missing keys are a normal state, not an
 * error: with no URL + anon key the app keeps rendering from lib/demo/data.ts
 * and the auth screens keep their demo bypass. Everything that talks to
 * Supabase therefore checks `isSupabaseConfigured()` first.
 *
 * These two must stay as direct `process.env.NEXT_PUBLIC_*` member reads —
 * that's what lets Next inline them into the browser bundle at build time.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True once both public keys are present. Safe to call on client or server. */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

/** Cookie that marks a demo visit, readable by the proxy as well as the app. */
export const DEMO_COOKIE = "pn_demo";
