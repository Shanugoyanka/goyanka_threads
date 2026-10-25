"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import OrderForm from "@/components/order/OrderForm";
import OrderConfirmation from "@/components/order/OrderConfirmation";

type FlowStep = "landing" | "form" | "confirmation";

function OrderFlow() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const campaign = searchParams.get("campaign");

  const [flowStep, setFlowStep] = useState<FlowStep>("landing");
  const [orderNumber, setOrderNumber] = useState("");

  if (flowStep === "form") {
    return (
      <OrderForm
        source={source}
        campaign={campaign}
        onSuccess={(num) => {
          setOrderNumber(num);
          setFlowStep("confirmation");
        }}
      />
    );
  }

  if (flowStep === "confirmation") {
    return <OrderConfirmation orderNumber={orderNumber} />;
  }

  // Landing screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
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
            className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-2xl shadow-lg object-contain"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3 leading-snug"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Place Your Custom Veil Order ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 mb-8 text-sm md:text-base leading-relaxed max-w-sm mx-auto"
        >
          Already finalised your design with us? Fill in your order details and
          our team will get started right away.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFlowStep("form")}
          className="px-10 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
        >
          Start Order →
        </motion.button>

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

export default function VeilPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
        </div>
      }
    >
      <OrderFlow />
    </Suspense>
  );
}
