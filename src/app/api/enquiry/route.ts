import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getNextEnquiryNumber(): Promise<string> {
  const enquiries = await prisma.enquiry.findMany({
    select: { enquiryNumber: true },
    where: { enquiryNumber: { startsWith: "GT-" } },
  });

  let maxNum = 1000;
  for (const e of enquiries) {
    const match = e.enquiryNumber.match(/^GT-(\d+)$/);
    if (match) {
      const n = parseInt(match[1]);
      if (n > maxNum) maxNum = n;
    }
  }
  return `GT-${maxNum + 1}`;
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
      weddingDate,
      weddingDateNotFixed,
      outfitColour,
      customOutfitColour,
      preferredStyle,
      budgetMin,
      budgetMax,
      personalization,
      productIds,
      source,
      campaign,
      idempotencyKey,
    } = body;

    // Validate required fields
    if (
      !customerName ||
      typeof customerName !== "string" ||
      customerName.trim().length < 2
    ) {
      return NextResponse.json(
        { error: "Please provide your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!whatsappNumber || !validateWhatsApp(whatsappNumber)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (productIds && !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "Invalid product selection." },
        { status: 400 }
      );
    }

    const safeProductIds: string[] = Array.isArray(productIds) ? productIds : [];

    const cleanedPhone = whatsappNumber.replace(/[\s\-()]/g, "");

    // Duplicate prevention
    if (idempotencyKey) {
      const recent = await prisma.enquiry.findFirst({
        where: {
          whatsappNumber: cleanedPhone,
          submittedAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        },
        include: { selectedProducts: true },
        orderBy: { submittedAt: "desc" },
      });
      if (recent) {
        const recentProductIds = recent.selectedProducts
          .map((sp) => sp.productId)
          .sort();
        const newProductIds = [...safeProductIds].sort();
        if (JSON.stringify(recentProductIds) === JSON.stringify(newProductIds)) {
          return NextResponse.json({
            success: true,
            enquiryNumber: recent.enquiryNumber,
            duplicate: true,
            message: "This enquiry was already submitted.",
          });
        }
      }
    }

    // Filter out static fallback IDs (they aren't in the DB)
    const dbProductIds = safeProductIds.filter(
      (id: string) => !id.startsWith("static-")
    );

    if (dbProductIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: dbProductIds } },
      });
      if (products.length === 0) {
        return NextResponse.json(
          { error: "Selected products not found." },
          { status: 400 }
        );
      }
    }

    // Sanitize source/campaign — only allow safe short strings
    const cleanSource =
      typeof source === "string" ? source.slice(0, 50).replace(/[^\w\-]/g, "") : null;
    const cleanCampaign =
      typeof campaign === "string" ? campaign.slice(0, 100).replace(/[^\w\-]/g, "") : null;

    // Generate sequential enquiry number with retry for uniqueness
    let enquiry = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const enquiryNumber = await getNextEnquiryNumber();
        enquiry = await prisma.enquiry.create({
          data: {
            enquiryNumber,
            status: "NEW",
            customerName: customerName.trim(),
            whatsappNumber: cleanedPhone,
            weddingDate: weddingDate || null,
            weddingDateNotFixed: weddingDateNotFixed === true,
            outfitColour: outfitColour || null,
            customOutfitColour:
              typeof customOutfitColour === "string"
                ? customOutfitColour.trim().slice(0, 50)
                : null,
            preferredStyle: preferredStyle || null,
            budgetMin: budgetMin ?? null,
            budgetMax: budgetMax ?? null,
            personalization: personalization || null,
            source: cleanSource || null,
            campaign: cleanCampaign || null,
            selectedProducts: dbProductIds.length > 0
              ? {
                  create: dbProductIds.map((productId: string) => ({
                    productId,
                  })),
                }
              : undefined,
          },
        });
        break;
      } catch (e: unknown) {
        const prismaError = e as { code?: string };
        if (prismaError.code === "P2002" && attempt < 2) continue;
        throw e;
      }
    }

    if (!enquiry) {
      return NextResponse.json(
        { error: "Could not create enquiry. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      enquiryNumber: enquiry.enquiryNumber,
      enquiryId: enquiry.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Enquiry submission error:", message);

    // Detect common DB issues and give a useful message
    const isDbError =
      message.includes("Can't reach database") ||
      message.includes("connect") ||
      message.includes("ECONNREFUSED") ||
      message.includes("prisma") ||
      message.includes("P1001");

    return NextResponse.json(
      {
        error: isDbError
          ? "Our system is temporarily unable to save enquiries. Please try again in a moment or reach out on WhatsApp directly."
          : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
