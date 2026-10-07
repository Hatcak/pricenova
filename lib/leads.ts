/**
 * Quote-request ("Teklif al") form: the fields and the one set of validation
 * rules shared by the browser form and the /api/leads route, so both always
 * agree. Messages are { tr, en } like every other string in the kit.
 */
import type { L } from "@/lib/i18n/config";

export const PLANS = ["Starter", "Growth", "Scale"] as const;
export type Plan = (typeof PLANS)[number];

export const isPlan = (v: unknown): v is Plan => typeof v === "string" && (PLANS as readonly string[]).includes(v);

export type LeadInput = {
  plan: Plan | "";
  name: string;
  company: string;
  email: string;
  phone: string;
  productCount: string;
  message: string;
  consent: boolean;
};

export type LeadField = keyof LeadInput;

export const emptyLead = (plan: Plan | "" = ""): LeadInput => ({
  plan,
  name: "",
  company: "",
  email: "",
  phone: "",
  productCount: "",
  message: "",
  consent: false,
});

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Returns the error for one field, or null when it's fine. */
export function validateField(field: LeadField, v: LeadInput): L | null {
  switch (field) {
    case "name":
      return v.name.trim().length < 2 ? { tr: "Adını ve soyadını yaz.", en: "Enter your full name." } : null;
    case "email":
      if (!v.email.trim()) return { tr: "E-posta adresini yaz.", en: "Enter your email address." };
      return EMAIL.test(v.email.trim()) ? null : { tr: "E-posta adresi ad@alanadi.com biçiminde olmalı.", en: "Use the name@domain.com format." };
    case "phone": {
      const digits = v.phone.replace(/\D/g, "");
      if (!digits) return { tr: "Telefon numaranı yaz.", en: "Enter your phone number." };
      return digits.length < 10 || digits.length > 15
        ? { tr: "Telefon numarası 10 ile 15 rakam arasında olmalı, örn. 0532 123 45 67.", en: "Use 10 to 15 digits, e.g. +90 532 123 45 67." }
        : null;
    }
    case "plan":
      return v.plan && !isPlan(v.plan) ? { tr: "Listeden bir paket seç.", en: "Pick a plan from the list." } : null;
    case "consent":
      return v.consent ? null : { tr: "Devam etmek için aydınlatma metnini onayla.", en: "Please accept the privacy notice to continue." };
    case "message":
      return v.message.length > 2000 ? { tr: "Mesaj en fazla 2000 karakter olabilir.", en: "Keep the message under 2000 characters." } : null;
    default:
      return null;
  }
}

/** Fields in the order they appear on the form, which is also the error-summary order. */
export const FIELD_ORDER: LeadField[] = ["plan", "name", "company", "email", "phone", "productCount", "message", "consent"];

export function validateLead(v: LeadInput): Partial<Record<LeadField, L>> {
  const errors: Partial<Record<LeadField, L>> = {};
  for (const f of FIELD_ORDER) {
    const e = validateField(f, v);
    if (e) errors[f] = e;
  }
  return errors;
}

/** Coerces an untrusted JSON body into a LeadInput with trimmed, length-capped strings. */
export function parseLead(raw: unknown): LeadInput {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const s = (k: string, max: number) => (typeof o[k] === "string" ? (o[k] as string).trim().slice(0, max) : "");
  return {
    plan: isPlan(o.plan) ? o.plan : "",
    name: s("name", 120),
    company: s("company", 160),
    email: s("email", 200),
    phone: s("phone", 30),
    productCount: s("productCount", 40),
    message: s("message", 2000),
    consent: o.consent === true,
  };
}
