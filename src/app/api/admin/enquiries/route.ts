import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const url = req.nextUrl;
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { customerName: { contains: q, mode: "insensitive" } },
        { whatsappNumber: { contains: q } },
        { enquiryNumber: { contains: q, mode: "insensitive" } },
      ];
    }

    const [enquiries, counts] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        include: {
          selectedProducts: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrls: true,
                  basePrice: true,
                },
              },
            },
          },
        },
        orderBy: [{ submittedAt: "desc" }],
      }),
      // Status counts (unfiltered by search for the summary cards)
      prisma.enquiry.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const c of counts) {
      statusCounts[c.status] = c._count.status;
    }

    return NextResponse.json({ enquiries, statusCounts });
  } catch (error) {
    console.error("Admin enquiries list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}
