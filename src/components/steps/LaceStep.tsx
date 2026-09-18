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
            className={`option-card p-4 rounded-xl border-2 text-left cursor-pointer ${
              selected === lace.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-2xl">{lace.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-[var(--foreground)] leading-tight">
                  {lace.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {lace.description}
                </p>
              </div>
            </div>
            {selected === lace.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--gold)] flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
