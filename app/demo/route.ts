import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE } from "@/lib/supabase/config";

/**
 * The demo door. Marks the visit with a cookie — so the proxy lets it through
 * without a session and the dashboard can show its "sample account" banner —
 * then drops the visitor on the dashboard.
 *
 * It's a session cookie and deliberately not httpOnly: the banner reads it in
 * the browser, and there's nothing secret about "you're looking at demo data".
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/dashboard";
  url.search = "";

  const response = NextResponse.redirect(url);
  response.cookies.set(DEMO_COOKIE, "1", {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}
