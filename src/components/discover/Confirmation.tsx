"use client";

import { motion } from "framer-motion";

interface ConfirmationProps {
  enquiryNumber: string;
  onStartOver: () => void;
}

export default function Confirmation({
  enquiryNumber,
  onStartOver,
}: ConfirmationProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center"
        >
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Enquiry Submitted! 🎉
        </h2>

        <p className="text-gray-500 mb-4 text-sm">
          Our team will review your preferences and reach out on WhatsApp with
          personalised options and pricing.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-4 mb-6 inline-block"
        >
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Your Enquiry ID
          </p>
          <p
            className="text-lg font-bold text-[var(--gold)] tracking-widest"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {enquiryNumber}
          </p>
        </motion.div>

        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            Save this ID for reference. We typically respond within 2-4 hours
            during business hours.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartOver}
            className="px-8 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            Browse More Veils ✨
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Enquiry saved
          </span>
          <span>•</span>
          <span>WhatsApp reply coming soon</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
