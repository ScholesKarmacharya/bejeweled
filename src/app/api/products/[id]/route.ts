import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

/* =========================================================
   ADMIN AUTH
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
   GET ONE PRODUCT
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

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE PRODUCT
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
    /* AUTH */

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

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      featured,
    } = body;

    if (
      !name ||
      !description ||
      typeof price !== "number" ||
      price < 0 ||
      !category ||
      !image ||
      typeof stock !== "number" ||
      stock < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide valid product information.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        {
          name: name.trim(),

          description:
            description.trim(),

          price,

          category:
            category.trim(),

          image:
            image.trim(),

          stock,

          featured:
            Boolean(featured),
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found",
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
          "Product updated successfully",

        product:
          updatedProduct,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update product",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE PRODUCT
   ADMIN ONLY
========================================================= */

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

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    const deletedProduct =
      await Product.findByIdAndDelete(
        id
      );

    if (!deletedProduct) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found",
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
          "Product deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}