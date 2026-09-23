import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where Supabase sends people back after they click a confirmation or
 * password-reset link in their email. Trades the one-time code for a session
 * cookie, then forwards them on.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Bad or expired link — say so on the login screen rather than silently.
  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
