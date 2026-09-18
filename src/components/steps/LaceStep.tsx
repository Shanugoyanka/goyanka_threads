"use client";

import { laces, LaceOption } from "@/data/veilOptions";
import { motion } from "framer-motion";

interface LaceStepProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function LaceStep({ selected, onSelect }: LaceStepProps) {
  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Select Your Border
      </h2>
      <p className="text-center text-gray-500 mb-6 text-xs md:text-base">
        The finishing touch on your veil
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {laces.map((lace: LaceOption, index: number) => (
          <motion.button
            key={lace.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            onClick={() => onSelect(lace.id)}
            className={`option-card rounded-2xl border-2 text-center cursor-pointer overflow-hidden ${
              selected === lace.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            {/* Lace thumbnail */}
            <div className="aspect-[2/1] bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] relative overflow-hidden">
              {lace.thumbnail ? (
                <img
                  src={lace.thumbnail}
                  alt={lace.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const fallback = el.parentElement?.querySelector(".fallback-emoji");
                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                  }}
                />
              ) : null}
              <div className="fallback-emoji absolute inset-0 items-center justify-center" style={{ display: lace.thumbnail ? "none" : "flex" }}>
                <span className="text-2xl drop-shadow-sm">{lace.emoji}</span>
              </div>
              {/* Selected checkmark */}
              {selected === lace.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center shadow-md"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
            {/* Label */}
            <div className="p-2.5">
              <h3 className="font-semibold text-sm text-[var(--foreground)]">
                {lace.name}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                {lace.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
