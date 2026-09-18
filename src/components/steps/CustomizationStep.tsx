"use client";

import { motion } from "framer-motion";

interface CustomizationStepProps {
  customType: string;
  customText: string;
  onTypeChange: (type: string) => void;
  onTextChange: (text: string) => void;
}

const customOptions = [
  {
    id: "none",
    label: "No Customization",
    description: "Keep it classic — no added text",
    emoji: "✨",
  },
  {
    id: "initials",
    label: "Initials",
    description: "E.g. 'S & R' — stitched elegantly",
    emoji: "💌",
    placeholder: "Enter initials (e.g. S & R)",
  },
  {
    id: "name",
    label: "Name",
    description: "Your name or couple's names",
    emoji: "💕",
    placeholder: "Enter name(s) (e.g. Shanu & Riya)",
  },
  {
    id: "date",
    label: "Wedding Date",
    description: "Your special date embroidered",
    emoji: "📅",
    placeholder: "Enter date (e.g. 15.12.2026)",
  },
  {
    id: "custom",
    label: "Custom Text",
    description: "Any message or text you'd like",
    emoji: "✍️",
    placeholder: "Enter your custom text",
  },
];

export default function CustomizationStep({
  customType,
  customText,
  onTypeChange,
  onTextChange,
}: CustomizationStepProps) {
  const selectedOption = customOptions.find((o) => o.id === customType);

  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Add a Personal Touch
      </h2>
      <p className="text-center text-gray-500 mb-6 text-xs md:text-base">
        Make it uniquely yours with custom embroidery
      </p>

      <div className="max-w-lg mx-auto space-y-3">
        {customOptions.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => {
              onTypeChange(option.id);
              if (option.id === "none") onTextChange("");
            }}
            className={`option-card w-full p-4 rounded-xl border-2 text-left cursor-pointer ${
              customType === option.id
                ? "selected"
                : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{option.emoji}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--foreground)]">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              {customType === option.id && (
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

      {/* Text input for selected customization */}
      {customType && customType !== "none" && selectedOption?.placeholder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="max-w-lg mx-auto mt-4"
        >
          <div className="relative">
            <input
              type="text"
              value={customText}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={selectedOption.placeholder}
              maxLength={40}
              className="w-full px-5 py-4 rounded-xl border-2 border-[var(--gold-light)] bg-white text-[var(--foreground)] text-lg focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {customText.length}/40
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            This text will be beautifully embroidered on your veil
          </p>
        </motion.div>
      )}
    </div>
  );
}
