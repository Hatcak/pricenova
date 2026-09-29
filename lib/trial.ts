import type { User } from "@supabase/supabase-js";

/**
 * The free trial: every new account gets full access for TRIAL_DAYS, counted
 * from the moment it was created. After that the dashboard is locked until the
 * account is on a paid plan.
 *
 * There's no billing integration yet, so "paid" is a flag you set by hand in
 * Supabase → Authentication → Users → (user) → raw app metadata:
 *   { "plan": "growth" }
 * app_metadata is only writable with the service-role key, so a user can't
 * grant themselves a plan from the browser. Swap this check for your billing
 * provider's subscription status once one is wired.
 *
 * Marketing copy says "3 gün" / "3-day" in a few places — keep them in step
 * if you change this number.
 */
export const TRIAL_DAYS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

export type TrialStatus =
  | { state: "paid" }
  | { state: "trial"; endsAt: string; daysLeft: number }
  | { state: "expired"; endsAt: string };

export function getTrialStatus(user: Pick<User, "created_at" | "app_metadata">, now = Date.now()): TrialStatus {
  const plan = user.app_metadata?.plan;
  if (typeof plan === "string" && plan !== "" && plan !== "trial") return { state: "paid" };

  const ends = new Date(user.created_at).getTime() + TRIAL_DAYS * DAY_MS;
  const endsAt = new Date(ends).toISOString();
  if (Number.isNaN(ends) || now >= ends) return { state: "expired", endsAt };
  return { state: "trial", endsAt, daysLeft: Math.ceil((ends - now) / DAY_MS) };
}
