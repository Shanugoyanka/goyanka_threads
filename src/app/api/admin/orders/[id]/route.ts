import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to fetch order." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();

    const allowedFields = [
      "status",
      "assignedTo",
      "internalNotes",
      "dispatchedAt",
      "deliveredAt",
      "firstOpenedAt",
      "dispatchDate",
      "customerName",
      "whatsappNumber",
      "shippingAddress",
      "veilWidth",
      "veilColour",
      "veilLength",
      "veilShape",
      "veilShapeOther",
      "blusher",
      "borderDetails",
      "stonePlacement",
      "stonePlacementOther",
      "stoneDensity",
      "stoneDensityOther",
      "stoneColor",
      "customisation",
      "customisationText",
      "customisationSize",
      "customisationPlacement",
      "additionalInstructions",
      "weddingDate",
    ];
    const data: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        data[key] = body[key];
      }
    }

    if (data.status === "SHIPPED" && !data.dispatchedAt) {
      data.dispatchedAt = new Date().toISOString();
    }
    if (data.status === "DELIVERED" && !data.deliveredAt) {
      data.deliveredAt = new Date().toISOString();
    }

    const order = await prisma.order.update({
      where: { id },
      data,
    });

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
