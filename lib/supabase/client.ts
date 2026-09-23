"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Supabase client for the browser. Returns null when the keys are missing, so
 * callers can fall back to demo behaviour instead of crashing:
 *
 *   const supabase = createClient();
 *   if (!supabase) return enterDemo();
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
