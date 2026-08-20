import {
  NextResponse,
} from "next/server";

import {
  COOKIE_NAME,
} from "@/lib/adminAuth";

/* =========================================================
   LOGOUT
========================================================= */

export async function POST() {
  try {
    const response =
      NextResponse.json(
        {
          success: true,
          message:
            "Signed out successfully.",
        },
        {
          status: 200,
        }
      );

    /*
     * Remove the same session cookie
     * used during admin login.
     */
    response.cookies.set({
      name: COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error(
      "Admin logout error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to sign out.",
      },
      {
        status: 500,
      }
    );
  }
}