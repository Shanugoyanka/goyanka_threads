import { NextRequest, NextResponse } from "next/server";
import { colourOptions, budgetOptions, styleOptions } from "@/data/discoverOptions";

/**
 * Developer testing endpoint — GET /api/products/test-match
 *
 * Runs the matching API for every combination of style × colour × budget
 * and reports which combinations produce "best" matches vs only "also-like".
 *
 * Usage:
 *   curl http://localhost:3000/api/products/test-match
 *   curl http://localhost:3000/api/products/test-match?verbose=true
 *
 * Only available in development.
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const verbose = req.nextUrl.searchParams.get("verbose") === "true";
  const baseUrl = req.nextUrl.origin;

  const styles = styleOptions.map((s) => s.id);
  const colours = colourOptions.map((c) => c.id);
  const budgets = budgetOptions.map((b) => b.id);

  type TestResult = {
    style: string;
    colour: string;
    budget: string;
    bestCount: number;
    alsoLikeCount: number;
    total: number;
    topMatch: string | null;
    topScore: number;
    issue: string | null;
  };

  const results: TestResult[] = [];
  let issueCount = 0;

  for (const style of styles) {
    for (const colour of colours) {
      for (const budget of budgets) {
        const budgetObj = budgetOptions.find((b) => b.id === budget)!;

        const res = await fetch(`${baseUrl}/api/products/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            budgetMin: budgetObj.min,
            budgetMax: budgetObj.max,
            preferredStyle: style,
            outfitColour: colour !== "other" ? colour : null,
          }),
        });

        const data = await res.json();
        const best: unknown[] = data.bestMatches || [];
        const also: unknown[] = data.alsoLike || [];
        const all = [...best, ...also] as Array<{
          name: string;
          matchScore: number;
        }>;

        let issue: string | null = null;
        if (best.length === 0 && also.length === 0) {
          issue = "NO RESULTS";
          issueCount++;
        } else if (best.length === 0) {
          issue = "NO BEST MATCHES";
          issueCount++;
        }

        results.push({
          style,
          colour,
          budget,
          bestCount: best.length,
          alsoLikeCount: also.length,
          total: all.length,
          topMatch: all.length > 0 ? all[0].name : null,
          topScore: all.length > 0 ? all[0].matchScore : 0,
          issue,
        });
      }
    }
  }

  const summary = {
    totalCombinations: results.length,
    issueCount,
    coveragePercent: Math.round(
      ((results.length - issueCount) / results.length) * 100
    ),
    issueDetails: results.filter((r) => r.issue),
  };

  return NextResponse.json(
    verbose ? { summary, allResults: results } : summary,
    { status: 200 }
  );
}
