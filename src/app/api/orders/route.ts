import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

async function isAdminAuthenticated(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      COOKIE_NAME
    )?.value;

  if (!token) {
    return false;
  }

  return await verifyAdminSessionToken(
    token
  );
}

/* =========================================================
   POST /api/orders
   PUBLIC
========================================================= */

export async function POST(
  request: NextRequest
) {
  const stockChanges: {
    productId: string;
    quantity: number;
  }[] = [];

  try {
    await connectDB();

    const body =
      await request.json();

    const {
      customer,
      items,
      paymentReference,
    } = body;

    /* =====================================================
       CUSTOMER
    ===================================================== */

    const fullName =
      typeof customer?.fullName ===
      "string"
        ? customer.fullName.trim()
        : "";

    const email =
      typeof customer?.email ===
      "string"
        ? customer.email
            .trim()
            .toLowerCase()
        : "";

    const phone =
      typeof customer?.phone ===
      "string"
        ? customer.phone.trim()
        : "";

    const address =
      typeof customer?.address ===
      "string"
        ? customer.address.trim()
        : "";

    const city =
      typeof customer?.city ===
      "string"
        ? customer.city.trim()
        : "";

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer information is incomplete.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       PAYMENT REFERENCE
    ===================================================== */

    const cleanedPaymentReference =
      typeof paymentReference ===
      "string"
        ? paymentReference.trim()
        : "";

    if (
      !cleanedPaymentReference ||
      cleanedPaymentReference.length <
        3 ||
      cleanedPaymentReference.length >
        100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid Fonepay transaction/reference ID.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Prevent the same payment reference
     * being used for multiple orders.
     */
    const existingPayment =
      await Order.findOne({
        paymentReference:
          cleanedPaymentReference,
      }).lean();

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This payment reference has already been used for another order.",
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       ITEMS
    ===================================================== */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your order is empty.",
        },
        {
          status: 400,
        }
      );
    }

    const invalidItem =
      items.some(
        (item) =>
          typeof item?.productId !==
            "string" ||
          !mongoose.Types.ObjectId.isValid(
            item.productId
          ) ||
          typeof item?.quantity !==
            "number" ||
          !Number.isInteger(
            item.quantity
          ) ||
          item.quantity < 1
      );

    if (invalidItem) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more order items are invalid.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       COMBINE DUPLICATES
    ===================================================== */

    const requestedProducts =
      new Map<string, number>();

    for (const item of items) {
      const previousQuantity =
        requestedProducts.get(
          item.productId
        ) || 0;

      requestedProducts.set(
        item.productId,
        previousQuantity +
          item.quantity
      );
    }

    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    const productIds =
      Array.from(
        requestedProducts.keys()
      );

    const databaseProducts =
      await Product.find({
        _id: {
          $in: productIds,
        },
      }).lean();

    if (
      databaseProducts.length !==
      productIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more products are no longer available.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       SECURE ITEMS + TOTAL
    ===================================================== */

    const secureItems: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }[] = [];

    let calculatedTotal = 0;

    for (
      const product of
      databaseProducts
    ) {
      const productId =
        product._id.toString();

      const quantity =
        requestedProducts.get(
          productId
        );

      if (!quantity) {
        continue;
      }

      if (
        typeof product.price !==
          "number" ||
        product.price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `${product.name} has an invalid price.`,
          },
          {
            status: 400,
          }
        );
      }

      if (
        typeof product.stock !==
          "number" ||
        product.stock < quantity
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              product.stock <= 0
                ? `${product.name} is out of stock.`
                : `Only ${product.stock} of ${product.name} ${
                    product.stock === 1
                      ? "is"
                      : "are"
                  } available.`,
          },
          {
            status: 400,
          }
        );
      }

      calculatedTotal +=
        product.price *
        quantity;

      secureItems.push({
        productId,

        name:
          product.name,

        price:
          product.price,

        quantity,

        image:
          product.image,
      });
    }

    if (
      calculatedTotal <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order total.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       REDUCE STOCK
    ===================================================== */

    for (
      const item of secureItems
    ) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id:
              item.productId,

            stock: {
              $gte:
                item.quantity,
            },
          },

          {
            $inc: {
              stock:
                -item.quantity,
            },
          },

          {
            new: true,
          }
        );

      if (!updatedProduct) {
        for (
          const change of
          stockChanges
        ) {
          await Product.findByIdAndUpdate(
            change.productId,
            {
              $inc: {
                stock:
                  change.quantity,
              },
            }
          );
        }

        return NextResponse.json(
          {
            success: false,

            message:
              "One of the products no longer has enough stock. Please refresh your cart and try again.",
          },
          {
            status: 409,
          }
        );
      }

      stockChanges.push({
        productId:
          item.productId,

        quantity:
          item.quantity,
      });
    }

    /* =====================================================
       CREATE ORDER
    ===================================================== */

    try {
      const order =
        await Order.create({
          customer: {
            fullName,
            email,
            phone,
            address,
            city,
          },

          items:
            secureItems,

          total:
            calculatedTotal,

          paymentMethod:
            "Fonepay",

          paymentReference:
            cleanedPaymentReference,

          paymentStatus:
            "Pending",

          status:
            "Pending",
        });

      return NextResponse.json(
        {
          success: true,

          message:
            "Order placed successfully.",

          order: {
            _id:
              order._id,

            total:
              order.total,

            paymentMethod:
              order.paymentMethod,

            paymentReference:
              order.paymentReference,

            paymentStatus:
              order.paymentStatus,

            status:
              order.status,

            createdAt:
              order.createdAt,
          },
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      /*
       * Restore stock if MongoDB
       * order creation fails.
       */

      for (
        const change of
        stockChanges
      ) {
        await Product.findByIdAndUpdate(
          change.productId,
          {
            $inc: {
              stock:
                change.quantity,
            },
          }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Order creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to place order.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   GET /api/orders
   ADMIN ONLY
========================================================= */

export async function GET(
  request: NextRequest
) {
  try {
    const authenticated =
      await isAdminAuthenticated(
        request
      );

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

    const orders =
      await Order.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Orders fetch error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}