"use client";

import { patterns, PatternOption } from "@/data/veilOptions";
import { motion } from "framer-motion";

interface PatternStepProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PatternStep({ selected, onSelect }: PatternStepProps) {
  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Choose Your Pattern
      </h2>
      <p className="text-center text-gray-500 mb-6 text-xs md:text-base">
        Select the embroidery style for your veil
      </p>

      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-lg mx-auto">
        {patterns.map((pattern: PatternOption, index: number) => (
          <motion.button
            key={pattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onSelect(pattern.id)}
            className={`option-card rounded-2xl border-2 text-center cursor-pointer overflow-hidden ${
              selected === pattern.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            {/* Pattern thumbnail */}
            <div className="aspect-[4/3] bg-gradient-to-b from-[#FFF5EE] to-[#F0E6D4] relative overflow-hidden">
              {pattern.thumbnail ? (
                <img
                  src={pattern.thumbnail}
                  alt={pattern.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}
              {/* Fallback emoji */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl md:text-5xl drop-shadow-sm">{pattern.emoji}</span>
              </div>
              {/* Selected checkmark */}
              {selected === pattern.id && (
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
            <div className="p-3">
              <h3 className="font-semibold text-sm text-[var(--foreground)]">
                {pattern.name}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                {pattern.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
