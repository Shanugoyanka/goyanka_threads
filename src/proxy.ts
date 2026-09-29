import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Timing-safe string comparison using Web Crypto API.
 * Hashes both inputs to normalize length, then compares byte-by-byte.
 */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const aHash = new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(a))
  );
  const bHash = new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(b))
  );
  let result = 0;
  for (let i = 0; i < aHash.length; i++) {
    result |= aHash[i] ^ bHash[i];
  }
  return result === 0;
}

export async function proxy(request: NextRequest) {
  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    return new NextResponse("Admin not configured", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Goyanka Threads Admin"',
      },
    });
  }

  try {
    const base64 = authHeader.slice(6);
    const decoded = atob(base64);
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) throw new Error("Invalid format");

    const username = decoded.slice(0, colonIdx);
    const password = decoded.slice(colonIdx + 1);

    const [userOk, passOk] = await Promise.all([
      safeEqual(username, validUser),
      safeEqual(password, validPass),
    ]);

    if (!userOk || !passOk) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Goyanka Threads Admin"',
        },
      });
    }
  } catch {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Goyanka Threads Admin"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
