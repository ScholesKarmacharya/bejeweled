import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

export async function proxy(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isLoginPage =
    pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(
      COOKIE_NAME
    )?.value;

  let authenticated = false;

  if (token) {
    try {
      authenticated =
        await verifyAdminSessionToken(
          token
        );
    } catch {
      authenticated = false;
    }
  }

  /* =====================================================
     NOT LOGGED IN
  ====================================================== */

  if (
    !authenticated &&
    !isLoginPage
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      "/admin/login";

    /*
     * Remember where the admin
     * originally wanted to go.
     */

    url.searchParams.set(
      "next",
      pathname
    );

    return NextResponse.redirect(
      url
    );
  }

  /* =====================================================
     ALREADY LOGGED IN
  ====================================================== */

  if (
    authenticated &&
    isLoginPage
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      "/admin";

    url.search = "";

    return NextResponse.redirect(
      url
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};