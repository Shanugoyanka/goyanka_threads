import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MatchRequest {
  budgetMin?: number;
  budgetMax?: number;
  preferredStyle?: string;
  outfitColour?: string;
  wantsCustomization?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: MatchRequest = await req.json();
    const { budgetMin, budgetMax, preferredStyle, outfitColour, wantsCustomization } = body;

    const allProducts = await prisma.product.findMany({
      where: { status: { not: "discontinued" } },
    });

    type ScoredProduct = (typeof allProducts)[number] & {
      matchScore: number;
      matchTier: "exact" | "close" | "recommendation";
    };

    const scored: ScoredProduct[] = allProducts.map((product) => {
      let score = 0;
      const styleTags = product.styleTags as string[];
      const colours = product.colours as string[];

      // Budget match (0-3 points)
      if (budgetMin != null && budgetMax != null) {
        const prodMin = product.minPrice ?? product.basePrice;
        const prodMax = product.maxPrice ?? product.basePrice;
        if (prodMin <= budgetMax && prodMax >= budgetMin) {
          score += 3; // overlapping range
          if (product.basePrice >= budgetMin && product.basePrice <= budgetMax) {
            score += 1; // base price in exact range
          }
        }
      } else {
        score += 2; // no budget specified, partial credit
      }

      // Style match (0-3 points)
      if (preferredStyle && preferredStyle !== "not-sure") {
        const styleMap: Record<string, string[]> = {
          minimal: ["minimal", "elegant", "subtle", "lightweight"],
          heavy: ["heavy", "statement", "traditional", "luxurious"],
          personalized: ["personalized", "versatile", "fusion", "custom"],
        };
        const keywords = styleMap[preferredStyle] ?? [];
        const matchCount = styleTags.filter((t) => keywords.includes(t)).length;
        if (matchCount >= 2) score += 3;
        else if (matchCount === 1) score += 2;
      } else {
        score += 1; // "not sure" gets partial credit
      }

      // Colour match (0-2 points)
      if (outfitColour) {
        if (colours.includes(outfitColour)) {
          score += 2;
        }
      } else {
        score += 1;
      }

      // Customization match (0-1 point)
      if (wantsCustomization) {
        const opts = product.customizationOptions as string[];
        if (opts.length > 0) score += 1;
      } else {
        score += 1;
      }

      // Availability bonus (0-1 point)
      if (product.status === "available") score += 1;

      const maxPossible = 10;
      let matchTier: ScoredProduct["matchTier"];
      if (score >= 8) matchTier = "exact";
      else if (score >= 5) matchTier = "close";
      else matchTier = "recommendation";

      return { ...product, matchScore: score, matchTier };
    });

    scored.sort((a, b) => {
      const tierOrder = { exact: 0, close: 1, recommendation: 2 };
      if (tierOrder[a.matchTier] !== tierOrder[b.matchTier]) {
        return tierOrder[a.matchTier] - tierOrder[b.matchTier];
      }
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return 0;
    });

    const exact = scored.filter((p) => p.matchTier === "exact");
    const close = scored.filter((p) => p.matchTier === "close");
    const recommendations = scored.filter((p) => p.matchTier === "recommendation");

    return NextResponse.json({
      exact,
      close,
      recommendations,
      total: scored.length,
      hasExactMatches: exact.length > 0,
    });
  } catch (error) {
    console.error("Product match error:", error);
    return NextResponse.json(
      { error: "Failed to find matching products" },
      { status: 500 }
    );
  }
}
