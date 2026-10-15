import { NextResponse, type NextRequest } from "next/server";

/**
 * Cheap gate for the CMS: without the `m2s_session` cookie, /admin/* redirects to the login page.
 * The real authentication check is GET /api/v1/auth/me, done client-side by the admin shell.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!req.cookies.has("m2s_session")) {
    // Note: Next normalises loopback hosts (127.0.0.1, [::1]) to "localhost" in redirects, so test
    // locally via http://localhost:3000; real domains behind a proxy are unaffected.
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    if (pathname !== "/admin") url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
