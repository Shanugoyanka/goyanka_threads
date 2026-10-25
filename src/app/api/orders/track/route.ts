import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.json({ error: "Order number is required." }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        orderNumber: true,
        status: true,
        customerName: true,
        veilColour: true,
        veilShape: true,
        customisation: true,
        weddingDate: true,
        dispatchDate: true,
        submittedAt: true,
        dispatchedAt: true,
        deliveredAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
