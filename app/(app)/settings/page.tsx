import appConfig from "@/app.config";
import { SettingsClient } from "@/components/app/settings-client";
import { createClient, getUser } from "@/lib/supabase/server";

/**
 * An integration counts as "connected" when every env var it needs is set.
 * The account block needs the signed-in user and their profile row, both of
 * which are simply null in demo mode.
 */
export default async function SettingsPage() {
  const connected: Record<string, boolean> = {};
  for (const it of appConfig.integrations) {
    connected[it.key] = it.envVars.every((v) => !!process.env[v]);
  }

  const user = await getUser();
  let profile: { full_name: string | null; store_name: string | null } | null = null;

  if (user) {
    const supabase = await createClient();
    const { data } = await supabase!
      .from("profiles")
      .select("full_name, store_name")
      .eq("id", user.id)
      .maybeSingle();
    profile = data ?? null;
  }

  return (
    <SettingsClient
      connected={connected}
      account={
        user
          ? {
              id: user.id,
              email: user.email ?? "",
              fullName: profile?.full_name ?? "",
              storeName: profile?.store_name ?? "",
            }
          : null
      }
    />
  );
}
