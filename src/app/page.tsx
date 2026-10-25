"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
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
        className="text-center z-10 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <img
            src="/logo.png"
            alt="Goyanka Threads"
            className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-2xl shadow-lg object-contain"
          />
        </motion.div>

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
          className="text-gray-500 mb-10 text-sm md:text-base leading-relaxed max-w-sm mx-auto"
        >
          Already finalised your design with our team? Place your order and
          track it online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <Link
            href="/veil"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow"
          >
            Design Your Perfect Veil ✨
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 flex items-center justify-center gap-4 md:gap-6 text-xs text-gray-400 flex-wrap"
        >
          <span>Customized bridal veils</span>
          <span className="hidden md:inline">•</span>
          <span>Made in India</span>
          <span className="hidden md:inline">•</span>
          <span>Track your order online</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
