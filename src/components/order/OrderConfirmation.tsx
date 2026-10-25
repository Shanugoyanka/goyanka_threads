"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  orderNumber: string;
}

export default function OrderConfirmation({ orderNumber }: Props) {
  const whatsappMsg = encodeURIComponent(
    `Hi! I just placed order ${orderNumber} on your website. Looking forward to my custom veil!`
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-green-100 opacity-30 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[var(--gold-light)] opacity-30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
        >
          <span className="text-4xl">✅</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 mb-2 text-sm"
        >
          Our designer will reach out to you on WhatsApp shortly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm"
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Your Order Number
          </p>
          <p
            className="text-2xl font-bold text-[var(--accent)]"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {orderNumber}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Link
            href={`/track/${orderNumber}`}
            className="block w-full py-3.5 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            Track Your Order →
          </Link>

          <a
            href={`https://wa.me/917223864040?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm shadow-lg transition-colors text-center"
          >
            Message us on WhatsApp 💬
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-6 text-xs text-gray-400"
        >
          Save your order number. You can track the status anytime.
        </motion.p>
      </motion.div>
    </div>
  );
}
