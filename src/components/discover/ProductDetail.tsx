"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MatchedProduct,
  getPriceDisplay,
  formatPrice,
} from "./types";

interface ProductDetailProps {
  product: MatchedProduct;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClose: () => void;
}

function lengthLabel(v: string) {
  if (v === "84") return '7 ft (84")';
  if (v === "120") return '10 ft (120")';
  return `${v}"`;
}

export default function ProductDetail({
  product,
  isSelected,
  onToggleSelect,
  onClose,
}: ProductDetailProps) {
  const images = product.imageUrls;
  const videos = product.videoUrls;
  const customerMedia = product.customerMediaUrls;
  const styleTags = product.styleTags;
  const colours = product.colours;
  const customizations = product.customizationOptions;

  const [currentImage, setCurrentImage] = useState(0);
  const allMedia = [...images, ...videos];

  const goToImage = useCallback(
    (dir: 1 | -1) => {
      setCurrentImage((c) => {
        const next = c + dir;
        if (next < 0) return allMedia.length - 1;
        if (next >= allMedia.length) return 0;
        return next;
      });
    },
    [allMedia.length]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute inset-0 top-10 bg-[var(--background)] rounded-t-3xl overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="sticky top-0 z-20 flex justify-center pt-3 pb-2 bg-[var(--background)] rounded-t-3xl">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image gallery */}
        <div className="relative aspect-[3/4] max-h-[55vh] bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4]">
          {allMedia[currentImage] && (
            <img
              src={allMedia[currentImage]}
              alt={`${product.name} — ${currentImage + 1} of ${allMedia.length}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* Left / right tap zones */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={() => goToImage(-1)}
                className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
                aria-label="Previous image"
              />
              <button
                onClick={() => goToImage(1)}
                className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
                aria-label="Next image"
              />
            </>
          )}

          {/* Progress bar */}
          {allMedia.length > 1 && (
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {allMedia.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-colors ${
                    i === currentImage ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Favourite button */}
          <button
            onClick={onToggleSelect}
            className="absolute top-3 right-3 z-10 cursor-pointer"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={isSelected ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-[var(--gold)] shadow-lg"
                  : "bg-black/30 hover:bg-black/50"
              }`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill={isSelected ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.div>
          </button>

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {product.isFeatured && (
              <span className="bg-[var(--gold)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Featured
              </span>
            )}
            {product.isSample && (
              <span className="bg-gray-500/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Sample
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail strip */}
        {allMedia.length > 1 && (
          <div className="flex gap-1.5 px-4 py-3 overflow-x-auto no-scrollbar bg-[var(--background)]">
            {allMedia.map((url, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  i === currentImage
                    ? "border-[var(--gold)] shadow-md"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Product info */}
        <div className="px-4 py-5 space-y-5 pb-28">
          {/* Title + price */}
          <div>
            <h2
              className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-snug"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {product.name}
            </h2>
            <p className="text-xl font-bold text-[var(--accent)] mt-1">
              {getPriceDisplay(product)}
            </p>
            {product.minPrice !== product.maxPrice &&
              product.minPrice != null &&
              product.maxPrice != null && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Base price {formatPrice(product.basePrice)} · Varies with customization
                </p>
              )}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-2.5">
            <QuickSpec icon="📐" label="Length" value={lengthLabel(product.veilLength)} />
            <QuickSpec icon="🧵" label="Fabric" value={product.fabric} />
            <QuickSpec icon="📦" label="Delivery" value={`~${product.deliveryDays} days`} />
            <QuickSpec
              icon={product.status === "available" ? "✅" : "🔨"}
              label="Status"
              value={product.status === "available" ? "Available" : product.status === "made-to-order" ? "Made to order" : "Unavailable"}
            />
          </div>

          {/* Embroidery */}
          <div>
            <SectionTitle>Embroidery & Embellishment</SectionTitle>
            <p className="text-sm text-[var(--foreground)] leading-relaxed">
              {product.embroidery}
            </p>
          </div>

          {/* Style tags */}
          <div>
            <SectionTitle>Style</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {styleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[var(--gold-light)] text-[var(--gold)] px-2.5 py-1 rounded-full capitalize font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Available colours */}
          <div>
            <SectionTitle>Available Colours</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {colours.map((colour) => (
                <span
                  key={colour}
                  className="text-xs bg-white border border-gray-200 text-[var(--foreground)] px-2.5 py-1 rounded-full capitalize font-medium"
                >
                  {colour}
                </span>
              ))}
            </div>
          </div>

          {/* Customization */}
          {customizations.length > 0 && (
            <div>
              <SectionTitle>Customization Options</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {customizations.map((opt) => (
                  <span
                    key={opt}
                    className="text-xs bg-[var(--accent-light)] text-[var(--accent)] px-2.5 py-1 rounded-full capitalize font-medium"
                  >
                    {opt === "custom" ? "Custom Text" : opt}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Add initials, names, dates or custom text — embroidered on your veil
              </p>
            </div>
          )}

          {/* Customer photos / videos */}
          {customerMedia.length > 0 && (
            <div>
              <SectionTitle>Customer Photos & Videos</SectionTitle>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {customerMedia.map((url, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={url}
                      alt={`Customer photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Shared by customers with permission
              </p>
            </div>
          )}

          {/* Sample disclaimer */}
          {product.isSample && (
            <p className="text-[10px] text-gray-400 text-center italic pt-2">
              ⚠️ This is sample data for development. Actual products, prices,
              and availability may differ.
            </p>
          )}
        </div>

        {/* Sticky action bar */}
        <div
          className="fixed bottom-0 left-0 right-0 z-10 border-t border-[var(--gold-light)]"
          style={{ background: "rgba(255,249,245,0.95)", backdropFilter: "blur(16px)" }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3.5 flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-full font-medium text-sm hover:border-gray-400 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onToggleSelect();
                if (!isSelected) onClose();
              }}
              className={`flex-1 py-2.5 rounded-full font-semibold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isSelected
                  ? "bg-white border-2 border-[var(--gold)] text-[var(--gold)]"
                  : "bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white"
              }`}
            >
              {isSelected ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Selected — Remove
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Select This Veil
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
      {children}
    </h3>
  );
}

function QuickSpec({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">{label}</span>
        <span className="text-sm font-medium text-[var(--foreground)] truncate block">{value}</span>
      </div>
    </div>
  );
}
