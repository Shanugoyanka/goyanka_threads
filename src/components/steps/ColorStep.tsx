"use client";

import { colors, ColorOption } from "@/data/veilOptions";
import { motion } from "framer-motion";

interface ColorStepProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function ColorStep({ selected, onSelect }: ColorStepProps) {
  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Pick Your Colour
      </h2>
      <p className="text-center text-gray-500 mb-8 text-xs md:text-base">
        Choose your bridal shade
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {colors.map((color: ColorOption, index: number) => (
          <motion.button
            key={color.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            onClick={() => onSelect(color.id)}
            className={`option-card rounded-2xl border-2 p-4 cursor-pointer flex flex-col items-center gap-3 ${
              selected === color.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full border-4 transition-all duration-300 ${
                selected === color.id
                  ? "border-[var(--gold)] scale-110 shadow-lg"
                  : "border-white shadow-md"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {selected === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full flex items-center justify-center"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color.textColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {color.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
