"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  patterns,
  colors,
  laces,
  lengths,
  VeilOrder,
} from "@/data/veilOptions";

interface PreviewProps {
  order: VeilOrder;
  previewImages: string[];
  isGenerating: boolean;
  onGenerate: () => void;
  onConfirm: () => void;
  onBack: () => void;
}

const viewLabels = ["Front View", "Right Side", "Back View", "Left Side"];
const viewIcons = ["👰", "👤", "🔙", "👤"];

export default function Preview({
  order,
  previewImages,
  isGenerating,
  onGenerate,
  onConfirm,
  onBack,
}: PreviewProps) {
  const [activeView, setActiveView] = useState(0);

  const patternName = patterns.find((p) => p.id === order.pattern)?.name ?? "";
  const colorData = colors.find((c) => c.id === order.color);
  const laceName = laces.find((l) => l.id === order.lace)?.name ?? "";
  const lengthData = lengths.find((l) => l.id === order.length);

  return (
    <div>
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Your Custom Veil Preview
      </h2>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
        Here&apos;s how your bridal veil will look — view from all sides
      </p>

      {/* Order summary */}
      <div className="glass-card rounded-2xl p-6 mb-8 max-w-3xl mx-auto">
        <h3
          className="text-lg font-semibold mb-4 text-[var(--gold)]"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Your Selections
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider">
              Pattern
            </span>
            <span className="font-medium">{patternName}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider">
              Colour
            </span>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: colorData?.hex }}
              />
              <span className="font-medium">{colorData?.name}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider">
              Lace / Border
            </span>
            <span className="font-medium">{laceName}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider">
              Length
            </span>
            <span className="font-medium">{lengthData?.label}</span>
          </div>
          {order.customType !== "none" && order.customText && (
            <div className="col-span-2">
              <span className="text-gray-500 block text-xs uppercase tracking-wider">
                Customization
              </span>
              <span className="font-medium">
                &ldquo;{order.customText}&rdquo;
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Generate preview button or show images */}
      {previewImages.length === 0 ? (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating Your Preview...
              </span>
            ) : (
              "✨ Generate Preview on Model"
            )}
          </motion.button>
          <p className="text-xs text-gray-400 mt-3">
            AI will create a visualisation of your veil on a bridal model from 4
            angles
          </p>
        </div>
      ) : (
        <>
          {/* 4-sided preview */}
          <div className="max-w-3xl mx-auto">
            {/* Main image */}
            <div className="relative aspect-[3/4] max-h-[500px] rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeView}
                  src={previewImages[activeView]}
                  alt={viewLabels[activeView]}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full text-sm font-medium">
                {viewIcons[activeView]} {viewLabels[activeView]}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 gap-3">
              {previewImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveView(i)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeView === i
                      ? "border-[var(--gold)] shadow-lg scale-105"
                      : "border-gray-200 hover:border-[var(--gold-light)]"
                  }`}
                >
                  <img
                    src={img}
                    alt={viewLabels[i]}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:border-gray-400 transition-colors cursor-pointer"
            >
              ← Edit Selections
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="px-8 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              Love It! Place Order 💝
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
