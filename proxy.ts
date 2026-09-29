import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  DEMO_COOKIE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { getTrialStatus } from "@/lib/trial";

/**
 * Next 16 calls this Proxy; it's what earlier versions called Middleware.
 *
 * Three jobs, in this order:
 *  1. Keep the Supabase session cookie fresh on every request.
 *  2. Send signed-out visitors to /login when they ask for a dashboard route —
 *     unless they're here on the demo door, which is a deliberate way in.
 *  3. Send signed-in users whose free trial has run out to /deneme-bitti
 *     (see lib/trial.ts).
 *
 * With no Supabase keys the whole thing is a no-op and the kit stays in demo
 * mode, exactly as it behaves out of the box.
 */
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() revalidates the token with Supabase — don't swap it for
  // getSession(), which trusts whatever the cookie claims.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    /**
     * Supabase unreachable, or the URL is wrong. This check is optimistic by
     * design (see Next's proxy docs), and the real guard is row-level security
     * in the database — so a blip here lets the request through rather than
     * locking every customer out of their dashboard.
     */
    return response;
  }

  const isDemoVisit =
    request.nextUrl.searchParams.get("demo") === "1" ||
    request.cookies.get(DEMO_COOKIE)?.value === "1";

  if (!user && !isDemoVisit) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    // Come back here once they're in.
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  // Signed in but the free trial is over and there's no paid plan yet.
  if (user && getTrialStatus(user).state === "expired") {
    const ended = request.nextUrl.clone();
    ended.pathname = "/deneme-bitti";
    ended.search = "";
    return NextResponse.redirect(ended);
  }

  return response;
}

export const config = {
  /**
   * Only the signed-in surface. Marketing, auth screens, the demo door and
   * static assets never hit this.
   */
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/competitors/:path*",
    "/matches/:path*",
    "/changes/:path*",
    "/rules/:path*",
    "/approvals/:path*",
    "/reports/:path*",
    "/marketplaces/:path*",
    "/settings/:path*",
  ],
};
