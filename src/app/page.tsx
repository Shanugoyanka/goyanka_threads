"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StepWizard from "@/components/StepWizard";

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <StepWizard />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[var(--accent-light)] opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[var(--gold-light)] opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent-light)] opacity-10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-2xl"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--accent)] flex items-center justify-center shadow-lg">
            <span className="text-3xl">🧵</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Goyanka Threads
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-[var(--gold)] font-medium mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Custom Bridal Veils, Crafted with Love
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 mb-10 text-sm md:text-base leading-relaxed max-w-lg mx-auto"
        >
          Design your dream bridal veil in 5 simple steps. Choose from 15+
          authentic Indian embroidery patterns, handpicked bridal colours,
          premium lace borders, and add your personal touch.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="px-10 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
        >
          Design Your Veil ✨
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            No sign-up needed
          </span>
          <span>•</span>
          <span>5 simple steps</span>
          <span>•</span>
          <span>AI preview included</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
