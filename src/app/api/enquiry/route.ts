import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateEnquiryNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `GT-${code}`;
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
      city,
      pincode,
      outfitColour,
      preferredStyle,
      budgetMin,
      budgetMax,
      productIds,
      idempotencyKey,
    } = body;

    // Validate required fields
    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
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

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one veil design." },
        { status: 400 }
      );
    }

    // Duplicate prevention: check if same phone + same products submitted in last 5 minutes
    if (idempotencyKey) {
      const recent = await prisma.enquiry.findFirst({
        where: {
          whatsappNumber: whatsappNumber.replace(/[\s\-()]/g, ""),
          submittedAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        },
        include: { selectedProducts: true },
        orderBy: { submittedAt: "desc" },
      });
      if (recent) {
        const recentProductIds = recent.selectedProducts.map((sp) => sp.productId).sort();
        const newProductIds = [...productIds].sort();
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

    // Verify products exist
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (products.length === 0) {
      return NextResponse.json(
        { error: "Selected products not found." },
        { status: 400 }
      );
    }

    const enquiryNumber = generateEnquiryNumber();

    const enquiry = await prisma.enquiry.create({
      data: {
        enquiryNumber,
        status: "NEW",
        customerName: customerName.trim(),
        whatsappNumber: whatsappNumber.replace(/[\s\-()]/g, ""),
        weddingDate: weddingDate || null,
        city: city || null,
        pincode: pincode || null,
        outfitColour: outfitColour || null,
        preferredStyle: preferredStyle || null,
        budgetMin: budgetMin ?? null,
        budgetMax: budgetMax ?? null,
        selectedProducts: {
          create: productIds.map((productId: string) => ({
            productId,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      enquiryNumber: enquiry.enquiryNumber,
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
