import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  COOKIE_NAME,
  SESSION_DURATION,
  createAdminSessionToken,
} from "@/lib/adminAuth";

/* =========================================================
   LOGIN
========================================================= */

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const email =
      typeof body.email ===
      "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    const password =
      typeof body.password ===
      "string"
        ? body.password
        : "";

    /* =====================================================
       ADMIN CONFIGURATION
    ===================================================== */

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      !adminEmail ||
      !adminPassword
    ) {
      console.error(
        "Admin credentials are not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Admin login is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       VALIDATE INPUT
    ===================================================== */

    if (
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE CREDENTIALS
    ===================================================== */

    const validEmail =
      email ===
      adminEmail;

    const validPassword =
      password ===
      adminPassword;

    if (
      !validEmail ||
      !validPassword
    ) {
      /*
       * Keep this message generic.
       * Do not reveal whether email
       * or password was incorrect.
       */
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    /* =====================================================
       CREATE SESSION
    ===================================================== */

    const token =
      await createAdminSessionToken();

    const response =
      NextResponse.json(
        {
          success: true,
          message:
            "Login successful.",
        },
        {
          status: 200,
        }
      );

    /* =====================================================
       SESSION COOKIE
    ===================================================== */

    response.cookies.set({
      name:
        COOKIE_NAME,

      value:
        token,

      /*
       * Prevent JavaScript in the
       * browser from reading it.
       */
      httpOnly:
        true,

      /*
       * HTTPS only in production.
       * localhost still works in dev.
       */
      secure:
        process.env.NODE_ENV ===
        "production",

      /*
       * Good default protection
       * against cross-site requests.
       */
      sameSite:
        "lax",

      /*
       * Session applies to
       * the whole application.
       */
      path:
        "/",

      /*
       * Same expiration as the
       * signed session token.
       */
      maxAge:
        SESSION_DURATION,

      /*
       * Give the session cookie
       * higher browser priority.
       */
      priority:
        "high",
    });

    return response;
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to log in.",
      },
      {
        status: 500,
      }
    );
  }
}