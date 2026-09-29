"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MatchedProduct, getPriceDisplay } from "./types";

interface ProductCardProps {
  product: MatchedProduct;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewDetails: () => void;
}

export default function ProductCard({
  product,
  isSelected,
  onToggleSelect,
  onViewDetails,
}: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const images = product.imageUrls;
  const styleTags = product.styleTags;
  const customizations = product.customizationOptions;
  const mainImage = images[0] || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 overflow-hidden bg-white transition-all duration-300 ${
        isSelected
          ? "border-[var(--gold)] shadow-lg ring-2 ring-[var(--gold)]"
          : "border-gray-200 hover:border-[var(--gold-light)] shadow-sm hover:shadow-md"
      }`}
    >
      {/* Image */}
      <div
        className="relative aspect-[3/4] bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] cursor-pointer"
        onClick={onViewDetails}
      >
        {mainImage && !imgError ? (
          <>
            <img
              src={mainImage}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-3 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-3xl">👰</span>
            <p className="text-gray-500 text-xs">{product.name}</p>
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-[var(--gold)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Featured
          </div>
        )}

        {/* Sample badge */}
        {product.isSample && (
          <div className="absolute top-2 right-2 bg-gray-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Sample
          </div>
        )}

        {/* Image count */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
            📷 {images.length}
          </div>
        )}

        {/* Selected overlay */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[var(--gold)]/10 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-full bg-[var(--gold)] flex items-center justify-center shadow-lg"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4
          className="font-semibold text-sm text-[var(--foreground)] leading-tight"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {product.name}
        </h4>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Style tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {styleTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] bg-[var(--gold-light)] text-[var(--gold)] px-1.5 py-0.5 rounded capitalize"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <p className="text-sm font-bold text-[var(--accent)] mt-2">
          {getPriceDisplay(product)}
        </p>

        {/* Customization available */}
        {customizations.length > 0 && (
          <p className="text-[10px] text-gray-400 mt-1">
            ✏️ Customization available
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onViewDetails}
            className="flex-1 text-xs font-medium text-[var(--gold)] border border-[var(--gold-light)] rounded-lg py-2 hover:bg-[var(--gold-light)] transition-colors cursor-pointer"
          >
            View Details
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSelect}
            className={`flex-1 text-xs font-semibold rounded-lg py-2 transition-all cursor-pointer ${
              isSelected
                ? "bg-[var(--gold)] text-white"
                : "bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white"
            }`}
          >
            {isSelected ? "✓ Selected" : "Select"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
