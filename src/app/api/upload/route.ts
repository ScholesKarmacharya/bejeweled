import {
  NextRequest,
  NextResponse,
} from "next/server";

import cloudinary from "@/lib/cloudinary";

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

  return await verifyAdminSessionToken(token);
}

/* =========================================================
   CLOUDINARY BUFFER UPLOAD
========================================================= */

function uploadBuffer(
  buffer: Buffer
): Promise<{
  secure_url: string;
}> {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "bejeweled/products",

            resource_type: "image",

            transformation: [
              {
                width: 1400,
                height: 1400,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(
                new Error(
                  "Cloudinary did not return an upload result."
                )
              );

              return;
            }

            resolve({
              secure_url:
                result.secure_url,
            });
          }
        );

      uploadStream.end(buffer);
    }
  );
}

/* =========================================================
   POST IMAGE
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

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select an image.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE TYPE
    ====================================================== */

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only image files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       MAX 8 MB
    ====================================================== */

    const maxSize =
      8 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image must be smaller than 8 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const result =
      await uploadBuffer(
        buffer
      );

    return NextResponse.json(
      {
        success: true,

        imageUrl:
          result.secure_url,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Image upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}