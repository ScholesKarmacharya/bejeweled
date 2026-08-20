import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

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
    request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return await verifyAdminSessionToken(
    token
  );
}

/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const product =
      await Product.findById(
        id
      ).lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
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
          "Unable to load product.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export async function PATCH(
  request: NextRequest,
  context: {
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

    const { id } =
      await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

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
      typeof name !==
        "string" ||
      !name.trim() ||
      typeof description !==
        "string" ||
      !description.trim() ||
      typeof price !==
        "number" ||
      price < 0 ||
      typeof category !==
        "string" ||
      !category.trim() ||
      typeof image !==
        "string" ||
      !image.trim() ||
      typeof stock !==
        "number" ||
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

    if (
      image.startsWith(
        "data:image/"
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Base64 images are not allowed.",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await Product.findByIdAndUpdate(
        id,
        {
          name:
            name.trim(),

          description:
            description.trim(),

          price,

          category:
            category.trim(),

          image:
            image.trim(),

          stock,

          featured:
            Boolean(
              featured
            ),
        },
        {
          new: true,

          runValidators: true,
        }
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    revalidatePath("/");
    revalidatePath(
      "/products"
    );

    revalidatePath(
      `/products/${id}`
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Product updated successfully.",

        product,
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
          "Unable to update product.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export async function DELETE(
  request: NextRequest,
  context: {
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

    const { id } =
      await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const product =
      await Product.findByIdAndDelete(
        id
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    revalidatePath("/");
    revalidatePath(
      "/products"
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Product deleted successfully.",
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
          "Unable to delete product.",
      },
      {
        status: 500,
      }
    );
  }
}