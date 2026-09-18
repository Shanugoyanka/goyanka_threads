"use client";

import { lengths, LengthOption } from "@/data/veilOptions";
import { motion } from "framer-motion";

interface LengthStepProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function LengthStep({ selected, onSelect }: LengthStepProps) {
  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Choose the Length
      </h2>
      <p className="text-center text-gray-500 mb-8 text-xs md:text-base">
        How long should your veil be?
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {lengths.map((length: LengthOption, index: number) => (
          <motion.button
            key={length.id}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(length.id)}
            className={`option-card p-5 rounded-2xl border-2 text-center cursor-pointer ${
              selected === length.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--gold-light)] to-[var(--accent-light)] flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--foreground)]">
                  {length.inches}&quot;
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--foreground)]">
                  {length.label}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  {length.description}
                </p>
              </div>
              {selected === length.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center"
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
