"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PreferenceAnswers } from "@/data/discoverOptions";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { MatchedProduct } from "./types";

interface ProductResultsProps {
  exact: MatchedProduct[];
  close: MatchedProduct[];
  recommendations: MatchedProduct[];
  hasExactMatches: boolean;
  preferences: PreferenceAnswers;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onEditPreferences: () => void;
  onProceedToEnquiry: () => void;
}

export default function ProductResults({
  exact,
  close,
  recommendations,
  hasExactMatches,
  preferences,
  selectedIds,
  onToggleSelect,
  onEditPreferences,
  onProceedToEnquiry,
}: ProductResultsProps) {
  const [detailProduct, setDetailProduct] = useState<MatchedProduct | null>(
    null
  );

  const totalSelected = selectedIds.size;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-[var(--gold-light)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Goyanka Threads"
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-contain"
            />
            <div>
              <h1
                className="text-sm md:text-base font-bold text-[var(--foreground)] leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Your Veil Matches
              </h1>
              <p className="text-[10px] md:text-xs text-gray-500">
                {exact.length + close.length + recommendations.length} veils
                found
              </p>
            </div>
          </div>

          <button
            onClick={onEditPreferences}
            className="text-xs md:text-sm text-[var(--gold)] font-medium hover:underline cursor-pointer"
          >
            ← Edit Preferences
          </button>
        </div>
      </header>

      {/* Preference summary */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4 pb-2">
        <div className="glass-card rounded-xl p-3 text-xs md:text-sm flex flex-wrap gap-2">
          {preferences.outfitColour && preferences.outfitColour !== "other" && (
            <span className="inline-flex items-center gap-1 bg-[var(--accent-light)] text-[var(--accent)] px-2.5 py-1 rounded-full font-medium">
              {preferences.outfitColour}
            </span>
          )}
          {preferences.preferredStyle && (
            <span className="inline-flex items-center gap-1 bg-[var(--gold-light)] text-[var(--gold)] px-2.5 py-1 rounded-full font-medium capitalize">
              {preferences.preferredStyle.replace("-", " ")}
            </span>
          )}
          {preferences.budgetRange && (
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {preferences.budgetRange === "flexible"
                ? "Flexible budget"
                : preferences.budgetRange.replace("-", " – ₹").replace("under", "Under ₹").replace("above", "Above ₹")}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 pb-28">
        {/* No exact matches message */}
        {!hasExactMatches && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-sm md:text-base text-[var(--foreground)]">
              We couldn&apos;t find an exact match, but these styles may work
              beautifully with your bridal look. ✨
            </p>
          </motion.div>
        )}

        {/* Exact matches */}
        {exact.length > 0 && (
          <ProductSection title="Perfect Matches" products={exact}>
            {exact.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedIds.has(product.id)}
                onToggleSelect={() => onToggleSelect(product.id)}
                onViewDetails={() => setDetailProduct(product)}
              />
            ))}
          </ProductSection>
        )}

        {/* Close matches */}
        {close.length > 0 && (
          <ProductSection
            title={hasExactMatches ? "Also Worth a Look" : "Close Matches"}
            products={close}
          >
            {close.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedIds.has(product.id)}
                onToggleSelect={() => onToggleSelect(product.id)}
                onViewDetails={() => setDetailProduct(product)}
              />
            ))}
          </ProductSection>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <ProductSection title="More Styles to Explore" products={recommendations}>
            {recommendations.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedIds.has(product.id)}
                onToggleSelect={() => onToggleSelect(product.id)}
                onViewDetails={() => setDetailProduct(product)}
              />
            ))}
          </ProductSection>
        )}
      </main>

      {/* Floating selection bar */}
      <AnimatePresence>
        {totalSelected > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-[var(--gold-light)] shadow-2xl"
          >
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {totalSelected} veil{totalSelected > 1 ? "s" : ""} selected
                </p>
                <p className="text-[10px] text-gray-500">
                  Tap to enquire about your favourites
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onProceedToEnquiry}
                className="px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-sm"
              >
                Enquire Now 💌
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product detail modal */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetail
            product={detailProduct}
            isSelected={selectedIds.has(detailProduct.id)}
            onToggleSelect={() => onToggleSelect(detailProduct.id)}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductSection({
  title,
  children,
}: {
  title: string;
  products: MatchedProduct[];
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3
        className="text-base md:text-lg font-bold text-[var(--foreground)] mb-3"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {children}
      </div>
    </div>
  );
}
