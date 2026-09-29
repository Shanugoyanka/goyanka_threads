import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/admin-auth";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/enquiries/[id]">
) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const { id } = await ctx.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        selectedProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                basePrice: true,
                minPrice: true,
                maxPrice: true,
                imageUrls: true,
                fabric: true,
                veilLength: true,
              },
            },
          },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    // Mark as opened if first time
    if (!enquiry.firstOpenedAt) {
      await prisma.enquiry.update({
        where: { id },
        data: { firstOpenedAt: new Date() },
      });
      enquiry.firstOpenedAt = new Date();
    }

    return NextResponse.json({ enquiry });
  } catch (error) {
    console.error("Admin enquiry detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/enquiries/[id]">
) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const { id } = await ctx.params;
    const body = await req.json();

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    // Status change
    if (body.status && typeof body.status === "string") {
      const allowed = [
        "NEW",
        "CONTACTED",
        "IN_DISCUSSION",
        "PAYMENT_PENDING",
        "ORDERED",
        "CLOSED",
      ];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updateData.status = body.status;

      // Set contactedAt on first CONTACTED
      if (body.status === "CONTACTED" && !existing.contactedAt) {
        updateData.contactedAt = new Date();
      }

      // Set convertedAt on first ORDERED
      if (body.status === "ORDERED" && !existing.convertedAt) {
        updateData.convertedAt = new Date();
      }
    }

    // Assignment
    if (body.assignedTo !== undefined) {
      updateData.assignedTo =
        typeof body.assignedTo === "string" && body.assignedTo.trim()
          ? body.assignedTo.trim().slice(0, 50)
          : null;
    }

    // Internal notes
    if (body.internalNotes !== undefined) {
      updateData.internalNotes =
        typeof body.internalNotes === "string"
          ? body.internalNotes.slice(0, 5000)
          : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ enquiry: updated });
  } catch (error) {
    console.error("Admin enquiry update error:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
