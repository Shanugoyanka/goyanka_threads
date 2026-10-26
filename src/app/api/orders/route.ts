import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getNextOrderNumber(): Promise<string> {
  const orders = await prisma.order.findMany({
    select: { orderNumber: true },
    where: { orderNumber: { startsWith: "GT-O-" } },
  });

  let maxNum = 1000;
  for (const o of orders) {
    const match = o.orderNumber.match(/^GT-O-(\d+)$/);
    if (match) {
      const n = parseInt(match[1]);
      if (n > maxNum) maxNum = n;
    }
  }
  return `GT-O-${maxNum + 1}`;
}

function validateWhatsApp(num: string): boolean {
  const cleaned = num.replace(/[\s\-()]/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customerName,
      whatsappNumber,
      shippingAddress,
      veilColour,
      veilLength,
      blusher,
      veilShape,
      veilShapeOther,
      stonePlacement,
      stonePlacementOther,
      stoneDensity,
      stoneDensityOther,
      stoneColor,
      borderDetails,
      customisation,
      customisationText,
      customisationSize,
      customisationPlacement,
      additionalInstructions,
      weddingDate,
      source,
      campaign,
    } = body;

    // Validate required fields
    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
      return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
    }
    if (!whatsappNumber || !validateWhatsApp(whatsappNumber)) {
      return NextResponse.json({ error: "Please provide a valid 10-digit mobile number." }, { status: 400 });
    }
    if (!shippingAddress || typeof shippingAddress !== "string" || shippingAddress.trim().length < 10) {
      return NextResponse.json({ error: "Please provide your complete shipping address." }, { status: 400 });
    }
    if (!veilColour || !veilLength) {
      return NextResponse.json({ error: "Veil colour and length are required." }, { status: 400 });
    }
    if (!veilShape) {
      return NextResponse.json({ error: "Please select a veil shape." }, { status: 400 });
    }
    if (!borderDetails) {
      return NextResponse.json({ error: "Please provide border details." }, { status: 400 });
    }
    if (!customisation) {
      return NextResponse.json({ error: "Please select a customisation option." }, { status: 400 });
    }
    if (!weddingDate) {
      return NextResponse.json({ error: "Wedding date is required." }, { status: 400 });
    }

    const cleanedPhone = whatsappNumber.replace(/[\s\-()]/g, "");
    const cleanSource = typeof source === "string" ? source.slice(0, 50).replace(/[^\w\-]/g, "") : null;
    const cleanCampaign = typeof campaign === "string" ? campaign.slice(0, 100).replace(/[^\w\-]/g, "") : null;

    let order = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const orderNumber = await getNextOrderNumber();
        order = await prisma.order.create({
          data: {
            orderNumber,
            status: "NEW",
            customerName: customerName.trim(),
            whatsappNumber: cleanedPhone,
            shippingAddress: shippingAddress.trim(),
            veilColour: String(veilColour).trim(),
            veilLength: String(veilLength).trim(),
            blusher: blusher === "none" ? null : (blusher || null),
            veilShape: veilShape || "round",
            veilShapeOther: veilShape === "other" ? (veilShapeOther || "").trim().slice(0, 100) : null,
            stonePlacement: stonePlacement || null,
            stonePlacementOther: stonePlacement === "other" ? (stonePlacementOther || "").trim().slice(0, 200) : null,
            stoneDensity: stoneDensity || null,
            stoneDensityOther: stoneDensity === "other" ? (stoneDensityOther || "").trim().slice(0, 100) : null,
            stoneColor: stoneColor || null,
            borderDetails: borderDetails.trim().slice(0, 500),
            customisation,
            customisationText: customisationText ? String(customisationText).trim().slice(0, 200) : null,
            customisationSize: customisationSize ? String(customisationSize).trim().slice(0, 100) : null,
            customisationPlacement: customisationPlacement ? String(customisationPlacement).trim().slice(0, 100) : null,
            additionalInstructions: additionalInstructions ? String(additionalInstructions).trim().slice(0, 1000) : null,
            weddingDate,
            source: cleanSource || null,
            campaign: cleanCampaign || null,
          },
        });
        break;
      } catch (e: unknown) {
        const prismaError = e as { code?: string };
        if (prismaError.code === "P2002" && attempt < 2) continue;
        throw e;
      }
    }

    if (!order) {
      return NextResponse.json({ error: "Could not create order. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Order submission error:", message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
