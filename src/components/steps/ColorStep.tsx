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
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Pick Your Colour
      </h2>
      <p className="text-center text-gray-500 mb-10 text-sm md:text-base">
        Choose from our curated palette of bridal reds & pinks
      </p>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {colors.map((color: ColorOption, index: number) => (
          <motion.button
            key={color.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            onClick={() => onSelect(color.id)}
            className="flex flex-col items-center gap-3 group cursor-pointer"
          >
            <div
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 transition-all duration-300 ${
                selected === color.id
                  ? "border-[var(--gold)] scale-110 shadow-lg"
                  : "border-transparent group-hover:border-[var(--gold-light)] group-hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {selected === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={color.textColor}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                selected === color.id
                  ? "text-[var(--foreground)]"
                  : "text-gray-500 group-hover:text-[var(--foreground)]"
              }`}
            >
              {color.name}
            </span>
          </motion.button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-6 rounded-2xl text-center"
          style={{
            backgroundColor: colors.find((c) => c.id === selected)?.hex + "15",
            borderLeft: `4px solid ${colors.find((c) => c.id === selected)?.hex}`,
          }}
        >
          <p className="text-sm">
            <span className="font-semibold">
              {colors.find((c) => c.id === selected)?.name}
            </span>{" "}
            — A timeless choice for your special day
          </p>
        </motion.div>
      )}
    </div>
  );
}
