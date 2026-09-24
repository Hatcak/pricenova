import appConfig from "@/app.config";
import { SettingsClient, type WorkspaceSettings } from "@/components/app/settings-client";
import { createClient, getUser } from "@/lib/supabase/server";

/** Matches the defaults in supabase/schema.sql, used until a row exists. */
const DEFAULTS: WorkspaceSettings = {
  defaultRuleMode: "approval",
  floorMarginPct: 10,
  maxDailyChanges: 50,
  notifyEmail: true,
  notifySlack: false,
  notifyDropPct: 1,
  notifyLostLead: true,
  notifyStockOut: true,
  digestFrequency: "weekly",
};

/**
 * An integration counts as "connected" when every env var it needs is set.
 * Account and workspace rows are simply null/defaults in demo mode.
 */
export default async function SettingsPage() {
  const connected: Record<string, boolean> = {};
  for (const it of appConfig.integrations) {
    connected[it.key] = it.envVars.every((v) => !!process.env[v]);
  }

  const user = await getUser();
  let profile: { full_name: string | null; store_name: string | null } | null = null;
  let workspace = DEFAULTS;

  if (user) {
    const supabase = await createClient();
    if (supabase) {
      const [{ data: p }, { data: w }] = await Promise.all([
        supabase.from("profiles").select("full_name, store_name").eq("id", user.id).maybeSingle(),
        supabase.from("workspace_settings").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      profile = p ?? null;
      if (w) {
        workspace = {
          defaultRuleMode: w.default_rule_mode ?? DEFAULTS.defaultRuleMode,
          floorMarginPct: Number(w.floor_margin_pct ?? DEFAULTS.floorMarginPct),
          maxDailyChanges: Number(w.max_daily_changes ?? DEFAULTS.maxDailyChanges),
          notifyEmail: w.notify_email ?? DEFAULTS.notifyEmail,
          notifySlack: w.notify_slack ?? DEFAULTS.notifySlack,
          notifyDropPct: Number(w.notify_drop_pct ?? DEFAULTS.notifyDropPct),
          notifyLostLead: w.notify_lost_lead ?? DEFAULTS.notifyLostLead,
          notifyStockOut: w.notify_stock_out ?? DEFAULTS.notifyStockOut,
          digestFrequency: w.digest_frequency ?? DEFAULTS.digestFrequency,
        };
      }
    }
  }

  return (
    <SettingsClient
      connected={connected}
      workspace={workspace}
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
