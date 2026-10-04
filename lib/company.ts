import appConfig from "@/app.config";
import type { L } from "@/lib/i18n/config";

const c = appConfig.company;

/** The registered name if it's filled in, otherwise the brand. For copyright lines and "we are" sentences. */
export const companyName = c.legalName || appConfig.name;

/**
 * A company field as text, or a visible placeholder naming what's missing.
 * Legal copy is built with this so a blank never silently disappears from a
 * sentence.
 */
export function fill(value: string | number | null | undefined, missing: L): L {
  if (value === null || value === undefined || value === "") {
    return { tr: `[${missing.tr}]`, en: `[${missing.en}]` };
  }
  return { tr: String(value), en: String(value) };
}

export const legalNameL = fill(c.legalName, { tr: "şirket unvanı", en: "registered company name" });
export const addressL = fill(c.address, { tr: "şirket adresi", en: "registered address" });
export const jurisdictionL = fill(c.jurisdiction, { tr: "yetkili mahkeme", en: "courts of jurisdiction" });
export const hostingL = fill(c.hostingProvider, { tr: "barındırma sağlayıcısı", en: "hosting provider" });
export const regionL: L = c.dataRegion ?? { tr: "[sunucu bölgesi]", en: "[server region]" };
export const backupDaysL = fill(c.backupRetentionDays, { tr: "gün sayısı", en: "number of days" });

/** Which of the fields the legal pages depend on are still empty. */
export function missingCompanyFields(): L[] {
  const missing: L[] = [];
  if (!c.legalName) missing.push({ tr: "şirket unvanı", en: "company name" });
  if (!c.address) missing.push({ tr: "adres", en: "address" });
  if (!c.mersisNo) missing.push({ tr: "MERSİS no", en: "MERSİS number" });
  if (!c.taxNumber) missing.push({ tr: "vergi no", en: "tax number" });
  if (!c.jurisdiction) missing.push({ tr: "yetkili mahkeme", en: "jurisdiction" });
  if (!c.dataRegion) missing.push({ tr: "sunucu bölgesi", en: "server region" });
  if (!c.hostingProvider) missing.push({ tr: "barındırma sağlayıcısı", en: "hosting provider" });
  if (c.backupRetentionDays === null) missing.push({ tr: "yedek saklama süresi", en: "backup retention" });
  return missing;
}
