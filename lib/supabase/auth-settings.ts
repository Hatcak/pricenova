import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Which sign-in methods this Supabase project actually has switched on.
 *
 * Without this the auth screen would show Google and GitHub buttons that throw
 * "provider is not enabled" the moment anyone clicks them. Supabase publishes
 * the answer at /auth/v1/settings, so we ask rather than guess.
 */
export interface AuthProviders {
  google: boolean;
  github: boolean;
  /** Email + password. False when the project runs on OAuth alone. */
  email: boolean;
}

const NONE: AuthProviders = { google: false, github: false, email: false };

export async function getAuthProviders(): Promise<AuthProviders> {
  // Demo mode: the form doesn't sign anyone in, so show the email fields only.
  if (!isSupabaseConfigured()) return { ...NONE, email: true };

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      // Providers change rarely; don't pay for this on every page view.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { ...NONE, email: true };

    const settings = (await res.json()) as {
      external?: Record<string, boolean>;
    };
    const external = settings.external ?? {};
    return {
      google: external.google === true,
      github: external.github === true,
      email: external.email !== false,
    };
  } catch {
    // Unreachable Supabase — fall back to the email form rather than an
    // empty screen with no way in at all.
    return { ...NONE, email: true };
  }
}
