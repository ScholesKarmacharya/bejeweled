import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

const allowedStatuses = [
  "New",
  "Read",
  "Replied",
] as const;

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

/* =====================================================
   GET ONE MESSAGE
====================================================== */

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
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

    const { id } =
      await params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid message ID.",
        },
        {
          status: 400,
        }
      );
    }

    const message =
      await ContactMessage.findById(
        id
      ).lean();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Admin message fetch error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to retrieve message.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   UPDATE MESSAGE STATUS
====================================================== */

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
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

    const { id } =
      await params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid message ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const status =
      typeof body.status ===
      "string"
        ? body.status.trim()
        : "";

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message status is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedStatuses.includes(
        status as
          (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid message status.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedMessage =
      await ContactMessage.findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!updatedMessage) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          updatedMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Admin message update error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update message.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   DELETE MESSAGE
====================================================== */

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
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

    const { id } =
      await params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid message ID.",
        },
        {
          status: 400,
        }
      );
    }

    const deletedMessage =
      await ContactMessage.findByIdAndDelete(
        id
      );

    if (!deletedMessage) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Message deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Admin message delete error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete message.",
      },
      {
        status: 500,
      }
    );
  }
}