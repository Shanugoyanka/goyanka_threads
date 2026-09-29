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
    exact: MatchedProduct[];
    close: MatchedProduct[];
    recommendations: MatchedProduct[];
    hasExactMatches: boolean;
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [enquiryNumber, setEnquiryNumber] = useState("");

  const handlePreferencesComplete = useCallback(
    async (answers: PreferenceAnswers) => {
      setPreferences(answers);
      setLoading(true);

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
            wantsCustomization: false,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Match error:", data.error);
          return;
        }

        setResults({
          exact: data.exact,
          close: data.close,
          recommendations: data.recommendations,
          hasExactMatches: data.hasExactMatches,
        });
        setFlowStep("results");
      } catch (err) {
        console.error("Network error:", err);
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
    const all = [...results.exact, ...results.close, ...results.recommendations];
    return all.filter((p) => selectedIds.has(p.id));
  }, [results, selectedIds]);

  const handleStartOver = useCallback(() => {
    setFlowStep("preferences");
    setPreferences(null);
    setResults(null);
    setSelectedIds(new Set());
    setEnquiryNumber("");
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

  if (flowStep === "results" && results && preferences) {
    return (
      <ProductResults
        exact={results.exact}
        close={results.close}
        recommendations={results.recommendations}
        hasExactMatches={results.hasExactMatches}
        preferences={preferences}
        selectedIds={selectedIds}
        onToggleSelect={toggleProduct}
        onEditPreferences={() => setFlowStep("preferences")}
        onProceedToEnquiry={() => setFlowStep("enquiry")}
      />
    );
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
