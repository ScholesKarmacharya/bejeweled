import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = body;

    /* ================================
       VALIDATION
    ================================= */

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email.trim()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      message.trim().length < 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a little more detail in your message.",
        },
        {
          status: 400,
        }
      );
    }

    /* ================================
       CREATE MESSAGE
    ================================= */

    const contactMessage =
      await ContactMessage.create({
        name: name.trim(),
        email: email.trim(),
        phone:
          typeof phone === "string"
            ? phone.trim()
            : "",
        subject: subject.trim(),
        message: message.trim(),
        status: "New",
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully.",
        contactMessage: {
          _id: contactMessage._id,
          status:
            contactMessage.status,
          createdAt:
            contactMessage.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Contact message error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send your message right now.",
      },
      {
        status: 500,
      }
    );
  }
}