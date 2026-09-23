"use client";

/**
 * Settings, in four blocks, ordered by how often you'd actually touch them:
 * your account (writes to Supabase), the repricing safety defaults (the same
 * state the topbar stop uses), the brand (build-time, and the page says so
 * instead of offering dead inputs), and integration status.
 */

import { useState } from "react";
import { CheckCircle2, CircleDashed, Loader2, Lock, OctagonX, ShieldCheck } from "lucide-react";
import appConfig from "@/app.config";
import { useAppState } from "@/components/app/app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface SettingsAccount {
  id: string;
  email: string;
  fullName: string;
  storeName: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function SettingsClient({
  connected,
  account,
}: {
  connected: Record<string, boolean>;
  account: SettingsAccount | null;
}) {
  const { t, ui, lang } = useLang();
  const { autopilot, setAutopilot } = useAppState();

  const [fullName, setFullName] = useState(account?.fullName ?? "");
  const [storeName, setStoreName] = useState(account?.storeName ?? "");
  const [save, setSave] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dirty =
    account !== null && (fullName !== account.fullName || storeName !== account.storeName);

  async function saveProfile() {
    if (!account) return;
    const supabase = createClient();
    if (!supabase) return;

    setSave("saving");
    setErrorMsg(null);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: account.id, full_name: fullName, store_name: storeName });

    if (error) {
      setErrorMsg(error.message);
      setSave("error");
      return;
    }
    setSave("saved");
    window.setTimeout(() => setSave("idle"), 2500);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* ── Account ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>{ui.account}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {account
              ? lang === "tr"
                ? "Bu bilgiler senin hesabına kayıtlı ve yalnızca sen görürsün."
                : "Saved against your account, visible only to you."
              : lang === "tr"
                ? "Örnek hesaptasın — burada kaydedilecek gerçek bir hesap yok. Kendi hesabını açınca bu alanlar çalışır."
                : "You're in the sample account — there's no real account to save to. These fields work once you create your own."}
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{ui.email}</Label>
            <Input value={account?.email ?? "demo@pricenova.io"} readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">{ui.fullName}</Label>
            <Input
              id="fullName"
              value={fullName}
              disabled={!account}
              placeholder={lang === "tr" ? "Adın Soyadın" : "Jane Doe"}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="storeName">{lang === "tr" ? "Mağaza adı" : "Store name"}</Label>
            <Input
              id="storeName"
              value={storeName}
              disabled={!account}
              placeholder={lang === "tr" ? "Mağazanın adı" : "Your store"}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[12.5px] font-medium text-destructive sm:col-span-2">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button onClick={saveProfile} disabled={!dirty || save === "saving"} className="gap-2">
              {save === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
              {ui.saveChanges}
            </Button>
            {save === "saved" && (
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-success">
                <CheckCircle2 className="h-4 w-4" />
                {lang === "tr" ? "Kaydedildi" : "Saved"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Repricing safety ────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>{lang === "tr" ? "Fiyatlandırma güvenliği" : "Repricing safety"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {lang === "tr"
              ? "Aynı düğme üst barda da duruyor — hangisini kullanırsan kullan sonuç aynı."
              : "The same switch lives in the top bar — either one has the same effect."}
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "flex flex-wrap items-center gap-4 rounded-xl border p-4",
              autopilot ? "border-border bg-muted/30" : "border-destructive/30 bg-destructive/5",
            )}
          >
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                autopilot ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {autopilot ? <ShieldCheck className="h-5 w-5" /> : <OctagonX className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {autopilot
                  ? lang === "tr" ? "Otomatik fiyatlandırma açık" : "Automatic repricing is on"
                  : lang === "tr" ? "Otomatik fiyat değişiklikleri durduruldu" : "Automatic price changes are stopped"}
              </p>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                {lang === "tr"
                  ? "Kapalıyken rakip takibi ve uyarılar çalışmaya devam eder; yalnızca fiyat yazma durur."
                  : "While off, tracking and alerts keep running — only price writing stops."}
              </p>
            </div>
            <Button
              variant={autopilot ? "outline" : "primary"}
              onClick={() => setAutopilot(!autopilot)}
              className="gap-2"
            >
              {autopilot
                ? lang === "tr" ? "Hepsini durdur" : "Stop everything"
                : lang === "tr" ? "Yeniden başlat" : "Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Brand (build-time) ──────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {ui.brand}
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              <Lock className="h-3 w-3" />
              {lang === "tr" ? "salt okunur" : "read-only"}
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{ui.brandHint}</p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{ui.productName}</Label>
            <Input defaultValue={appConfig.name} readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label>{ui.domain}</Label>
            <Input defaultValue={appConfig.domain} readOnly disabled />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{ui.tagline}</Label>
            <Input defaultValue={t(appConfig.tagline)} readOnly disabled />
          </div>
        </CardContent>
      </Card>

      {/* ── Integrations ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>{ui.integrations}</CardTitle>
          <p className="text-sm text-muted-foreground">{ui.integrationsHint}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {appConfig.integrations.map((it) => (
            <div key={it.key} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Icon name="plug" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{it.name}</p>
                  {it.required && <Badge tone="warning">{ui.required}</Badge>}
                </div>
                <p className="truncate text-sm text-muted-foreground">{it.purpose}</p>
              </div>
              {connected[it.key] ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" /> {ui.connected}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <CircleDashed className="h-4 w-4" /> {ui.demoMode}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
