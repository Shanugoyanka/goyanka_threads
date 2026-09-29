"use client";

import { useState } from "react";
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="min-h-screen mt-12 bg-[var(--background)] rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 z-10 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image gallery */}
        <div className="relative aspect-[3/4] max-h-[60vh] bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4]">
          {allMedia[currentImage] && (
            <img
              src={allMedia[currentImage]}
              alt={`${product.name} - ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* Image navigation dots */}
          {allMedia.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {allMedia.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    i === currentImage
                      ? "bg-white w-5"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Swipe hint */}
          {allMedia.length > 1 && (
            <div className="absolute bottom-8 right-3 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
              {currentImage + 1}/{allMedia.length}
            </div>
          )}

          {/* Thumbnail strip for navigation */}
          {allMedia.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-2 pb-1 overflow-x-auto">
              {allMedia.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    i === currentImage
                      ? "border-white shadow-md"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isFeatured && (
              <span className="bg-[var(--gold)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Featured
              </span>
            )}
            {product.isSample && (
              <span className="bg-gray-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Sample
              </span>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="px-4 py-5 space-y-5 pb-32">
          <div>
            <h2
              className="text-xl md:text-2xl font-bold text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {product.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          </div>

          {/* Price */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-xl font-bold text-[var(--accent)]">
              {getPriceDisplay(product)}
            </p>
            {product.minPrice !== product.maxPrice &&
              product.minPrice != null &&
              product.maxPrice != null && (
                <p className="text-xs text-gray-500 mt-1">
                  Base price {formatPrice(product.basePrice)} • Varies with
                  customization
                </p>
              )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem label="Fabric" value={product.fabric} />
            <DetailItem
              label="Length"
              value={
                product.veilLength === "84"
                  ? '7 ft (84")'
                  : product.veilLength === "120"
                  ? '10 ft (120")'
                  : `${product.veilLength}"`
              }
            />
            <DetailItem
              label="Delivery"
              value={`~${product.deliveryDays} days`}
            />
            <DetailItem
              label="Status"
              value={
                product.status === "available"
                  ? "✅ Available"
                  : product.status === "made-to-order"
                  ? "🔨 Made to order"
                  : "Unavailable"
              }
            />
          </div>

          {/* Embroidery details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Embroidery & Embellishment
            </h3>
            <p className="text-sm text-[var(--foreground)]">
              {product.embroidery}
            </p>
          </div>

          {/* Style tags */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Style
            </h3>
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
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Available Colours
            </h3>
            <div className="flex flex-wrap gap-2">
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

          {/* Customization options */}
          {customizations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Customization Options
              </h3>
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
            </div>
          )}

          {/* Customer photos */}
          {customerMedia.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Customer Photos
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {customerMedia.map((url, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={url}
                      alt={`Customer photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer for sample data */}
          {product.isSample && (
            <p className="text-[10px] text-gray-400 text-center italic">
              ⚠️ This is sample data for development. Actual products, prices, and
              availability may differ.
            </p>
          )}
        </div>

        {/* Sticky action bar */}
        <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-[var(--gold-light)] z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-400 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onToggleSelect();
                if (!isSelected) {
                  onClose();
                }
              }}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all cursor-pointer ${
                isSelected
                  ? "bg-red-50 border-2 border-red-300 text-red-600"
                  : "bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white"
              }`}
            >
              {isSelected ? "Remove Selection ✕" : "Select This Veil 💝"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-lg p-3">
      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
        {label}
      </span>
      <span className="text-sm font-medium text-[var(--foreground)]">
        {value}
      </span>
    </div>
  );
}
