import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

async function isAdminAuthenticated(
  request: NextRequest
) {
  const token =
    request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return await verifyAdminSessionToken(token);
}

export async function GET(
  request: NextRequest
) {
  try {
    const authenticated =
      await isAdminAuthenticated(request);

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized. Admin login required.",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const messages =
      await ContactMessage.find()
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(
      {
        success: true,
        messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Admin messages fetch error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch messages.",
      },
      {
        status: 500,
      }
    );
  }
}