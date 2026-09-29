"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PreferenceAnswers, getBudgetRange, styleOptions, colourOptions, personalizationOptions } from "@/data/discoverOptions";
import { MatchedProduct, getPriceDisplay } from "./types";

interface EnquiryFormProps {
  preferences: PreferenceAnswers;
  selectedProducts: MatchedProduct[];
  source?: string | null;
  campaign?: string | null;
  onBack: () => void;
  onSuccess: (enquiryNumber: string) => void;
}

export default function EnquiryForm({
  preferences,
  selectedProducts,
  source,
  campaign,
  onBack,
  onSuccess,
}: EnquiryFormProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const budget = getBudgetRange(preferences.budgetRange);
  const styleName =
    styleOptions.find((s) => s.id === preferences.preferredStyle)?.label ??
    preferences.preferredStyle;
  const colourName =
    colourOptions.find((c) => c.id === preferences.outfitColour)?.name ??
    preferences.outfitColour;
  const personalizationName =
    personalizationOptions.find((p) => p.id === preferences.personalization)?.label ??
    preferences.personalization;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }

    const cleanedPhone = whatsapp.replace(/[\s\-()]/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          whatsappNumber: cleanedPhone,
          weddingDate: preferences.weddingDate || null,
          weddingDateNotFixed: preferences.weddingDateNotFixed,
          outfitColour: preferences.outfitColour || null,
          customOutfitColour: preferences.customOutfitColour || null,
          preferredStyle: preferences.preferredStyle || null,
          budgetMin: budget.min,
          budgetMax: budget.max,
          personalization: preferences.personalization || null,
          productIds: selectedProducts.map((p) => p.id),
          source: source || null,
          campaign: campaign || null,
          idempotencyKey: `${cleanedPhone}-${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      onSuccess(data.enquiryNumber);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-[var(--gold-light)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Goyanka Threads"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <div>
            <h1
              className="text-sm md:text-lg font-bold text-[var(--foreground)] leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Almost there ❤️
            </h1>
            <p className="text-[10px] md:text-xs text-[var(--gold)]">
              Share your details to connect with our bridal team
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Intro copy */}
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Share your details and our bridal team will help you with the selected designs, customization and final details.
        </p>

        {/* Preference summary */}
        <div className="glass-card rounded-xl p-4 mb-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Your Preferences
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {preferences.weddingDate && (
              <div>
                <span className="text-[10px] text-gray-400 block">Wedding Date</span>
                <span className="font-medium">{preferences.weddingDate}</span>
              </div>
            )}
            {preferences.weddingDateNotFixed && (
              <div>
                <span className="text-[10px] text-gray-400 block">Wedding Date</span>
                <span className="font-medium">Not fixed yet</span>
              </div>
            )}
            <div>
              <span className="text-[10px] text-gray-400 block">Outfit Colour</span>
              <span className="font-medium">{colourName}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Style</span>
              <span className="font-medium">{styleName}</span>
            </div>
            {preferences.personalization && preferences.personalization !== "none" && (
              <div>
                <span className="text-[10px] text-gray-400 block">Personalization</span>
                <span className="font-medium">{personalizationName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected veils */}
        <div className="glass-card rounded-xl p-4 mb-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Selected Veils ({selectedProducts.length})
          </h3>
          <div className="space-y-3">
            {selectedProducts.map((product) => {
              const images = product.imageUrls;
              return (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        👰
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--accent)] font-medium">
                      {getPriceDisplay(product)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              WhatsApp Number *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                className="flex-1 px-4 py-3 rounded-r-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400 text-sm"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              We&apos;ll reach out on WhatsApp with pricing and details
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-400 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending...
                </>
              ) : (
                "Send My Enquiry 💌"
              )}
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
}
