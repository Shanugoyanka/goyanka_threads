"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PreferenceAnswers,
  styleOptions,
  colourOptions,
  budgetOptions,
} from "@/data/discoverOptions";

interface PreferenceWizardProps {
  onComplete: (answers: PreferenceAnswers) => void;
  initialAnswers?: PreferenceAnswers;
}

const TOTAL_STEPS = 5;
const stepNames = ["Wedding Date", "Location", "Colour", "Style", "Budget"];

export default function PreferenceWizard({
  onComplete,
  initialAnswers,
}: PreferenceWizardProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<PreferenceAnswers>(
    initialAnswers ?? {
      weddingDate: "",
      city: "",
      pincode: "",
      outfitColour: "",
      preferredStyle: "",
      budgetRange: "",
    }
  );

  const canProceed = () => {
    switch (step) {
      case 0:
        return true; // wedding date is optional
      case 1:
        return true; // location is optional
      case 2:
        return answers.outfitColour !== "";
      case 3:
        return answers.preferredStyle !== "";
      case 4:
        return answers.budgetRange !== "";
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!canProceed()) return;
    if (step === TOTAL_STEPS - 1) {
      onComplete(answers);
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-[var(--gold-light)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Goyanka Threads"
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain"
            />
            <div>
              <h1
                className="text-sm md:text-lg font-bold text-[var(--foreground)] leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Goyanka Threads
              </h1>
              <p className="text-[10px] md:text-xs text-[var(--gold)]">
                Find Your Perfect Veil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {stepNames.map((name, i) => (
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
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
        </div>
      </header>

      {/* Content */}
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
              <StepLayout
                title="When's the big day?"
                subtitle="This helps us check delivery timelines"
              >
                <div className="max-w-sm mx-auto">
                  <input
                    type="date"
                    value={answers.weddingDate}
                    onChange={(e) =>
                      setAnswers({ ...answers, weddingDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-[var(--foreground)] text-lg focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Not decided yet? That&apos;s okay — skip this step
                  </p>
                </div>
              </StepLayout>
            )}

            {step === 1 && (
              <StepLayout
                title="Where's the celebration?"
                subtitle="City and pincode help with delivery estimates"
              >
                <div className="max-w-sm mx-auto space-y-3">
                  <input
                    type="text"
                    placeholder="City (e.g. Jaipur)"
                    value={answers.city}
                    onChange={(e) =>
                      setAnswers({ ...answers, city: e.target.value })
                    }
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 bg-white text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Pincode (e.g. 302001)"
                    value={answers.pincode}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 bg-white text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 text-center">
                    Optional — skip if you&apos;re not sure yet
                  </p>
                </div>
              </StepLayout>
            )}

            {step === 2 && (
              <StepLayout
                title="What colour is your bridal outfit?"
                subtitle="We'll find veils that complement your look"
              >
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  {colourOptions.map((colour, index) => (
                    <motion.button
                      key={colour.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                      onClick={() =>
                        setAnswers({ ...answers, outfitColour: colour.id })
                      }
                      className={`option-card rounded-2xl border-2 p-4 cursor-pointer flex flex-col items-center gap-3 ${
                        answers.outfitColour === colour.id
                          ? "selected"
                          : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-full border-4 transition-all duration-300 ${
                          answers.outfitColour === colour.id
                            ? "border-[var(--gold)] scale-110 shadow-lg"
                            : "border-white shadow-md"
                        }`}
                        style={{ backgroundColor: colour.hex }}
                      >
                        {answers.outfitColour === colour.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-full h-full rounded-full flex items-center justify-center"
                          >
                            <svg
                              className="w-7 h-7"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white"
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
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {colour.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </StepLayout>
            )}

            {step === 3 && (
              <StepLayout
                title="What style are you drawn to?"
                subtitle="Pick the vibe that suits your wedding"
              >
                <div className="max-w-lg mx-auto space-y-3">
                  {styleOptions.map((style, index) => (
                    <motion.button
                      key={style.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() =>
                        setAnswers({ ...answers, preferredStyle: style.id })
                      }
                      className={`option-card w-full p-4 rounded-xl border-2 text-left cursor-pointer ${
                        answers.preferredStyle === style.id
                          ? "selected"
                          : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{style.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--foreground)]">
                            {style.label}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {style.description}
                          </p>
                        </div>
                        {answers.preferredStyle === style.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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
                    </motion.button>
                  ))}
                </div>
              </StepLayout>
            )}

            {step === 4 && (
              <StepLayout
                title="What's your budget?"
                subtitle="All our veils are handcrafted with premium materials"
              >
                <div className="max-w-lg mx-auto space-y-3">
                  {budgetOptions.map((budget, index) => (
                    <motion.button
                      key={budget.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() =>
                        setAnswers({ ...answers, budgetRange: budget.id })
                      }
                      className={`option-card w-full p-4 rounded-xl border-2 text-left cursor-pointer ${
                        answers.budgetRange === budget.id
                          ? "selected"
                          : "border-gray-200 hover:border-[var(--gold-light)] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl">💰</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--foreground)]">
                            {budget.label}
                          </h3>
                        </div>
                        {answers.budgetRange === budget.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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
                    </motion.button>
                  ))}
                </div>
              </StepLayout>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer navigation */}
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
            {step === TOTAL_STEPS - 1 ? "Find My Veil ✨" : "Next →"}
          </motion.button>
        </div>
      </footer>
    </div>
  );
}

function StepLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        {title}
      </h2>
      <p className="text-center text-gray-500 mb-8 text-xs md:text-base">
        {subtitle}
      </p>
      {children}
    </div>
  );
}
