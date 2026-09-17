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
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Choose the Length
      </h2>
      <p className="text-center text-gray-500 mb-10 text-sm md:text-base">
        How long would you like your bridal veil?
      </p>

      <div className="max-w-2xl mx-auto space-y-4">
        {lengths.map((length: LengthOption, index: number) => (
          <motion.button
            key={length.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onSelect(length.id)}
            className={`option-card w-full p-5 rounded-xl border-2 text-left cursor-pointer flex items-center gap-4 ${
              selected === length.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            {/* Visual length indicator */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--gold-light)] to-[var(--accent-light)] flex items-center justify-center">
              <span className="text-lg font-bold text-[var(--foreground)]">
                {length.inches}&quot;
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-[var(--foreground)]">
                {length.label}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {length.description}
              </p>
            </div>

            {/* Visual bar showing relative length */}
            <div className="hidden md:block flex-shrink-0 w-32">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(length.inches / 120) * 100}%` }}
                  transition={{ delay: index * 0.08 + 0.2, duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      selected === length.id
                        ? "var(--gold)"
                        : "var(--accent-light)",
                  }}
                />
              </div>
            </div>

            {selected === length.id && (
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
          </motion.button>
        ))}
      </div>
    </div>
  );
}
