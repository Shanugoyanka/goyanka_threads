import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MatchRequest {
  budgetMin?: number;
  budgetMax?: number;
  preferredStyle?: string;
  outfitColour?: string;
  personalization?: string;
}

type RawProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

type ScoredProduct = RawProduct & {
  matchScore: number;
  matchTier: "best" | "also-like";
  matchLabel: string | null;
};

const BUCKET =
  "https://abovffewvfdlhvvqcvxy.supabase.co/storage/v1/object/public/goyanka%20threads";

/**
 * 4 hardcoded fallback products — shown when the database is
 * unreachable so customers always see *something*.
 */
const STATIC_FALLBACK = [
  {
    id: "static-1",
    name: "Minimal Scallop Bridal Veil",
    description: "A delicate scalloped edge with subtle shimmer — perfect for brides who love understated elegance.",
    category: "bridal-veil",
    styleTags: ["minimal", "elegant", "subtle"],
    colours: ["red", "maroon", "pink", "ivory"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Fine scalloped border with minimal sequin detailing",
    basePrice: 2999,
    minPrice: 2999,
    maxPrice: 3499,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [`${BUCKET}/01_red_minimal_scallop.jpg`],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 10,
    isFeatured: true,
    isSample: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchScore: 8,
    matchTier: "best" as const,
    matchLabel: null,
  },
  {
    id: "static-2",
    name: "Heavy Zardozi Bridal Veil",
    description: "Luxurious all-over zardozi metallic threadwork — for the bride who wants to make a grand statement.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "traditional", "luxurious"],
    colours: ["red", "maroon", "gold"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Full zardozi metallic threadwork with gold bullion wire",
    basePrice: 4999,
    minPrice: 4999,
    maxPrice: 5999,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [`${BUCKET}/09_red_heavy_zardozi.jpg`],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 18,
    isFeatured: true,
    isSample: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchScore: 8,
    matchTier: "best" as const,
    matchLabel: null,
  },
  {
    id: "static-3",
    name: "Personalized Name Bridal Veil",
    description: "Your names, initials or wedding date beautifully embroidered — a keepsake veil you'll treasure.",
    category: "bridal-veil",
    styleTags: ["personalized", "custom", "elegant"],
    colours: ["red", "maroon", "pink", "ivory"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Custom name/initials/date embroidered in metallic thread",
    basePrice: 4299,
    minPrice: 4299,
    maxPrice: 4999,
    customizationOptions: ["name", "initials", "date", "colour", "length"],
    status: "available",
    imageUrls: [`${BUCKET}/07_ivory_personalized.jpg`],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 14,
    isFeatured: true,
    isSample: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchScore: 7,
    matchTier: "best" as const,
    matchLabel: null,
  },
  {
    id: "static-4",
    name: "Floral Embroidered Bridal Veil",
    description: "Delicate floral embroidery with a graceful drape — for the bride who loves fine detail.",
    category: "bridal-veil",
    styleTags: ["elegant", "statement", "floral"],
    colours: ["red", "maroon", "pink"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Hand-embroidered floral motifs with thread and sequin accents",
    basePrice: 3999,
    minPrice: 3999,
    maxPrice: 4499,
    customizationOptions: ["colour", "border", "length"],
    status: "available",
    imageUrls: [`${BUCKET}/05_blush_floral_statement.jpg`],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 14,
    isFeatured: true,
    isSample: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchScore: 7,
    matchTier: "best" as const,
    matchLabel: null,
  },
];

/**
 * Budget-only fallback: returns all products sorted by price proximity.
 */
function budgetFallback(
  products: RawProduct[],
  budgetMin?: number,
  budgetMax?: number,
) {
  const mid =
    budgetMin != null && budgetMax != null
      ? (budgetMin + budgetMax) / 2
      : 4000;

  const scored: ScoredProduct[] = products
    .map((p) => {
      const distance = Math.abs(p.basePrice - mid);
      return {
        ...p,
        matchScore: Math.max(0, 10 - Math.floor(distance / 500)),
        matchTier: "best" as const,
        matchLabel: null,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.basePrice - b.basePrice);

  const splitAt = Math.max(3, Math.ceil(scored.length / 2));
  const bestMatches = scored.slice(0, splitAt);
  const alsoLike = scored
    .slice(splitAt)
    .map((p) => ({ ...p, matchTier: "also-like" as const }));

  return {
    bestMatches,
    alsoLike,
    total: scored.length,
    hasBestMatches: true,
  };
}

export async function POST(req: NextRequest) {
  let allProducts: RawProduct[] = [];
  let body: MatchRequest = {};

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { budgetMin, budgetMax, preferredStyle, outfitColour, personalization } = body;

  try {
    allProducts = await prisma.product.findMany({
      where: { status: { not: "discontinued" } },
    });

    if (allProducts.length === 0) {
      // DB connected but no products seeded — use static fallback
      return NextResponse.json({
        bestMatches: STATIC_FALLBACK,
        alsoLike: [],
        total: STATIC_FALLBACK.length,
        hasBestMatches: true,
      });
    }

    // ── Full scoring algorithm ──
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

      // Style: 0–4 pts
      if (preferredStyle && preferredStyle !== "not-sure") {
        const keywords = styleMap[preferredStyle] ?? [];
        const matchCount = styleTags.filter((t) => keywords.includes(t)).length;
        if (matchCount >= 2) score += 4;
        else if (matchCount === 1) score += 2;
      } else {
        score += 2;
      }

      // Budget: 0–4 pts
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

      // Colour: 0–3 pts
      if (outfitColour && outfitColour !== "other") {
        if (colours.includes(outfitColour)) {
          score += 3;
        } else if (
          (outfitColour === "ivory" && (colours.includes("pink") || colours.includes("pastel"))) ||
          (outfitColour === "pink" && (colours.includes("ivory") || colours.includes("pastel"))) ||
          (outfitColour === "pastel" && (colours.includes("pink") || colours.includes("ivory")))
        ) {
          score += 1;
        }
      } else {
        score += 1;
      }

      // Personalization: 0–2 pts
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

      // Availability: 0–1 pt
      if (product.status === "available") score += 1;

      // Tier (max ~14)
      let matchTier: "best" | "also-like";
      let matchLabel: string | null = null;

      if (score >= 10) {
        matchTier = "best";
        matchLabel = "Great match";
      } else if (score >= 7) {
        matchTier = "best";
      } else {
        matchTier = "also-like";
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

    // Promote if no best matches
    if (bestMatches.length === 0 && alsoLike.length > 0) {
      const promoted = alsoLike.splice(0, Math.min(4, alsoLike.length));
      bestMatches.push(
        ...promoted.map((p) => ({ ...p, matchTier: "best" as const })),
      );
    }

    // Final safety net
    if (bestMatches.length === 0 && alsoLike.length === 0) {
      return NextResponse.json(budgetFallback(allProducts, budgetMin, budgetMax));
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

    // If products were fetched but scoring failed, use budget fallback
    if (allProducts.length > 0) {
      return NextResponse.json(budgetFallback(allProducts, budgetMin, budgetMax));
    }

    // DB completely unreachable — return static fallback products
    return NextResponse.json({
      bestMatches: STATIC_FALLBACK,
      alsoLike: [],
      total: STATIC_FALLBACK.length,
      hasBestMatches: true,
    });
  }
}
