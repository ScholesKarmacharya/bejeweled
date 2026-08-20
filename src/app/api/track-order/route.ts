import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    /*
    |--------------------------------------------------------------------------
    | Clean Order ID
    |--------------------------------------------------------------------------
    |
    | Supports:
    |
    | #692110F5
    | 692110F5
    | 6a83070439b0e987692110f5
    |
    */

    const orderId =
      typeof body.orderId === "string"
        ? body.orderId
            .trim()
            .replace(/^#/, "")
            .toLowerCase()
        : "";

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    let order = null;

    /*
    |--------------------------------------------------------------------------
    | FULL MONGODB ID
    |--------------------------------------------------------------------------
    */

    if (
      orderId.length === 24 &&
      mongoose.Types.ObjectId.isValid(orderId)
    ) {
      order = await Order.findById(orderId).lean();
    }

    /*
    |--------------------------------------------------------------------------
    | SHORT CUSTOMER ORDER ID
    |--------------------------------------------------------------------------
    |
    | Example:
    |
    | MongoDB:
    | 6a83070439b0e987692110f5
    |
    | Customer enters:
    | 692110F5
    |
    */

    else if (/^[a-f0-9]{8}$/i.test(orderId)) {
      const matches = await Order.aggregate([
        {
          $addFields: {
            stringId: {
              $toString: "$_id",
            },
          },
        },

        {
          $match: {
            stringId: {
              $regex: `${orderId}$`,
              $options: "i",
            },
          },
        },

        {
          $limit: 2,
        },
      ]);

      /*
       * Normally there will only be one match.
       */

      if (matches.length === 1) {
        order = matches[0];
      }

      if (matches.length > 1) {
        return NextResponse.json(
          {
            success: false,
            message:
              "More than one order matches this ID. Please contact Bejeweled.",
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | INVALID FORMAT
    |--------------------------------------------------------------------------
    */

    else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid Bejeweled Order ID.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ORDER NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't find an order with this ID.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SAFE TRACKING RESPONSE
    |--------------------------------------------------------------------------
    |
    | Do NOT expose:
    |
    | phone
    | email
    | delivery address
    |
    */

    return NextResponse.json(
      {
        success: true,

        order: {
          _id: order._id.toString(),

          status: order.status,

          createdAt: order.createdAt,

          total: order.total,

          paymentMethod: order.paymentMethod,

          items: order.items.map(
            (item: {
              name: string;
              image: string;
              quantity: number;
            }) => ({
              name: item.name,
              image: item.image,
              quantity: item.quantity,
            })
          ),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Track order error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to track your order right now. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}