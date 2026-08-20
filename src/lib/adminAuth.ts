const COOKIE_NAME =
  "bejeweled_admin_session";

const SESSION_DURATION =
  60 * 60 * 8; // 8 hours

const SESSION_VERSION = 1;

export {
  COOKIE_NAME,
  SESSION_DURATION,
};

/* =========================================================
   TYPES
========================================================= */

type AdminSessionPayload = {
  email: string;
  iat: number;
  exp: number;
  version: number;
};

/* =========================================================
   BASE64 URL HELPERS
========================================================= */

function bytesToBase64Url(
  bytes: Uint8Array
) {
  let binary = "";

  for (const byte of bytes) {
    binary +=
      String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBytes(
  value: string
) {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    base64 +
    "=".repeat(
      (4 -
        (base64.length % 4)) %
        4
    );

  const binary =
    atob(padded);

  return Uint8Array.from(
    binary,
    (character) =>
      character.charCodeAt(0)
  );
}

/* =========================================================
   ENVIRONMENT
========================================================= */

function getAdminEmail() {
  const email =
    process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error(
      "ADMIN_EMAIL is not configured."
    );
  }

  return email
    .trim()
    .toLowerCase();
}

function getSessionSecret() {
  const secret =
    process.env
      .ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured."
    );
  }

  /*
   * Require a reasonably strong
   * production secret.
   */
  if (secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be at least 32 characters."
    );
  }

  return secret;
}

/* =========================================================
   HMAC KEY
========================================================= */

async function getKey() {
  const secret =
    getSessionSecret();

  return crypto.subtle.importKey(
    "raw",

    new TextEncoder().encode(
      secret
    ),

    {
      name: "HMAC",
      hash: "SHA-256",
    },

    false,

    [
      "sign",
      "verify",
    ]
  );
}

/* =========================================================
   CREATE SESSION TOKEN
========================================================= */

export async function createAdminSessionToken() {
  const email =
    getAdminEmail();

  const now =
    Math.floor(
      Date.now() / 1000
    );

  const payload: AdminSessionPayload =
    {
      email,

      iat: now,

      exp:
        now +
        SESSION_DURATION,

      version:
        SESSION_VERSION,
    };

  const encodedPayload =
    bytesToBase64Url(
      new TextEncoder().encode(
        JSON.stringify(
          payload
        )
      )
    );

  const key =
    await getKey();

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(
        encodedPayload
      )
    );

  const encodedSignature =
    bytesToBase64Url(
      new Uint8Array(
        signature
      )
    );

  return `${encodedPayload}.${encodedSignature}`;
}

/* =========================================================
   VERIFY SESSION TOKEN
========================================================= */

export async function verifyAdminSessionToken(
  token?: string | null
) {
  try {
    if (!token) {
      return false;
    }

    /*
     * Require exactly:
     *
     * payload.signature
     */
    const parts =
      token.split(".");

    if (
      parts.length !== 2
    ) {
      return false;
    }

    const [
      encodedPayload,
      encodedSignature,
    ] = parts;

    if (
      !encodedPayload ||
      !encodedSignature
    ) {
      return false;
    }

    const key =
      await getKey();

    /* =====================================================
       VERIFY SIGNATURE FIRST
    ===================================================== */

    const validSignature =
      await crypto.subtle.verify(
        "HMAC",

        key,

        base64UrlToBytes(
          encodedSignature
        ),

        new TextEncoder().encode(
          encodedPayload
        )
      );

    if (!validSignature) {
      return false;
    }

    /* =====================================================
       DECODE PAYLOAD
    ===================================================== */

    const payloadJson =
      new TextDecoder().decode(
        base64UrlToBytes(
          encodedPayload
        )
      );

    const payload =
      JSON.parse(
        payloadJson
      ) as Partial<AdminSessionPayload>;

    /* =====================================================
       VALIDATE PAYLOAD TYPES
    ===================================================== */

    if (
      typeof payload.email !==
        "string" ||
      typeof payload.iat !==
        "number" ||
      typeof payload.exp !==
        "number" ||
      typeof payload.version !==
        "number"
    ) {
      return false;
    }

    /* =====================================================
       VERSION
    ===================================================== */

    if (
      payload.version !==
      SESSION_VERSION
    ) {
      return false;
    }

    /* =====================================================
       ADMIN IDENTITY
    ===================================================== */

    if (
      payload.email
        .trim()
        .toLowerCase() !==
      getAdminEmail()
    ) {
      return false;
    }

    /* =====================================================
       TIME VALIDATION
    ===================================================== */

    const now =
      Math.floor(
        Date.now() / 1000
      );

    if (
      payload.exp <= now
    ) {
      return false;
    }

    /*
     * Reject impossible/future
     * issued-at values.
     */
    if (
      payload.iat >
      now + 60
    ) {
      return false;
    }

    /*
     * Prevent malformed tokens
     * claiming unusually long
     * expiration periods.
     */
    if (
      payload.exp -
        payload.iat >
      SESSION_DURATION
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}