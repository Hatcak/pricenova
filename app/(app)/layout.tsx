import { AppStateProvider } from "@/components/app/app-state";
import { AppBanners } from "@/components/app/banners";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { getUser } from "@/lib/supabase/server";
import { getTrialStatus } from "@/lib/trial";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // null in demo mode — the sidebar falls back to the sample identity.
  const user = await getUser();
  const account = user
    ? {
        name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "",
        email: user.email ?? "",
      }
    : null;
  // The lock itself lives in proxy.ts; this only drives the countdown banner.
  const trial = user ? getTrialStatus(user) : null;

  return (
    <AppStateProvider>
      <div className="flex h-dvh overflow-hidden bg-background">
        <Sidebar account={account} />
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* faint sky wash at the very top of the app */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64"
            style={{ background: "var(--grad-cloud)" }}
            aria-hidden
          />
          <Topbar />
          <AppBanners trialDaysLeft={trial?.state === "trial" ? trial.daysLeft : undefined} />
          <main className="relative z-10 flex-1 overflow-y-auto p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </AppStateProvider>
  );
}
