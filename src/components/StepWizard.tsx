"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PatternStep from "./steps/PatternStep";
import ColorStep from "./steps/ColorStep";
import LaceStep from "./steps/LaceStep";
import LengthStep from "./steps/LengthStep";
import CustomizationStep from "./steps/CustomizationStep";
import Preview from "./Preview";
import OrderForm from "./OrderForm";
import { VeilOrder } from "@/data/veilOptions";

const TOTAL_STEPS = 5;

const stepNames = [
  "Pattern",
  "Colour",
  "Border",
  "Length",
  "Custom",
  "Preview",
  "Order",
];

export default function StepWizard() {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<VeilOrder>({
    pattern: "",
    color: "",
    lace: "",
    length: "",
    customText: "",
    customType: "none",
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [direction, setDirection] = useState(1);

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return order.pattern !== "";
      case 1:
        return order.color !== "";
      case 2:
        return order.lace !== "";
      case 3:
        return order.length !== "";
      case 4:
        return true; // customization is optional
      default:
        return true;
    }
  }, [step, order]);

  const goNext = () => {
    if (canProceed()) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pattern: order.pattern,
          color: order.color,
          lace: order.lace,
          length: order.length,
          customText: order.customText,
        }),
      });
      const data = await res.json();
      setPreviewImages(data.images);
    } catch (error) {
      console.error("Failed to generate preview:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-[var(--gold-light)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1
              className="text-xl md:text-2xl font-bold text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Goyanka Threads
            </h1>
            <p className="text-xs text-[var(--gold)]">
              Custom Bridal Veils
            </p>
          </div>

          {/* Progress indicator */}
          {step <= TOTAL_STEPS && (
            <div className="flex items-center gap-1.5">
              {stepNames.slice(0, TOTAL_STEPS).map((name, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      i < step
                        ? "bg-[var(--gold)] text-white"
                        : i === step
                        ? "bg-[var(--accent)] text-white animate-pulse-gold"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < step ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < TOTAL_STEPS - 1 && (
                    <div
                      className={`w-4 md:w-8 h-0.5 transition-colors duration-300 ${
                        i < step ? "bg-[var(--gold)]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 0 && (
              <PatternStep
                selected={order.pattern}
                onSelect={(id) => setOrder({ ...order, pattern: id })}
              />
            )}
            {step === 1 && (
              <ColorStep
                selected={order.color}
                onSelect={(id) => setOrder({ ...order, color: id })}
              />
            )}
            {step === 2 && (
              <LaceStep
                selected={order.lace}
                onSelect={(id) => setOrder({ ...order, lace: id })}
              />
            )}
            {step === 3 && (
              <LengthStep
                selected={order.length}
                onSelect={(id) => setOrder({ ...order, length: id })}
              />
            )}
            {step === 4 && (
              <CustomizationStep
                customType={order.customType}
                customText={order.customText}
                onTypeChange={(type) =>
                  setOrder({
                    ...order,
                    customType: type as VeilOrder["customType"],
                  })
                }
                onTextChange={(text) =>
                  setOrder({ ...order, customText: text })
                }
              />
            )}
            {step === 5 && (
              <Preview
                order={order}
                previewImages={previewImages}
                isGenerating={isGenerating}
                onGenerate={handleGeneratePreview}
                onConfirm={() => {
                  setDirection(1);
                  setStep(6);
                }}
                onBack={() => {
                  setDirection(-1);
                  setStep(4);
                }}
              />
            )}
            {step === 6 && (
              <OrderForm
                order={order}
                previewImages={previewImages}
                onBack={() => {
                  setDirection(-1);
                  setStep(5);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with navigation buttons */}
      {step < TOTAL_STEPS && (
        <footer className="sticky bottom-0 glass-card border-t border-[var(--gold-light)]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Back
            </button>

            <span className="text-xs text-gray-400 hidden sm:block">
              Step {step + 1} of {TOTAL_STEPS} — {stepNames[step]}
            </span>

            <motion.button
              onClick={goNext}
              disabled={!canProceed()}
              whileHover={canProceed() ? { scale: 1.05 } : {}}
              whileTap={canProceed() ? { scale: 0.95 } : {}}
              className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed ${
                canProceed()
                  ? "bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {step === TOTAL_STEPS - 1 ? "See Preview →" : "Next →"}
            </motion.button>
          </div>
        </footer>
      )}
    </div>
  );
}
