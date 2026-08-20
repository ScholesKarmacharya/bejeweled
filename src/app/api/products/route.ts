import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

/* =========================================================
   ADMIN AUTH CHECK
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
   GET PRODUCTS
========================================================= */

export async function GET() {
  try {
    await connectDB();

    const products =
      await Product.find()
        .select(
          "_id name description price category image stock featured createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,
        products,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   CREATE PRODUCT
========================================================= */

export async function POST(
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

    /*
      Do not allow new Base64 images.
    */

    if (
      image.startsWith(
        "data:image/"
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Base64 images are not allowed. Please upload the image first.",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await Product.create({
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
      });

    revalidatePath("/");
    revalidatePath(
      "/products"
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Product created successfully",

        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}