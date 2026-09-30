"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PreferenceAnswers,
  styleOptions,
  colourOptions,
  budgetOptions,
  personalizationOptions,
} from "@/data/discoverOptions";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { MatchedProduct } from "./types";

interface ProductResultsProps {
  bestMatches: MatchedProduct[];
  alsoLike: MatchedProduct[];
  hasBestMatches: boolean;
  preferences: PreferenceAnswers;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onEditPreferences: () => void;
  onProceedToEnquiry: () => void;
}

function getColourName(id: string) {
  return colourOptions.find((c) => c.id === id)?.name ?? id;
}
function getStyleLabel(id: string) {
  return styleOptions.find((s) => s.id === id)?.label ?? id;
}
function getBudgetLabel(id: string) {
  return budgetOptions.find((b) => b.id === id)?.label ?? id;
}
function getPersonalizationLabel(id: string) {
  return personalizationOptions.find((p) => p.id === id)?.label ?? id;
}

export default function ProductResults({
  bestMatches,
  alsoLike,
  hasBestMatches,
  preferences,
  selectedIds,
  onToggleSelect,
  onEditPreferences,
  onProceedToEnquiry,
}: ProductResultsProps) {
  const [detailProduct, setDetailProduct] = useState<MatchedProduct | null>(
    null
  );
  const [prefExpanded, setPrefExpanded] = useState(false);

  const totalSelected = selectedIds.size;
  const totalResults = bestMatches.length + alsoLike.length;

  const colourName = getColourName(preferences.outfitColour);
  const styleName = getStyleLabel(preferences.preferredStyle);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-[var(--gold-light)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Goyanka Threads"
              className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-contain"
            />
            <div>
              <h1
                className="text-sm md:text-base font-bold text-[var(--foreground)] leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Goyanka Threads
              </h1>
              <p className="text-[10px] md:text-xs text-[var(--gold)]">
                Your Bridal Veil Selection
              </p>
            </div>
          </div>

          {totalSelected > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 bg-[var(--gold)] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {totalSelected}
            </motion.div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pb-32">
        {/* Personalized intro */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pt-6 pb-2"
        >
          <h2
            className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-snug"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {hasBestMatches
              ? "Your veil matches ✨"
              : "Styles that may complement your bridal look"}
          </h2>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Based on your bridal look, we found these styles for you.
          </p>
        </motion.div>

        {/* Collapsible preference summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => setPrefExpanded((v) => !v)}
            className="w-full glass-card rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex-shrink-0">
                Your preferences
              </span>
              {!prefExpanded && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {preferences.outfitColour && preferences.outfitColour !== "other" && (
                    <span className="flex-shrink-0 text-[10px] bg-[var(--accent-light)] text-[var(--accent)] px-2 py-0.5 rounded-full font-medium capitalize">
                      {colourName}
                    </span>
                  )}
                  {preferences.preferredStyle && (
                    <span className="flex-shrink-0 text-[10px] bg-[var(--gold-light)] text-[var(--gold)] px-2 py-0.5 rounded-full font-medium">
                      {styleName}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-[var(--gold)] font-medium group-hover:underline">
                {prefExpanded ? "Close" : "View all"}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  prefExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <AnimatePresence>
            {prefExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="glass-card rounded-b-xl border-t-0 -mt-1 px-4 pb-4 pt-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                    {preferences.weddingDate && (
                      <PrefItem label="Wedding date" value={preferences.weddingDate} />
                    )}
                    {preferences.weddingDateNotFixed && (
                      <PrefItem label="Wedding date" value="Not fixed yet" />
                    )}
                    {preferences.outfitColour && (
                      <PrefItem label="Outfit colour" value={colourName} />
                    )}
                    {preferences.preferredStyle && (
                      <PrefItem label="Style" value={styleName} />
                    )}
                    {preferences.budgetRange && (
                      <PrefItem label="Budget" value={getBudgetLabel(preferences.budgetRange)} />
                    )}
                    {preferences.personalization && preferences.personalization !== "none" && (
                      <PrefItem label="Personalization" value={getPersonalizationLabel(preferences.personalization)} />
                    )}
                  </div>
                  <button
                    onClick={onEditPreferences}
                    className="mt-3 text-xs font-semibold text-[var(--gold)] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit preferences
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* No exact matches message */}
        {!hasBestMatches && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-xl p-4 mb-6 text-center border border-[var(--gold-light)]"
          >
            <p
              className="text-sm md:text-base text-[var(--foreground)] leading-relaxed"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              We couldn&apos;t find an exact match, but these styles may work
              beautifully with your bridal look.
            </p>
          </motion.div>
        )}

        {/* Best matches */}
        {bestMatches.length > 0 && (
          <ProductSection
            title={hasBestMatches ? "Best Matches" : "Closest Matches"}
            subtitle={
              hasBestMatches
                ? "These veils match your colour, style and budget"
                : "Based on your preferences"
            }
            delay={0.3}
          >
            {bestMatches.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedIds.has(product.id)}
                onToggleSelect={() => onToggleSelect(product.id)}
                onViewDetails={() => setDetailProduct(product)}
                index={i}
              />
            ))}
          </ProductSection>
        )}

        {/* More styles */}
        {alsoLike.length > 0 && (
          <ProductSection
            title="More Styles You May Like"
            subtitle="Explore other designs from our collection"
            delay={0.4}
          >
            {alsoLike.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedIds.has(product.id)}
                onToggleSelect={() => onToggleSelect(product.id)}
                onViewDetails={() => setDetailProduct(product)}
                index={i}
              />
            ))}
          </ProductSection>
        )}
      </main>

      {/* Floating bottom bar — always visible */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--gold-light)] shadow-2xl"
        style={{ background: "rgba(255,249,245,0.92)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {totalSelected > 0 ? (
              <>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {totalSelected} veil{totalSelected > 1 ? "s" : ""} selected
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  Tap below to enquire about your favourites
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Need help choosing?
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  Our designer will help you pick the perfect veil
                </p>
              </>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onProceedToEnquiry}
            className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-sm flex items-center gap-1.5"
          >
            Talk to our designer
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

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

function PrefItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
        {label}
      </span>
      <span className="text-sm font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function ProductSection({
  title,
  subtitle,
  delay,
  children,
}: {
  title: string;
  subtitle: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      <div className="mb-3">
        <h3
          className="text-base md:text-lg font-bold text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {children}
      </div>
    </motion.div>
  );
}
