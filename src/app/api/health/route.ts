import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, unknown> = {};

  // 1. Check env vars
  checks.DATABASE_URL_SET = !!process.env.DATABASE_URL;
  checks.DIRECT_URL_SET = !!process.env.DIRECT_URL;

  // 2. Try database connection + product count
  try {
    const count = await prisma.product.count();
    checks.db_connected = true;
    checks.product_count = count;
  } catch (e) {
    checks.db_connected = false;
    checks.db_error = e instanceof Error ? e.message : String(e);
  }

  const ok = checks.db_connected === true && (checks.product_count as number) > 0;

  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 503 });
}
