import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Refreshes the auth session on every non-static request and gates the member
 * portal. Admin (SuperAdmin) route gating is handled in the (admin) layout,
 * which reads the staff role server-side.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isPortal = path === "/portal" || path.startsWith("/portal/");
  const isPortalAuth = path === "/portal/login" || path === "/portal/signup";

  // Not signed in and trying to reach a gated portal page -> send to login.
  if (isPortal && !isPortalAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    url.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }

  // Already signed in and on a portal auth page -> send into the portal.
  if (isPortalAuth && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on everything except Next internals and static image assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
