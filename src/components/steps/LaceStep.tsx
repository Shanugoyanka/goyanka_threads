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
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Select Your Lace / Border
      </h2>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
        The finishing touch that frames your veil beautifully
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {laces.map((lace: LaceOption, index: number) => (
          <motion.button
            key={lace.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onSelect(lace.id)}
            className={`option-card p-4 rounded-xl border-2 text-left cursor-pointer ${
              selected === lace.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{lace.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base text-[var(--foreground)]">
                  {lace.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {lace.description}
                </p>
              </div>
              {selected === lace.id && (
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
