"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  patterns,
  colors,
  laces,
  lengths,
  VeilOrder,
  getPatternImageUrl,
  getBorderImageUrl,
} from "@/data/veilOptions";

interface PreviewProps {
  order: VeilOrder;
  onConfirm: () => void;
  onBack: () => void;
}

export default function Preview({ order, onConfirm, onBack }: PreviewProps) {
  const [patternLoaded, setPatternLoaded] = useState(false);
  const [patternError, setPatternError] = useState(false);
  const [borderLoaded, setBorderLoaded] = useState(false);
  const [borderError, setBorderError] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const patternName = patterns.find((p) => p.id === order.pattern)?.name ?? "";
  const colorData = colors.find((c) => c.id === order.color);
  const laceName = laces.find((l) => l.id === order.lace)?.name ?? "";
  const lengthData = lengths.find((l) => l.id === order.length);

  const patternUrl = getPatternImageUrl(order.pattern, order.color);
  const borderUrl = getBorderImageUrl(order.lace, order.color);

  const openLightbox = (url: string, alt: string) => {
    setLightboxUrl(url);
    setLightboxAlt(alt);
  };

  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Your Custom Veil Preview
      </h2>
      <p className="text-center text-gray-500 mb-4 text-xs md:text-base">
        Tap an image to view full size
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

      {/* Preview images — pattern + border side by side */}
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {/* Pattern image */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 text-center mb-1.5 font-medium">Embroidery</p>
          <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => patternUrl && patternLoaded && !patternError && openLightbox(patternUrl, `${patternName} in ${colorData?.name}`)}
          >
            {patternUrl ? (
              <>
                <img
                  src={patternUrl}
                  alt={`${patternName} in ${colorData?.name}`}
                  onLoad={() => setPatternLoaded(true)}
                  onError={() => setPatternError(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    patternLoaded && !patternError ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!patternLoaded && !patternError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
                  </div>
                )}
                {patternError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <span className="text-3xl">⚠️</span>
                    <p className="text-gray-500 text-xs">Failed to load</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPatternError(false); setPatternLoaded(false); }}
                      className="text-[var(--gold)] underline text-xs cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {/* Expand icon */}
                {patternLoaded && !patternError && (
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <span className="text-4xl">👰</span>
                <p className="text-gray-500 text-xs">{patternName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Border image */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 text-center mb-1.5 font-medium">Border</p>
          <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => borderUrl && borderLoaded && !borderError && openLightbox(borderUrl, `${laceName} in ${colorData?.name}`)}
          >
            {borderUrl ? (
              <>
                <img
                  src={borderUrl}
                  alt={`${laceName} in ${colorData?.name}`}
                  onLoad={() => setBorderLoaded(true)}
                  onError={() => setBorderError(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    borderLoaded && !borderError ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!borderLoaded && !borderError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
                  </div>
                )}
                {borderError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <span className="text-3xl">⚠️</span>
                    <p className="text-gray-500 text-xs">Failed to load</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setBorderError(false); setBorderLoaded(false); }}
                      className="text-[var(--gold)] underline text-xs cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {/* Expand icon */}
                {borderLoaded && !borderError && (
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <span className="text-4xl">🧵</span>
                <p className="text-gray-500 text-xs">{laceName}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom text */}
      {order.customType !== "none" && order.customText && (
        <div className="text-center mt-3">
          <span className="inline-block bg-black/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <p className="text-sm font-medium italic text-[var(--foreground)]" style={{ fontFamily: "var(--font-playfair), serif" }}>
              &ldquo;{order.customText}&rdquo;
            </p>
          </span>
        </div>
      )}

      <p className="text-[11px] text-center text-gray-400 mt-3">
        ✨ Actual product will be handcrafted to match your selections
      </p>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-5">
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

      {/* ── Fullscreen Lightbox ── */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxUrl(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Full image */}
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              src={lightboxUrl}
              alt={lightboxAlt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Caption */}
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxAlt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
