import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TrialEnded } from "@/components/auth/trial-ended";
import { getUser } from "@/lib/supabase/server";
import { getTrialStatus } from "@/lib/trial";

export const metadata: Metadata = {
  title: "Deneme süren doldu | PriceNova",
  robots: { index: false, follow: false },
};

/**
 * Where proxy.ts sends a signed-in user whose free trial is over. Anyone who
 * lands here and isn't in that state is sent on to where they belong, so the
 * page can't be reached by accident.
 */
export default async function TrialEndedPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const status = getTrialStatus(user);
  if (status.state !== "expired") redirect("/dashboard");

  return <TrialEnded email={user.email ?? ""} endedAt={status.endsAt} />;
}
