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
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Choose Your Veil Pattern
      </h2>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
        Select the embroidery style that speaks to your bridal vision
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pattern: PatternOption, index: number) => (
          <motion.button
            key={pattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(pattern.id)}
            className={`option-card p-4 rounded-xl border-2 text-left cursor-pointer ${
              selected === pattern.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{pattern.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base text-[var(--foreground)]">
                  {pattern.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {pattern.description}
                </p>
              </div>
              {selected === pattern.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
