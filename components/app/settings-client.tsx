"use client";

/**
 * Settings, as five tabs rather than one long scroll.
 *
 * The order is how often you'd touch them: your account, the pricing rules
 * that can move money, where alerts go, what's wired up, and finally the brand
 * values that are fixed at build time. Each tab saves on its own, so a change
 * in one is never held hostage by an unfinished edit in another.
 *
 * Account writes to `profiles`; pricing and notifications write to
 * `workspace_settings`. In demo mode there's no row to write to, so the inputs
 * are disabled and the tab says why instead of failing silently.
 */

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  CircleDashed,
  Handshake,
  Loader2,
  Lock,
  OctagonX,
  Plug,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react";
import appConfig from "@/app.config";
import { useAppState } from "@/components/app/app-state";
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

export interface WorkspaceSettings {
  defaultRuleMode: "auto" | "approval";
  floorMarginPct: number;
  maxDailyChanges: number;
  notifyEmail: boolean;
  notifySlack: boolean;
  notifyDropPct: number;
  notifyLostLead: boolean;
  notifyStockOut: boolean;
  digestFrequency: "off" | "daily" | "weekly" | string;
}

type TabKey = "account" | "pricing" | "notifications" | "integrations" | "brand";
type SaveState = "idle" | "saving" | "saved" | "error";

export function SettingsClient({
  connected,
  account,
  workspace,
}: {
  connected: Record<string, boolean>;
  account: SettingsAccount | null;
  workspace: WorkspaceSettings;
}) {
  const { t, ui, lang } = useLang();
  const { autopilot, setAutopilot } = useAppState();
  const [tab, setTab] = useState<TabKey>("account");

  const live = account !== null;

  const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "account", label: ui.account, icon: <UserRound className="h-4 w-4" /> },
    { key: "pricing", label: lang === "tr" ? "Fiyatlandırma" : "Pricing", icon: <Wand2 className="h-4 w-4" /> },
    { key: "notifications", label: lang === "tr" ? "Bildirimler" : "Notifications", icon: <Bell className="h-4 w-4" /> },
    { key: "integrations", label: ui.integrations, icon: <Plug className="h-4 w-4" /> },
    { key: "brand", label: ui.brand, icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-250 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">{ui.settings}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {live
            ? lang === "tr"
              ? "Hesabın, fiyatlandırma kuralların ve uyarıların."
              : "Your account, your pricing rules and your alerts."
            : lang === "tr"
              ? "Örnek hesaptasın — değişiklikler kaydedilmez."
              : "You're in the sample account — changes aren't saved."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[210px_1fr]">
        {/* Tab rail — vertical on desktop, a scrolling row on phones */}
        <nav className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                "inline-flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors md:w-full",
                tab === tb.key
                  ? "nav-pill-active text-foreground"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )}
            >
              <span className={tab === tb.key ? "text-primary" : "text-muted-foreground"}>{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {tab === "account" && <AccountTab account={account} />}
          {tab === "pricing" && (
            <PricingTab
              workspace={workspace}
              account={account}
              autopilot={autopilot}
              setAutopilot={setAutopilot}
            />
          )}
          {tab === "notifications" && <NotificationsTab workspace={workspace} account={account} />}
          {tab === "integrations" && <IntegrationsTab connected={connected} />}
          {tab === "brand" && <BrandTab tagline={t(appConfig.tagline)} />}
        </div>
      </div>
    </div>
  );
}

/* ── Shared shell so every tab looks the same ──────────────────────────────── */
function Panel({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="border-b border-border p-5">
        <h2 className="font-display text-[15px] font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-5 p-5">{children}</div>
      {footer && <div className="flex items-center gap-3 border-t border-border p-5">{footer}</div>}
    </section>
  );
}

/** A labelled on/off row — the shape most settings actually take. */
function Toggle({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border p-3.5 transition-colors",
        disabled ? "cursor-not-allowed opacity-60" : "hover:bg-muted/40",
      )}
    >
      <span className="min-w-0">
        <span className="block text-[13.5px] font-semibold leading-tight">{label}</span>
        {hint && <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">{hint}</span>}
      </span>
      <span className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-10 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow-pill transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

function SaveRow({
  state,
  error,
  disabled,
  onSave,
  savedLabel,
  saveLabel,
}: {
  state: SaveState;
  error: string | null;
  disabled: boolean;
  onSave: () => void;
  savedLabel: string;
  saveLabel: string;
}) {
  return (
    <>
      <Button onClick={onSave} disabled={disabled || state === "saving"} className="gap-2">
        {state === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
        {saveLabel}
      </Button>
      {state === "saved" && (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-success">
          <CheckCircle2 className="h-4 w-4" />
          {savedLabel}
        </span>
      )}
      {state === "error" && error && (
        <span className="text-[12.5px] font-medium text-destructive">{error}</span>
      )}
    </>
  );
}

/** Writes a patch to workspace_settings, creating the row if it's the first. */
function useWorkspaceSave(account: SettingsAccount | null) {
  const { lang } = useLang();
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(patch: Record<string, unknown>) {
    if (!account) return;
    const supabase = createClient();
    if (!supabase) return;

    setState("saving");
    setError(null);
    const { error: err } = await supabase
      .from("workspace_settings")
      .upsert({ user_id: account.id, ...patch, updated_at: new Date().toISOString() });

    if (err) {
      /**
       * These columns were added after the first schema release. If the
       * project hasn't re-run schema.sql, PostgREST answers with a schema-cache
       * miss — which reads as gibberish. Say what to actually do instead.
       */
      const missingColumn = err.code === "PGRST204" || err.code === "42703";
      setError(
        missingColumn
          ? lang === "tr"
            ? "Veritabanında bu alanlar henüz yok. supabase/schema.sql dosyasını SQL Editor'de bir kez daha çalıştır."
            : "Your database doesn't have these columns yet. Run supabase/schema.sql once more in the SQL Editor."
          : err.message,
      );
      setState("error");
      return;
    }
    setState("saved");
    window.setTimeout(() => setState("idle"), 2500);
  }

  return { state, error, save };
}

/* ── Account ───────────────────────────────────────────────────────────────── */
function AccountTab({ account }: { account: SettingsAccount | null }) {
  const { ui, lang } = useLang();
  const [fullName, setFullName] = useState(account?.fullName ?? "");
  const [storeName, setStoreName] = useState(account?.storeName ?? "");
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  const dirty = account !== null && (fullName !== account.fullName || storeName !== account.storeName);

  async function save() {
    if (!account) return;
    const supabase = createClient();
    if (!supabase) return;
    setState("saving");
    setError(null);
    const { error: err } = await supabase
      .from("profiles")
      .upsert({ id: account.id, full_name: fullName, store_name: storeName });
    if (err) {
      setError(err.message);
      setState("error");
      return;
    }
    setState("saved");
    window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <Panel
      title={ui.account}
      description={
        account
          ? lang === "tr"
            ? "Bu bilgiler hesabına kayıtlı ve yalnızca sen görürsün."
            : "Saved against your account, visible only to you."
          : lang === "tr"
            ? "Örnek hesapta kaydedilecek gerçek bir hesap yok."
            : "There's no real account to save to in the sample workspace."
      }
      footer={
        <SaveRow
          state={state}
          error={error}
          disabled={!dirty}
          onSave={save}
          saveLabel={ui.saveChanges}
          savedLabel={lang === "tr" ? "Kaydedildi" : "Saved"}
        />
      }
    >
      <div className="space-y-1.5">
        <Label>{ui.email}</Label>
        <Input value={account?.email ?? "demo@pricenova.io"} readOnly disabled />
        <p className="text-[11.5px] text-muted-foreground">
          {lang === "tr"
            ? "E-posta adresi giriş kimliğindir, buradan değiştirilemez."
            : "Your email is your sign-in identity and can't be changed here."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
    </Panel>
  );
}

/* ── Pricing ───────────────────────────────────────────────────────────────── */
function PricingTab({
  workspace,
  account,
  autopilot,
  setAutopilot,
}: {
  workspace: WorkspaceSettings;
  account: SettingsAccount | null;
  autopilot: boolean;
  setAutopilot: (v: boolean) => void;
}) {
  const { ui, lang } = useLang();
  const { state, error, save } = useWorkspaceSave(account);

  const [mode, setMode] = useState(workspace.defaultRuleMode);
  const [floor, setFloor] = useState(String(workspace.floorMarginPct));
  const [cap, setCap] = useState(String(workspace.maxDailyChanges));

  const dirty =
    mode !== workspace.defaultRuleMode ||
    Number(floor) !== workspace.floorMarginPct ||
    Number(cap) !== workspace.maxDailyChanges;

  return (
    <div className="space-y-6">
      {/* The stop first — it's the control you reach for in a hurry. */}
      <section
        className={cn(
          "rounded-2xl border p-5 shadow-soft",
          autopilot ? "border-border bg-card" : "border-destructive/30 bg-destructive/5",
        )}
      >
        <div className="flex flex-wrap items-center gap-4">
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
                ? "Kapalıyken takip ve uyarılar çalışır; yalnızca fiyat yazma durur. Aynı düğme üst barda da var."
                : "While off, tracking and alerts keep running — only price writing stops. The same switch is in the top bar."}
            </p>
          </div>
          <Button variant={autopilot ? "outline" : "primary"} onClick={() => setAutopilot(!autopilot)}>
            {autopilot
              ? lang === "tr" ? "Hepsini durdur" : "Stop everything"
              : lang === "tr" ? "Yeniden başlat" : "Resume"}
          </Button>
        </div>
      </section>

      <Panel
        title={lang === "tr" ? "Yeni kuralların varsayılanları" : "Defaults for new rules"}
        description={
          lang === "tr"
            ? "Mevcut kuralları değiştirmez; bundan sonra oluşturacaklarına uygulanır."
            : "Doesn't touch existing rules — applies to the ones you create from here on."
        }
        footer={
          <SaveRow
            state={state}
            error={error}
            disabled={!dirty || !account}
            onSave={() =>
              save({
                default_rule_mode: mode,
                floor_margin_pct: Number(floor),
                max_daily_changes: Number(cap),
              })
            }
            saveLabel={ui.saveChanges}
            savedLabel={lang === "tr" ? "Kaydedildi" : "Saved"}
          />
        }
      >
        <div className="space-y-2">
          <Label>{lang === "tr" ? "Bir kural fiyatı değiştirmek istediğinde" : "When a rule wants to move a price"}</Label>
          <div className="flex flex-wrap rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              onClick={() => setMode("approval")}
              disabled={!account}
              className={cn(
                "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] px-3 py-2 text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed",
                mode === "approval" ? "bg-card text-foreground shadow-pill" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Handshake className="h-3.5 w-3.5" />
              {lang === "tr" ? "Önce bana sor" : "Ask me first"}
            </button>
            <button
              onClick={() => setMode("auto")}
              disabled={!account}
              className={cn(
                "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] px-3 py-2 text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed",
                mode === "auto" ? "bg-card text-foreground shadow-pill" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Wand2 className="h-3.5 w-3.5" />
              {lang === "tr" ? "Otomatik uygula" : "Apply automatically"}
            </button>
          </div>
          <p className="text-[11.5px] text-muted-foreground">
            {mode === "approval"
              ? lang === "tr"
                ? "Güvenli varsayılan: öneri onay kuyruğuna düşer, sen onaylamadan fiyat değişmez."
                : "The safe default: suggestions wait in the approval queue until you say yes."
              : lang === "tr"
                ? "Fiyat hemen güncellenir. Önceki fiyat saklanır, tek tıkla geri alınır."
                : "The price updates right away. The old price is kept and one click restores it."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="floor">{lang === "tr" ? "Taban marj (%)" : "Floor margin (%)"}</Label>
            <Input
              id="floor"
              type="number"
              min={0}
              max={90}
              step={0.5}
              value={floor}
              disabled={!account}
              onChange={(e) => setFloor(e.target.value)}
            />
            <p className="text-[11.5px] text-muted-foreground">
              {lang === "tr"
                ? "Fiyat asla maliyet + bu oranın altına inmez. Rakip daha ucuza inerse takip etmez, haber verir."
                : "Price never drops below cost plus this. If a rival goes lower we don't follow — we tell you."}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cap">{lang === "tr" ? "Günlük değişim sınırı" : "Daily change cap"}</Label>
            <Input
              id="cap"
              type="number"
              min={1}
              max={5000}
              value={cap}
              disabled={!account}
              onChange={(e) => setCap(e.target.value)}
            />
            <p className="text-[11.5px] text-muted-foreground">
              {lang === "tr"
                ? "Bir günde en fazla kaç ürünün fiyatı otomatik değişebilir. Hatalı bir kuralın zararını sınırlar."
                : "How many prices may change automatically in a day. It caps the damage a bad rule can do."}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ── Notifications ─────────────────────────────────────────────────────────── */
function NotificationsTab({
  workspace,
  account,
}: {
  workspace: WorkspaceSettings;
  account: SettingsAccount | null;
}) {
  const { ui, lang } = useLang();
  const { state, error, save } = useWorkspaceSave(account);

  const [email, setEmail] = useState(workspace.notifyEmail);
  const [slack, setSlack] = useState(workspace.notifySlack);
  const [dropPct, setDropPct] = useState(String(workspace.notifyDropPct));
  const [lostLead, setLostLead] = useState(workspace.notifyLostLead);
  const [stockOut, setStockOut] = useState(workspace.notifyStockOut);
  const [digest, setDigest] = useState(workspace.digestFrequency);

  const dirty =
    email !== workspace.notifyEmail ||
    slack !== workspace.notifySlack ||
    Number(dropPct) !== workspace.notifyDropPct ||
    lostLead !== workspace.notifyLostLead ||
    stockOut !== workspace.notifyStockOut ||
    digest !== workspace.digestFrequency;

  const digestOptions: { key: string; label: string }[] = [
    { key: "off", label: lang === "tr" ? "Kapalı" : "Off" },
    { key: "daily", label: lang === "tr" ? "Günlük" : "Daily" },
    { key: "weekly", label: lang === "tr" ? "Haftalık" : "Weekly" },
  ];

  return (
    <Panel
      title={lang === "tr" ? "Bildirimler" : "Notifications"}
      description={
        lang === "tr"
          ? "Neyin haber edilmeye değer olduğuna sen karar ver — eşiği düşük tutmak gün içinde onlarca bildirim demektir."
          : "You decide what's worth interrupting you for — a low threshold means dozens of alerts a day."
      }
      footer={
        <SaveRow
          state={state}
          error={error}
          disabled={!dirty || !account}
          onSave={() =>
            save({
              notify_email: email,
              notify_slack: slack,
              notify_drop_pct: Number(dropPct),
              notify_lost_lead: lostLead,
              notify_stock_out: stockOut,
              digest_frequency: digest,
            })
          }
          saveLabel={ui.saveChanges}
          savedLabel={lang === "tr" ? "Kaydedildi" : "Saved"}
        />
      }
    >
      <div className="space-y-2.5">
        <Label>{lang === "tr" ? "Nereye gönderilsin" : "Where alerts go"}</Label>
        <Toggle
          label={lang === "tr" ? "E-posta" : "Email"}
          hint={account?.email ?? "demo@pricenova.io"}
          checked={email}
          disabled={!account}
          onChange={setEmail}
        />
        <Toggle
          label="Slack"
          hint={
            lang === "tr"
              ? "SLACK_WEBHOOK_URL tanımlıysa çalışır."
              : "Works once SLACK_WEBHOOK_URL is set."
          }
          checked={slack}
          disabled={!account}
          onChange={setSlack}
        />
      </div>

      <div className="space-y-2.5">
        <Label>{lang === "tr" ? "Ne zaman haber verilsin" : "What to tell you about"}</Label>
        <Toggle
          label={lang === "tr" ? "En ucuz konumu kaybettiğimde" : "When I lose the cheapest spot"}
          hint={
            lang === "tr"
              ? "Bir rakip senin altına indiği anda."
              : "The moment a rival goes under you."
          }
          checked={lostLead}
          disabled={!account}
          onChange={setLostLead}
        />
        <Toggle
          label={lang === "tr" ? "Rakibin stoğu bittiğinde" : "When a rival goes out of stock"}
          hint={
            lang === "tr"
              ? "Fiyatı yükseltmek için iyi bir fırsat olabilir."
              : "Often a chance to raise your price."
          }
          checked={stockOut}
          disabled={!account}
          onChange={setStockOut}
        />
        <div className="space-y-1.5 rounded-xl border border-border p-3.5">
          <Label htmlFor="dropPct">
            {lang === "tr" ? "Fiyat düşüşü eşiği (%)" : "Price-drop threshold (%)"}
          </Label>
          <Input
            id="dropPct"
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={dropPct}
            disabled={!account}
            onChange={(e) => setDropPct(e.target.value)}
          />
          <p className="text-[11.5px] text-muted-foreground">
            {lang === "tr"
              ? "Bir rakip fiyatını bu orandan fazla düşürürse haber ver. 0 yazarsan her kuruşluk oynama bildirim olur."
              : "Tell me when a rival cuts by more than this. Set it to 0 and every kuruş becomes an alert."}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{lang === "tr" ? "Özet e-postası" : "Digest email"}</Label>
        <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
          {digestOptions.map((o) => (
            <button
              key={o.key}
              onClick={() => setDigest(o.key)}
              disabled={!account}
              className={cn(
                "flex-1 cursor-pointer rounded-[7px] px-3 py-2 text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed",
                digest === o.key ? "bg-card text-foreground shadow-pill" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-[11.5px] text-muted-foreground">
          {lang === "tr"
            ? "Fiyat konumun, kazandığın/kaybettiğin ürünler ve marj etkisi tek e-postada."
            : "Your price position, what you won and lost, and margin impact in one email."}
        </p>
      </div>
    </Panel>
  );
}

/* ── Integrations ──────────────────────────────────────────────────────────── */
function IntegrationsTab({ connected }: { connected: Record<string, boolean> }) {
  const { ui } = useLang();
  return (
    <Panel title={ui.integrations} description={ui.integrationsHint}>
      <div className="space-y-3">
        {appConfig.integrations.map((it) => (
          <div key={it.key} className="flex items-center gap-4 rounded-xl border border-border p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
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
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-success">
                <CheckCircle2 className="h-4 w-4" /> {ui.connected}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <CircleDashed className="h-4 w-4" /> {ui.demoMode}
              </span>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── Brand (fixed at build time) ───────────────────────────────────────────── */
function BrandTab({ tagline }: { tagline: string }) {
  const { ui, lang } = useLang();
  return (
    <Panel title={ui.brand} description={ui.brandHint}>
      <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-[12.5px] text-muted-foreground">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        {lang === "tr"
          ? "Bu alanlar app.config.ts dosyasından gelir; burada değiştirilemez."
          : "These come from app.config.ts and can't be edited here."}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
          <Input defaultValue={tagline} readOnly disabled />
        </div>
      </div>
    </Panel>
  );
}
