"use client";

import { useState, useMemo } from "react";
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
  onConfirm: () => void;
  onBack: () => void;
}

const viewLabels = ["Front View", "Right Side", "Back View", "Left Side"];
const viewIcons = ["👰", "👤", "🔙", "👤"];

function buildPrompt(order: VeilOrder, view: string): string {
  const patternName =
    patterns.find((p) => p.id === order.pattern)?.name ?? "embroidered";
  const colorName =
    colors.find((c) => c.id === order.color)?.name ?? "red";
  const laceName =
    laces.find((l) => l.id === order.lace)?.name ?? "gold border";
  const lengthLabel =
    lengths.find((l) => l.id === order.length)?.label ?? "84 inches";

  const base = `Professional fashion photography, Indian bride wearing a stunning bridal lehenga outfit, with a beautiful ${colorName} bridal dupatta veil draped over her head. The veil features intricate ${patternName} embroidery pattern with ${laceName} trim along the edges. The veil is ${lengthLabel} long, flowing elegantly.`;

  const viewDesc =
    view === "front"
      ? "Front view of the bride facing the camera, showing the full drape of the veil and face."
      : view === "right"
      ? "Right side profile view of the bride, showing how the veil falls over the shoulder."
      : view === "back"
      ? "Back view of the bride, showing the full length of the veil cascading down from the head."
      : "Left side profile view of the bride, showing the veil draping gracefully.";

  const custom =
    order.customType !== "none" && order.customText
      ? ` The veil has "${order.customText}" embroidered delicately.`
      : "";

  return `${base} ${viewDesc}${custom} Studio lighting, elegant bridal pose, warm golden tones, high-end fashion editorial, clean cream background, photorealistic.`;
}

function getImageUrl(prompt: string, seed: number): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;
}

export default function Preview({ order, onConfirm, onBack }: PreviewProps) {
  const [activeView, setActiveView] = useState(0);
  const [loadedViews, setLoadedViews] = useState<Set<number>>(new Set());
  const [errorViews, setErrorViews] = useState<Set<number>>(new Set());

  const patternName = patterns.find((p) => p.id === order.pattern)?.name ?? "";
  const colorData = colors.find((c) => c.id === order.color);
  const laceName = laces.find((l) => l.id === order.lace)?.name ?? "";
  const lengthData = lengths.find((l) => l.id === order.length);

  const baseSeed = useMemo(() => {
    let hash = 0;
    const str = `${order.pattern}-${order.color}-${order.lace}-${order.length}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }, [order.pattern, order.color, order.lace, order.length]);

  const imageUrls = useMemo(() => {
    const views = ["front", "right", "back", "left"];
    return views.map((view, i) => {
      const prompt = buildPrompt(order, view);
      return getImageUrl(prompt, baseSeed + i);
    });
  }, [order, baseSeed]);

  const handleImageLoad = (index: number) => {
    setLoadedViews((prev) => new Set(prev).add(index));
  };

  const handleImageError = (index: number) => {
    setErrorViews((prev) => new Set(prev).add(index));
  };

  return (
    <div>
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Your Custom Veil Preview
      </h2>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
        AI-generated preview of your bridal veil — view from all sides
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

      {/* 4-sided AI preview */}
      <div className="max-w-3xl mx-auto">
        {/* Main image */}
        <div className="relative aspect-[3/4] max-h-[550px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              {/* Loading state */}
              {!loadedViews.has(activeView) && !errorViews.has(activeView) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">
                    Generating {viewLabels[activeView]}...
                  </p>
                  <p className="text-xs text-gray-400">
                    This may take 10-20 seconds
                  </p>
                </div>
              )}

              {/* Error state */}
              {errorViews.has(activeView) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                  <span className="text-4xl">⚠️</span>
                  <p className="text-sm text-gray-500">
                    Preview generation is busy. Try again in a moment.
                  </p>
                  <button
                    onClick={() => {
                      setErrorViews((prev) => {
                        const next = new Set(prev);
                        next.delete(activeView);
                        return next;
                      });
                      setLoadedViews((prev) => {
                        const next = new Set(prev);
                        next.delete(activeView);
                        return next;
                      });
                    }}
                    className="text-sm text-[var(--gold)] underline cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* The AI-generated image */}
              {!errorViews.has(activeView) && (
                <img
                  src={imageUrls[activeView]}
                  alt={viewLabels[activeView]}
                  onLoad={() => handleImageLoad(activeView)}
                  onError={() => handleImageError(activeView)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    loadedViews.has(activeView) ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full text-sm font-medium z-20">
            {viewIcons[activeView]} {viewLabels[activeView]}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="grid grid-cols-4 gap-3">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveView(i)}
              className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] ${
                activeView === i
                  ? "border-[var(--gold)] shadow-lg scale-105"
                  : "border-gray-200 hover:border-[var(--gold-light)]"
              }`}
            >
              {!loadedViews.has(i) && !errorViews.has(i) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
                </div>
              )}
              {!errorViews.has(i) && (
                <img
                  src={url}
                  alt={viewLabels[i]}
                  onLoad={() => handleImageLoad(i)}
                  onError={() => handleImageError(i)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    loadedViews.has(i) ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
              {errorViews.has(i) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg">⚠️</span>
                </div>
              )}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 bg-white/70 px-1.5 py-0.5 rounded-full">
                {viewLabels[i].split(" ")[0]}
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-center text-gray-400 mt-3">
          ✨ AI-generated previews — actual product may vary in detail
        </p>
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
    </div>
  );
}
