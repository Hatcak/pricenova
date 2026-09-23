import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Returns null when the keys are missing (demo mode).
 *
 * `cookies()` is async in this version of Next, hence the await.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          /**
           * Called from a Server Component, where cookies are read-only. The
           * proxy refreshes the session on every request, so it's safe to
           * swallow this.
           */
        }
      },
    },
  });
}

/** The signed-in user, or null in demo mode / when signed out. */
export async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}
