"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MatchedProduct, getPriceDisplay } from "./types";

interface ProductCardProps {
  product: MatchedProduct;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewDetails: () => void;
  index?: number;
}

function lengthLabel(v: string) {
  if (v === "84") return '7 ft';
  if (v === "120") return '10 ft';
  return `${v}"`;
}

export default function ProductCard({
  product,
  isSelected,
  onToggleSelect,
  onViewDetails,
  index = 0,
}: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const images = product.imageUrls;
  const styleTags = product.styleTags;
  const customizations = product.customizationOptions;
  const customerMedia = product.customerMediaUrls;
  const mainImage = images[0] || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
        isSelected
          ? "ring-2 ring-[var(--gold)] shadow-lg"
          : "shadow-sm hover:shadow-md"
      }`}
    >
      {/* Image area */}
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

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.matchLabel && (
            <span className="bg-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {product.matchLabel}
            </span>
          )}
          {product.isFeatured && !product.matchLabel && (
            <span className="bg-[var(--gold)] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
          {product.isSample && (
            <span className="bg-gray-500/80 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sample
            </span>
          )}
        </div>

        {/* Bottom-right: image count + customer photos */}
        <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
          {images.length > 1 && (
            <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {images.length}
            </span>
          )}
          {customerMedia.length > 0 && (
            <span className="bg-[var(--accent)]/80 text-white text-[10px] px-2 py-0.5 rounded-full">
              Customer photos
            </span>
          )}
        </div>

        {/* Favourite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className="absolute top-2 right-2 z-10 cursor-pointer"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={isSelected ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isSelected
                ? "bg-[var(--gold)] shadow-md"
                : "bg-black/30 hover:bg-black/50"
            }`}
          >
            <svg
              className="w-4 h-4 text-white"
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
      </div>

      {/* Info */}
      <div className="p-3">
        <h4
          className="font-semibold text-sm text-[var(--foreground)] leading-tight"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {product.name}
        </h4>

        {/* Price — prominent */}
        <p className="text-sm font-bold text-[var(--accent)] mt-1">
          {getPriceDisplay(product)}
        </p>

        {/* Key details row */}
        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-500">
          <span>{lengthLabel(product.veilLength)}</span>
          <span className="text-gray-300">·</span>
          <span>{product.fabric}</span>
          {customizations.length > 0 && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-[var(--gold)]">Customizable</span>
            </>
          )}
        </div>

        {/* Style tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {styleTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] bg-[var(--gold-light)]/60 text-[var(--gold)] px-1.5 py-0.5 rounded capitalize font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View details link */}
        <button
          onClick={onViewDetails}
          className="mt-2.5 w-full text-xs font-medium text-[var(--gold)] border border-[var(--gold-light)] rounded-lg py-2 hover:bg-[var(--gold-light)]/40 transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          View Details
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
