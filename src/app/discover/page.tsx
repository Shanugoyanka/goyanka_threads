"use client";

import { useState, useCallback } from "react";
import PreferenceWizard from "@/components/discover/PreferenceWizard";
import ProductResults from "@/components/discover/ProductResults";
import EnquiryForm from "@/components/discover/EnquiryForm";
import Confirmation from "@/components/discover/Confirmation";
import { PreferenceAnswers, getBudgetRange } from "@/data/discoverOptions";
import { MatchedProduct } from "@/components/discover/types";

type FlowStep = "preferences" | "results" | "enquiry" | "confirmation";

export default function DiscoverPage() {
  const [flowStep, setFlowStep] = useState<FlowStep>("preferences");
  const [preferences, setPreferences] = useState<PreferenceAnswers | null>(
    null
  );
  const [results, setResults] = useState<{
    bestMatches: MatchedProduct[];
    alsoLike: MatchedProduct[];
    hasBestMatches: boolean;
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enquiryNumber, setEnquiryNumber] = useState("");

  const handlePreferencesComplete = useCallback(
    async (answers: PreferenceAnswers) => {
      setPreferences(answers);
      setLoading(true);
      setError(null);

      try {
        const budget = getBudgetRange(answers.budgetRange);

        const res = await fetch("/api/products/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            budgetMin: budget.min,
            budgetMax: budget.max,
            preferredStyle: answers.preferredStyle,
            outfitColour:
              answers.outfitColour !== "other" ? answers.outfitColour : null,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong. Please try again.");
          setFlowStep("results");
          return;
        }

        setResults({
          bestMatches: data.bestMatches,
          alsoLike: data.alsoLike,
          hasBestMatches: data.hasBestMatches,
        });
        setFlowStep("results");
      } catch (err) {
        console.error("Network error:", err);
        setError("Could not connect. Please check your internet and try again.");
        setFlowStep("results");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const toggleProduct = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const getSelectedProducts = useCallback((): MatchedProduct[] => {
    if (!results) return [];
    const all = [...results.bestMatches, ...results.alsoLike];
    return all.filter((p) => selectedIds.has(p.id));
  }, [results, selectedIds]);

  const handleStartOver = useCallback(() => {
    setFlowStep("preferences");
    setPreferences(null);
    setResults(null);
    setSelectedIds(new Set());
    setEnquiryNumber("");
    setError(null);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Finding Your Perfect Veils...
          </h2>
          <p className="text-sm text-gray-500">
            Matching your preferences with our collection
          </p>
        </div>
      </div>
    );
  }

  if (flowStep === "preferences") {
    return (
      <PreferenceWizard
        onComplete={handlePreferencesComplete}
        initialAnswers={preferences ?? undefined}
      />
    );
  }

  if (flowStep === "results" && preferences) {
    // Error state
    if (error && !results) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-4">😔</p>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => handlePreferencesComplete(preferences)}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (results) {
      return (
        <ProductResults
          bestMatches={results.bestMatches}
          alsoLike={results.alsoLike}
          hasBestMatches={results.hasBestMatches}
          preferences={preferences}
          selectedIds={selectedIds}
          onToggleSelect={toggleProduct}
          onEditPreferences={() => setFlowStep("preferences")}
          onProceedToEnquiry={() => setFlowStep("enquiry")}
        />
      );
    }
  }

  if (flowStep === "enquiry" && preferences) {
    return (
      <EnquiryForm
        preferences={preferences}
        selectedProducts={getSelectedProducts()}
        onBack={() => setFlowStep("results")}
        onSuccess={(num) => {
          setEnquiryNumber(num);
          setFlowStep("confirmation");
        }}
      />
    );
  }

  if (flowStep === "confirmation") {
    return (
      <Confirmation
        enquiryNumber={enquiryNumber}
        onStartOver={handleStartOver}
      />
    );
  }

  return null;
}
