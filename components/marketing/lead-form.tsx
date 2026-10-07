"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Check, CircleAlert, LoaderCircle, Mail, Phone } from "lucide-react";
import appConfig from "@/app.config";
import { useLang } from "@/components/i18n/language-provider";
import type { L } from "@/lib/i18n/config";
import {
  emptyLead,
  FIELD_ORDER,
  validateField,
  validateLead,
  type LeadField,
  type LeadInput,
  type Plan,
} from "@/lib/leads";
import { cn } from "@/lib/utils";

const PRODUCT_COUNTS: L[] = [
  { tr: "100'e kadar", en: "Up to 100" },
  { tr: "100 – 2.000", en: "100 – 2,000" },
  { tr: "2.000 – 50.000", en: "2,000 – 50,000" },
  { tr: "50.000'den fazla", en: "More than 50,000" },
];

const LABELS: Record<LeadField, L> = {
  plan: { tr: "Paket", en: "Plan" },
  name: { tr: "Ad soyad", en: "Full name" },
  company: { tr: "Şirket ya da mağaza adı", en: "Company or store" },
  email: { tr: "E-posta", en: "Email" },
  phone: { tr: "Telefon", en: "Phone" },
  productCount: { tr: "Kaç ürün izlemek istiyorsun?", en: "How many products?" },
  message: { tr: "Eklemek istediğin bir şey var mı?", en: "Anything else?" },
  consent: { tr: "Aydınlatma metni onayı", en: "Privacy notice" },
};

const fieldId = (f: LeadField) => `lead-${f}`;
const errorId = (f: LeadField) => `lead-${f}-error`;

const inputCls =
  "block min-h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive";

type Status = "idle" | "sending" | "sent" | "error";

export function LeadForm({ initialPlan = "" }: { initialPlan?: Plan | "" }) {
  const { t, lang } = useLang();
  const tr = lang === "tr";
  const [v, setV] = useState<LeadInput>(() => emptyLead(initialPlan));
  const [errors, setErrors] = useState<Partial<Record<LeadField, L>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<L | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const set = <K extends LeadField>(field: K, value: LeadInput[K]) => {
    const next = { ...v, [field]: value };
    setV(next);
    // Once a field has shown an error, re-check it as the user fixes it.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) ?? undefined }));
  };

  const blur = (field: LeadField) => setErrors((e) => ({ ...e, [field]: validateField(field, v) ?? undefined }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateLead(v);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, lang, website: honeypot.current?.value ?? "" }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      setServerError(
        res.status === 429
          ? { tr: "Kısa sürede çok fazla deneme oldu. Birkaç dakika sonra tekrar dene.", en: "Too many attempts. Try again in a few minutes." }
          : { tr: "Talebin şu an kaydedilemedi.", en: "We couldn't save your request right now." },
      );
    } catch {
      setServerError({ tr: "Bağlantı kurulamadı.", en: "Couldn't connect." });
    }
    setStatus("error");
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-3xl border border-border bg-card p-8 shadow-pop">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-success text-success-foreground">
          <Check className="h-6 w-6" strokeWidth={3} aria-hidden />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">
          {tr ? "Talebin bize ulaştı" : "We've got your request"}
        </h2>
        <p className="mt-2 max-w-prose text-muted-foreground">
          {tr
            ? `${v.plan ? `${v.plan} paketi için ` : ""}seninle telefonla ya da e-postayla iletişime geçeceğiz:`
            : `We'll reach out ${v.plan ? `about the ${v.plan} plan ` : ""}by phone or email:`}
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" aria-hidden />
            <span className="tnum">{v.phone}</span>
          </li>
          <li className="flex items-center gap-2 wrap-anywhere">
            <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {v.email}
          </li>
        </ul>
        <Link href="/demo" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
          {tr ? "Beklerken demo paneli gez" : "Explore the demo while you wait"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const describedBy = (f: LeadField, hint?: string) => [hint, errors[f] ? errorId(f) : null].filter(Boolean).join(" ") || undefined;
  const fieldError = (f: LeadField) =>
    errors[f] ? (
      <p id={errorId(f)} className="mt-1.5 flex items-start gap-1.5 text-sm text-destructive">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {t(errors[f]!)}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={submit} className="relative rounded-3xl border border-border bg-card p-6 shadow-pop sm:p-8">
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 focus-visible:outline-2">
          <p className="font-semibold text-destructive">
            {tr ? `Formda ${errorList.length} eksik var:` : `${errorList.length} field(s) need attention:`}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${fieldId(f)}`} className="underline underline-offset-2">
                  {t(LABELS[f])}: {t(errors[f]!)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset>
        <legend className="text-sm font-semibold">{t(LABELS.plan)}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3" id={fieldId("plan")}>
          {appConfig.marketing.pricing.map((tier) => {
            const checked = v.plan === tier.name;
            return (
              <label
                key={tier.name}
                className={cn(
                  "relative flex min-h-16 cursor-pointer flex-col justify-center rounded-2xl border px-4 py-3 transition-colors duration-200",
                  checked ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-muted-foreground",
                )}
              >
                <input
                  type="radio"
                  name="plan"
                  value={tier.name}
                  checked={checked}
                  onChange={() => set("plan", tier.name as Plan)}
                  className="sr-only"
                />
                <span className="flex items-center justify-between gap-2 font-semibold">
                  {tier.name}
                  {checked && <Check className="h-4 w-4 text-primary" strokeWidth={3} aria-hidden />}
                </span>
                <span className="tnum text-sm text-muted-foreground">
                  {t(tier.price)}
                  {tier.period && t(tier.period)}
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {tr ? "Emin değilsen boş bırak, birlikte seçeriz." : "Not sure? Leave it empty and we'll pick together."}
        </p>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className="text-sm font-semibold">
            {t(LABELS.name)}
          </label>
          <input
            id={fieldId("name")}
            className={cn(inputCls, "mt-1.5")}
            autoComplete="name"
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            required
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={fieldId("company")} className="text-sm font-semibold">
            {t(LABELS.company)} <span className="font-normal text-muted-foreground">{tr ? "(isteğe bağlı)" : "(optional)"}</span>
          </label>
          <input
            id={fieldId("company")}
            className={cn(inputCls, "mt-1.5")}
            autoComplete="organization"
            value={v.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={fieldId("email")} className="text-sm font-semibold">
            {t(LABELS.email)}
          </label>
          <input
            id={fieldId("email")}
            type="email"
            inputMode="email"
            className={cn(inputCls, "mt-1.5")}
            autoComplete="email"
            placeholder="ad@magazan.com"
            value={v.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            required
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor={fieldId("phone")} className="text-sm font-semibold">
            {t(LABELS.phone)}
          </label>
          <input
            id={fieldId("phone")}
            type="tel"
            inputMode="tel"
            className={cn(inputCls, "tnum mt-1.5")}
            autoComplete="tel"
            placeholder="0532 123 45 67"
            value={v.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => blur("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            required
          />
          {fieldError("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={fieldId("productCount")} className="text-sm font-semibold">
            {t(LABELS.productCount)} <span className="font-normal text-muted-foreground">{tr ? "(isteğe bağlı)" : "(optional)"}</span>
          </label>
          <select
            id={fieldId("productCount")}
            className={cn(inputCls, "mt-1.5 cursor-pointer")}
            value={v.productCount}
            onChange={(e) => set("productCount", e.target.value)}
          >
            <option value="">{tr ? "Seç" : "Choose"}</option>
            {PRODUCT_COUNTS.map((c) => (
              <option key={c.en} value={c.tr}>
                {t(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={fieldId("message")} className="text-sm font-semibold">
            {t(LABELS.message)} <span className="font-normal text-muted-foreground">{tr ? "(isteğe bağlı)" : "(optional)"}</span>
          </label>
          <textarea
            id={fieldId("message")}
            rows={4}
            maxLength={2000}
            className={cn(inputCls, "mt-1.5 py-3")}
            placeholder={tr ? "Hangi pazaryerlerinde satıyorsun, aramamız için uygun saat…" : "Which marketplaces you sell on, a good time to call…"}
            value={v.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
          />
          {fieldError("message")}
        </div>
      </div>

      {/* Honeypot for bots: hidden from people and assistive tech. */}
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="lead-website">Website</label>
        <input ref={honeypot} id="lead-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label htmlFor={fieldId("consent")} className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            id={fieldId("consent")}
            type="checkbox"
            checked={v.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-primary"
          />
          <span className="text-muted-foreground">
            {tr ? (
              <>
                Bana telefon ve e-posta ile ulaşılması için bilgilerimin işlenmesine ilişkin{" "}
                <Link href="/kvkk" className="font-medium text-primary underline underline-offset-2">KVKK aydınlatma metnini</Link> okudum.
              </>
            ) : (
              <>
                I&apos;ve read the{" "}
                <Link href="/kvkk" className="font-medium text-primary underline underline-offset-2">privacy notice</Link> on how my details are used to contact me by phone and email.
              </>
            )}
          </span>
        </label>
        {fieldError("consent")}
      </div>

      {status === "error" && serverError && (
        <p role="alert" className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <span className="font-semibold text-destructive">{t(serverError)}</span>{" "}
          {tr ? "Dilersen doğrudan " : "You can also write to "}
          <a href={`mailto:${appConfig.company.emails.hello}`} className="font-medium text-primary underline underline-offset-2">
            {appConfig.company.emails.hello}
          </a>
          {tr ? " adresine yazabilirsin." : "."}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-cta px-6 text-base font-semibold text-cta-foreground transition-[filter,transform] duration-200 hover:brightness-95 active:translate-y-px disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            {tr ? "Gönderiliyor" : "Sending"}
          </>
        ) : (
          <>
            {tr ? "Teklif iste" : "Request a quote"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
