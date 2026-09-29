"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import PreferenceWizard from "@/components/discover/PreferenceWizard";
import ProductResults from "@/components/discover/ProductResults";
import EnquiryForm from "@/components/discover/EnquiryForm";
import Confirmation from "@/components/discover/Confirmation";
import { PreferenceAnswers, getBudgetRange } from "@/data/discoverOptions";
import { MatchedProduct } from "@/components/discover/types";

type FlowStep = "landing" | "preferences" | "results" | "enquiry" | "confirmation";

function VeilFlow() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const campaign = searchParams.get("campaign");

  const [flowStep, setFlowStep] = useState<FlowStep>("landing");
  const [preferences, setPreferences] = useState<PreferenceAnswers | null>(null);
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
            personalization: answers.personalization,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          const detail = data.detail ? ` (${data.detail})` : "";
          setError((data.error || "Something went wrong.") + detail);
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
    setFlowStep("landing");
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

  // Landing screen
  if (flowStep === "landing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[var(--accent-light)] opacity-20 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[var(--gold-light)] opacity-30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent-light)] opacity-10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-lg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <img
              src="/logo.png"
              alt="Goyanka Threads"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-2xl shadow-lg object-contain"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3 leading-snug"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Let&apos;s find a veil made for your bridal look ✨
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 mb-8 text-sm md:text-base leading-relaxed max-w-sm mx-auto"
          >
            Tell us a little about your wedding and we&apos;ll show you styles that match.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFlowStep("preferences")}
            className="px-10 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
          >
            Find My Veil ✨
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 flex items-center justify-center gap-4 md:gap-6 text-xs text-gray-400 flex-wrap"
          >
            <span>Customized bridal veils</span>
            <span className="hidden md:inline">•</span>
            <span>Made in India</span>
            <span className="hidden md:inline">•</span>
            <span>Real customer designs</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Preference wizard
  if (flowStep === "preferences") {
    return (
      <PreferenceWizard
        onComplete={handlePreferencesComplete}
        initialAnswers={preferences ?? undefined}
      />
    );
  }

  // Results
  if (flowStep === "results" && preferences) {
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

  // Enquiry form
  if (flowStep === "enquiry" && preferences) {
    return (
      <EnquiryForm
        preferences={preferences}
        selectedProducts={getSelectedProducts()}
        source={source}
        campaign={campaign}
        onBack={() => setFlowStep("results")}
        onSuccess={(num) => {
          setEnquiryNumber(num);
          setFlowStep("confirmation");
        }}
      />
    );
  }

  // Confirmation
  if (flowStep === "confirmation") {
    return (
      <Confirmation
        enquiryNumber={enquiryNumber}
        selectedProducts={getSelectedProducts()}
        onStartOver={handleStartOver}
      />
    );
  }

  return null;
}

export default function VeilPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
      </div>
    }>
      <VeilFlow />
    </Suspense>
  );
}
