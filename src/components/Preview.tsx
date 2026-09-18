"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  patterns,
  colors,
  laces,
  lengths,
  VeilOrder,
  getPreviewImageUrl,
} from "@/data/veilOptions";

interface PreviewProps {
  order: VeilOrder;
  onConfirm: () => void;
  onBack: () => void;
}

export default function Preview({ order, onConfirm, onBack }: PreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const patternName = patterns.find((p) => p.id === order.pattern)?.name ?? "";
  const colorData = colors.find((c) => c.id === order.color);
  const laceName = laces.find((l) => l.id === order.lace)?.name ?? "";
  const lengthData = lengths.find((l) => l.id === order.length);

  const imageUrl = getPreviewImageUrl(order.pattern, order.color, order.lace);

  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Your Custom Veil Preview
      </h2>
      <p className="text-center text-gray-500 mb-4 text-xs md:text-base">
        Here&apos;s how your bridal veil will look
      </p>

      {/* Order summary */}
      <div className="glass-card rounded-2xl p-4 mb-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Pattern</span>
            <span className="font-medium text-sm">{patternName}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Colour</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: colorData?.hex }} />
              <span className="font-medium text-sm">{colorData?.name}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Border</span>
            <span className="font-medium text-sm">{laceName}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Length</span>
            <span className="font-medium text-sm">{lengthData?.label}</span>
          </div>
          {order.customType !== "none" && order.customText && (
            <div className="col-span-2">
              <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Custom</span>
              <span className="font-medium text-sm">&ldquo;{order.customText}&rdquo;</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview image */}
      <div className="max-w-sm mx-auto">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] shadow-lg">
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`${patternName} veil in ${colorData?.name} with ${laceName}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded && !imageError ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Loading spinner */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
                </div>
              )}

              {/* Image failed to load */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <span className="text-4xl">⚠️</span>
                  <p className="text-gray-500 text-sm">Image failed to load</p>
                  <button
                    onClick={() => { setImageError(false); setImageLoaded(false); }}
                    className="text-[var(--gold)] underline text-sm cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}
            </>
          ) : (
            /* No image URL for this combination */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="text-5xl">👰</span>
              <p className="text-gray-600 font-medium" style={{ fontFamily: "var(--font-playfair), serif" }}>
                {patternName}
              </p>
              <p className="text-gray-500 text-xs">
                {colorData?.name} · {laceName} · {lengthData?.label}
              </p>
              <div
                className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                style={{ backgroundColor: colorData?.hex }}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Preview image coming soon — your selections are saved
              </p>
            </div>
          )

          {/* Custom text overlay */}
          {order.customType !== "none" && order.customText && imageLoaded && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <p className="text-white text-xs font-medium italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
                &ldquo;{order.customText}&rdquo;
              </p>
            </div>
          )}
        </div>

        <p className="text-[11px] text-center text-gray-400 mt-2">
          ✨ Actual product will be handcrafted to match your selections
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-5 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-400 transition-colors cursor-pointer"
        >
          ← Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          Place Order 💝
        </motion.button>
      </div>
    </div>
  );
}
