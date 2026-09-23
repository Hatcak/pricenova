import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * POST-only on purpose: a GET would let a prefetch or a stray image request
 * sign someone out. Clears the Supabase session and the demo marker together,
 * so "log out" means the same thing in both modes.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/login", request.nextUrl.origin), {
    status: 303, // turn the POST into a GET for the redirect
  });
  response.cookies.delete(DEMO_COOKIE);
  return response;
}
