"use client";

import Link from "next/link";
import { ArrowRight, Hourglass, LogOut } from "lucide-react";
import appConfig from "@/app.config";
import { useLang } from "@/components/i18n/language-provider";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { formatDate } from "@/lib/utils";
import { TRIAL_DAYS } from "@/lib/trial";

/** The lock screen shown once the free trial is over. Nothing is deleted — say so. */
export function TrialEnded({ email, endedAt }: { email: string; endedAt: string }) {
  const { lang } = useLang();
  const tr = lang === "tr";
  const ended = formatDate(endedAt, { day: "numeric", month: "long", year: "numeric" }, tr ? "tr-TR" : "en-US");

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" aria-label={appConfig.name}>
          <Logo />
        </Link>
        <LanguageToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-soft">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Hourglass className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
            {tr ? "Ücretsiz deneme süren doldu" : "Your free trial has ended"}
          </h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
            {tr
              ? `${TRIAL_DAYS} günlük deneme ${ended} tarihinde bitti. Ürünlerin, rakiplerin ve kuralların silinmedi; bir paket seçtiğinde kaldığın yerden devam edersin.`
              : `Your ${TRIAL_DAYS}-day trial ended on ${ended}. Your products, rivals and rules haven't been deleted — pick a plan and you carry on where you left off.`}
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/#pricing"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {tr ? "Paketleri gör" : "See the plans"} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:hello@${appConfig.domain}?subject=${encodeURIComponent(tr ? "Paket seçmek istiyorum" : "I'd like to pick a plan")}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {tr ? "Bize yaz, hesabını açalım" : "Email us to unlock your account"}
            </a>
          </div>

          <form action="/auth/signout" method="post" className="mt-6 border-t border-border pt-4">
            {email && <p className="text-[12.5px] text-muted-foreground">{email}</p>}
            <button
              type="submit"
              className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              {tr ? "Çıkış yap" : "Sign out"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
