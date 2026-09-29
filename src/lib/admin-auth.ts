import { NextRequest, NextResponse } from "next/server";

/**
 * Verify Basic Auth on admin API routes (defense-in-depth).
 * The proxy already checks auth, but API routes verify independently
 * in case the proxy matcher is misconfigured or bypassed.
 *
 * Returns null if authorized, or a 401 NextResponse if not.
 */
export function verifyAdminAuth(request: NextRequest): NextResponse | null {
  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = atob(authHeader.slice(6));
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) throw new Error("bad format");

    const username = decoded.slice(0, colonIdx);
    const password = decoded.slice(colonIdx + 1);

    if (username !== validUser || password !== validPass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
