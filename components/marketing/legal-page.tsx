"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Building2, Mail } from "lucide-react";
import appConfig from "@/app.config";
import { useLang } from "@/components/i18n/language-provider";
import { addressL, legalNameL, missingCompanyFields } from "@/lib/company";
import type { L } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared shell for the legal pages (privacy, terms, KVKK, retention, security)
   and the company card used on about/contact.

   The text on these pages describes what this codebase actually does. It is
   not legal advice: have a lawyer review it against KVKK/GDPR and Turkish
   commercial law before going live, and fill in `company` in app.config.ts.
   ───────────────────────────────────────────────────────────────────────────── */

export type LegalBlock =
  | { p: L }
  | { list: L[] }
  | { table: { head: L[]; rows: L[][] } };

export interface LegalSection {
  id: string;
  title: L;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: L;
  /** One or two sentences under the title: what this page is and who it's for. */
  intro: L;
  updated: L;
  sections: LegalSection[];
}

/** Every legal document, in footer order. The side nav and the "other documents" list read from this. */
export const LEGAL_LINKS: { href: string; label: L }[] = [
  { href: "/gizlilik", label: { tr: "Gizlilik Politikası", en: "Privacy Policy" } },
  { href: "/kullanim-sartlari", label: { tr: "Kullanım Şartları", en: "Terms of Service" } },
  { href: "/kvkk", label: { tr: "KVKK Aydınlatma Metni", en: "KVKK / GDPR Notice" } },
  { href: "/veri-saklama", label: { tr: "Veri Saklama Politikası", en: "Data Retention Policy" } },
  { href: "/guvenlik", label: { tr: "Güvenlik", en: "Security" } },
];

/** Shared "last updated" date. Bump it whenever any legal text changes meaningfully. */
export const LEGAL_UPDATED: L = { tr: "Son güncelleme: 4 Ekim 2026", en: "Last updated: 4 October 2026" };

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const tr = lang === "tr";
  const missing = missingCompanyFields();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <nav aria-label={tr ? "Yasal belgeler" : "Legal documents"}>
          <p className="label-mono text-muted-foreground">{tr ? "Yasal" : "Legal"}</p>
          <ul className="mt-2 flex flex-wrap gap-1 lg:flex-col">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors",
                    pathname === l.href ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <article className="min-w-0 max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">{t(doc.title)}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t(doc.updated)}</p>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">{t(doc.intro)}</p>

        {/* Shown until the company details are filled in, so a half-finished policy never looks finished. */}
        {missing.length > 0 && (
          <div role="note" className="mt-6 flex gap-3 rounded-2xl border border-warning bg-warning/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
            <p className="min-w-0 text-sm leading-relaxed">
              <span className="font-semibold">{tr ? "Şirket bilgileri tamamlanmadı. " : "Company details are incomplete. "}</span>
              <span className="text-muted-foreground">
                {tr ? "Köşeli parantez içindeki alanlar henüz doldurulmadı: " : "Fields in square brackets haven't been filled in yet: "}
                {missing.map((m) => t(m)).join(", ")}.
              </span>
            </p>
          </div>
        )}

        <nav aria-label={tr ? "Bu sayfada" : "On this page"} className="mt-8 rounded-2xl border border-border bg-muted p-5">
          <p className="label-mono text-muted-foreground">{tr ? "Bu sayfada" : "On this page"}</p>
          <ol className="mt-2 grid gap-x-6 sm:grid-cols-2">
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex min-h-11 items-center text-sm text-foreground hover:text-primary hover:underline">
                  {t(s.title)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{t(s.title)}</h2>
              <div className="mt-3 space-y-4">
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14">
          <CompanyCard />
        </div>
      </article>
    </div>
  );
}

function Block({ block }: { block: LegalBlock }) {
  const { t } = useLang();
  if ("p" in block) {
    return <p className="max-w-prose text-base leading-relaxed text-muted-foreground">{t(block.p)}</p>;
  }
  if ("list" in block) {
    return (
      <ul className="max-w-prose list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground marker:text-primary">
        {block.list.map((item) => (
          <li key={item.en}>{t(item)}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className="bg-muted">
          <tr>
            {block.table.head.map((h) => (
              <th key={h.en} scope="col" className="px-4 py-3 font-semibold">
                {t(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0].en} className="border-t border-border align-top">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 font-medium">
                    {t(cell)}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3 text-muted-foreground">
                    {t(cell)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Who's behind the product, with every way to reach them. Used on legal, about and contact pages. */
export function CompanyCard() {
  const { t, lang } = useLang();
  const tr = lang === "tr";
  const c = appConfig.company;

  const rows: { label: L; value: string }[] = [
    { label: { tr: "Unvan", en: "Company" }, value: t(legalNameL) },
    { label: { tr: "Adres", en: "Address" }, value: t(addressL) },
    ...(c.mersisNo ? [{ label: { tr: "MERSİS no", en: "MERSİS no" }, value: c.mersisNo }] : []),
    ...(c.taxNumber ? [{ label: { tr: "Vergi dairesi / no", en: "Tax office / no" }, value: [c.taxOffice, c.taxNumber].filter(Boolean).join(" / ") }] : []),
    ...(c.kep ? [{ label: { tr: "KEP", en: "KEP (registered e-mail)" }, value: c.kep }] : []),
    ...(c.phone ? [{ label: { tr: "Telefon", en: "Phone" }, value: c.phone }] : []),
  ];

  const emails: { label: L; address: string }[] = [
    { label: { tr: "Genel ve satış", en: "General and sales" }, address: c.emails.hello },
    { label: { tr: "Gizlilik ve KVKK başvuruları", en: "Privacy and data requests" }, address: c.emails.privacy },
    { label: { tr: "Güvenlik bildirimleri", en: "Security reports" }, address: c.emails.security },
  ];

  return (
    <section aria-labelledby="company-card-title" className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" aria-hidden />
        </span>
        <h2 id="company-card-title" className="font-semibold tracking-tight">
          {tr ? "Veri sorumlusu ve iletişim" : "Data controller and contact"}
        </h2>
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]">
        {rows.map((r) => (
          <div key={r.label.en} className="contents">
            <dt className="text-muted-foreground">{t(r.label)}</dt>
            <dd className="font-medium wrap-anywhere">{r.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-5 grid gap-2 border-t border-border pt-5 sm:grid-cols-3">
        {emails.map((e) => (
          <li key={e.address}>
            <a href={`mailto:${e.address}`} className="flex min-h-11 flex-col justify-center rounded-lg px-1 text-sm hover:text-primary">
              <span className="text-xs text-muted-foreground">{t(e.label)}</span>
              <span className="inline-flex items-center gap-1.5 font-medium wrap-anywhere">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {e.address}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
