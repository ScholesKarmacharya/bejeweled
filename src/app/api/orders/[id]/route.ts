import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

/* =========================================================
   STATUS TYPES
========================================================= */

const allowedStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

const allowedPaymentStatuses = [
  "Pending",
  "Verified",
  "Rejected",
] as const;

/* =========================================================
   ADMIN AUTH
========================================================= */

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

/* =========================================================
   GET ONE ORDER
   PUBLIC
========================================================= */

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
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        order: {
          ...order,

          paymentStatus:
            order.paymentStatus ||
            "Pending",
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Order fetch error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to retrieve order",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH ORDER
   ADMIN ONLY
========================================================= */

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
    /* =====================================================
       AUTH
    ===================================================== */

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

    const { id } = await params;

    /* =====================================================
       VALIDATE ID
    ===================================================== */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order ID",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CURRENT ORDER
    ===================================================== */

    const existingOrder =
      await Order.findById(id);

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       REQUEST BODY
    ===================================================== */

    const body =
      await request.json();

    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : undefined;

    const paymentStatus =
      typeof body.paymentStatus === "string"
        ? body.paymentStatus.trim()
        : undefined;

    if (!status && !paymentStatus) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order status or payment status is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE ORDER STATUS
    ===================================================== */

    if (
      status &&
      !allowedStatuses.includes(
        status as
          (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order status",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE PAYMENT STATUS
    ===================================================== */

    if (
      paymentStatus &&
      !allowedPaymentStatuses.includes(
        paymentStatus as
          (typeof allowedPaymentStatuses)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment status",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       DETERMINE FINAL PAYMENT STATUS
    ===================================================== */

    const finalPaymentStatus =
      paymentStatus ||
      existingOrder.paymentStatus ||
      "Pending";

    /* =====================================================
       FORWARD ORDER PROGRESSION RULE
    ===================================================== */

    const requiresVerifiedPayment = [
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
    ];

    if (
      status &&
      requiresVerifiedPayment.includes(status) &&
      finalPaymentStatus !== "Verified"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verify payment before progressing this order.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       PREPARE UPDATE
    ===================================================== */

    const updateData: {
      status?: string;
      paymentStatus?: string;
    } = {};

    if (status) {
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus =
        paymentStatus;
    }

    /* =====================================================
       IMPORTANT CORRECTION LOGIC

       If admin changes payment from Verified
       back to Pending or Rejected while the order
       has already progressed, reset fulfilment to Pending.

       This keeps payment + order state consistent.
    ===================================================== */

    if (
      paymentStatus &&
      paymentStatus !== "Verified" &&
      [
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
      ].includes(existingOrder.status)
    ) {
      updateData.status = "Pending";
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    const updatedOrder =
      await Order.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       MESSAGE
    ===================================================== */

    let message =
      "Order updated successfully.";

    if (
      paymentStatus &&
      paymentStatus !== "Verified" &&
      existingOrder.status !== "Pending" &&
      existingOrder.status !== "Cancelled"
    ) {
      message =
        `Payment changed to ${paymentStatus}. Order status was reset to Pending.`;
    } else if (paymentStatus) {
      message =
        `Payment status changed to ${paymentStatus}.`;
    } else if (status) {
      message =
        `Order status changed to ${status}.`;
    }

    return NextResponse.json(
      {
        success: true,
        message,

        order: {
          ...updatedOrder,

          paymentStatus:
            updatedOrder.paymentStatus ||
            "Pending",
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Order update error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update order",
      },
      {
        status: 500,
      }
    );
  }
}