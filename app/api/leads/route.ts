import { createClient } from "@supabase/supabase-js";
import { parseLead, validateLead } from "@/lib/leads";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Stores a quote request in the `leads` table (supabase/leads.sql). Uses the
 * anon key: RLS lets anyone insert but nobody read, so the requests are only
 * visible in the Supabase dashboard.
 */

// Best-effort per-instance throttle against form spam: 5 submissions per IP per 10 minutes.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real people never see or fill the "website" field.
  if (typeof body.website === "string" && body.website.trim()) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) return Response.json({ error: "too_many" }, { status: 429 });

  const lead = parseLead(body);
  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) return Response.json({ error: "invalid", fields: errors }, { status: 400 });

  if (!isSupabaseConfigured()) return Response.json({ error: "not_configured" }, { status: 503 });

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const { error } = await supabase.from("leads").insert({
    plan: lead.plan || null,
    name: lead.name,
    company: lead.company || null,
    email: lead.email,
    phone: lead.phone,
    product_count: lead.productCount || null,
    message: lead.message || null,
    consent: lead.consent,
    lang: body.lang === "en" ? "en" : "tr",
  });

  if (error) {
    console.error("leads insert failed", error.code, error.message);
    return Response.json({ error: "store_failed" }, { status: 503 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
