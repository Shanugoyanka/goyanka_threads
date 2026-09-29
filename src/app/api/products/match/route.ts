import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MatchRequest {
  budgetMin?: number;
  budgetMax?: number;
  preferredStyle?: string;
  outfitColour?: string;
  personalization?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: MatchRequest = await req.json();
    const { budgetMin, budgetMax, preferredStyle, outfitColour, personalization } = body;

    const allProducts = await prisma.product.findMany({
      where: { status: { not: "discontinued" } },
    });

    type ScoredProduct = (typeof allProducts)[number] & {
      matchScore: number;
      matchTier: "best" | "also-like";
      matchLabel: string | null;
    };

    const styleMap: Record<string, string[]> = {
      minimal: ["minimal", "elegant", "subtle", "lightweight", "pearl", "sparkle"],
      heavy: ["heavy", "statement", "traditional", "luxurious", "floral"],
      personalized: ["personalized", "custom", "versatile", "meaningful"],
    };

    const scored: ScoredProduct[] = allProducts.map((product) => {
      let score = 0;
      const styleTags = product.styleTags as string[];
      const colours = product.colours as string[];
      const customOpts = product.customizationOptions as string[];

      // ── Style match: 0–4 pts (strongest signal) ──
      if (preferredStyle && preferredStyle !== "not-sure") {
        const keywords = styleMap[preferredStyle] ?? [];
        const matchCount = styleTags.filter((t) => keywords.includes(t)).length;
        if (matchCount >= 2) score += 4;
        else if (matchCount === 1) score += 2;
      } else {
        score += 2;
      }

      // ── Budget match: 0–4 pts (strong signal) ──
      if (budgetMin != null && budgetMax != null) {
        const prodMin = product.minPrice ?? product.basePrice;
        const prodMax = product.maxPrice ?? product.basePrice;

        if (prodMin <= budgetMax && prodMax >= budgetMin) {
          score += 3;
          if (product.basePrice >= budgetMin && product.basePrice <= budgetMax) {
            score += 1;
          }
        } else if (prodMin <= budgetMax * 1.25) {
          score += 1;
        }
      } else {
        score += 2;
      }

      // ── Colour match: 0–3 pts (medium signal) ──
      if (outfitColour && outfitColour !== "other") {
        if (colours.includes(outfitColour)) {
          score += 3;
        }
        // Cross-matching: pastel ↔ pink ↔ ivory
        else if (
          (outfitColour === "ivory" && (colours.includes("pink") || colours.includes("pastel"))) ||
          (outfitColour === "pink" && (colours.includes("ivory") || colours.includes("pastel"))) ||
          (outfitColour === "pastel" && (colours.includes("pink") || colours.includes("ivory")))
        ) {
          score += 1;
        }
      } else {
        score += 1;
      }

      // ── Personalization match: 0–2 pts ──
      if (personalization && personalization !== "none" && personalization !== "not-sure") {
        const personalMap: Record<string, string[]> = {
          names: ["name", "initials"],
          date: ["date"],
          "names-date": ["name", "initials", "date"],
          "custom-text": ["custom-text", "custom"],
        };
        const wanted = personalMap[personalization] ?? [];
        const matchCount = wanted.filter((w) => customOpts.includes(w)).length;
        if (matchCount >= 2) score += 2;
        else if (matchCount >= 1) score += 1;
      } else if (preferredStyle === "personalized") {
        if (customOpts.length >= 4) score += 2;
        else if (customOpts.length >= 2) score += 1;
      } else {
        score += 1;
      }

      // ── Availability bonus: 0–1 pt ──
      if (product.status === "available") score += 1;

      // ── Tier assignment (out of max ~14) ──
      let matchTier: ScoredProduct["matchTier"];
      let matchLabel: string | null = null;

      if (score >= 10) {
        matchTier = "best";
        matchLabel = "Great match";
      } else if (score >= 7) {
        matchTier = "best";
        matchLabel = null;
      } else {
        matchTier = "also-like";
        matchLabel = null;
      }

      return { ...product, matchScore: score, matchTier, matchLabel };
    });

    scored.sort((a, b) => {
      const tierOrder = { best: 0, "also-like": 1 };
      if (tierOrder[a.matchTier] !== tierOrder[b.matchTier]) {
        return tierOrder[a.matchTier] - tierOrder[b.matchTier];
      }
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return 0;
    });

    const bestMatches = scored.filter((p) => p.matchTier === "best");
    const alsoLike = scored.filter((p) => p.matchTier === "also-like");

    if (bestMatches.length === 0 && alsoLike.length > 0) {
      const promoted = alsoLike.splice(0, Math.min(4, alsoLike.length));
      bestMatches.push(
        ...promoted.map((p) => ({ ...p, matchTier: "best" as const }))
      );
    }

    return NextResponse.json({
      bestMatches,
      alsoLike,
      total: scored.length,
      hasBestMatches: bestMatches.length > 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Product match error:", message);
    return NextResponse.json(
      {
        error: "Failed to find matching products",
        detail: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
