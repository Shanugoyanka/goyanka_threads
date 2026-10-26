"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  veilColourOptions,
  veilLengthOptions,
  veilShapeOptions,
  blusherOptions,
  stonePlacementOptions,
  stoneDensityOptions,
  stoneColorOptions,
  customisationOptions,
  type OptionWithImage,
} from "@/data/orderOptions";

/* ─── Types ─────────────────────────────────────── */

export interface OrderFormData {
  veilColour: string;
  veilColourOther: string;
  veilWidth: string;
  veilLength: string;
  veilShape: string;
  veilShapeOther: string;
  blusher: string;
  borderDetails: string;
  stonePlacement: string;
  stonePlacementOther: string;
  stoneDensity: string;
  stoneDensityOther: string;
  stoneColor: string;
  customisation: string;
  customisationText: string;
  customisationSize: string;
  customisationPlacement: string;
  additionalInstructions: string;
  weddingDate: string;
  customerName: string;
  whatsappNumber: string;
  shippingAddress: string;
}

const INITIAL: OrderFormData = {
  veilColour: "",
  veilColourOther: "",
  veilWidth: "",
  veilLength: "",
  veilShape: "",
  veilShapeOther: "",
  blusher: "none",
  borderDetails: "",
  stonePlacement: "",
  stonePlacementOther: "",
  stoneDensity: "",
  stoneDensityOther: "",
  stoneColor: "",
  customisation: "",
  customisationText: "",
  customisationSize: "",
  customisationPlacement: "",
  additionalInstructions: "",
  weddingDate: "",
  customerName: "",
  whatsappNumber: "",
  shippingAddress: "",
};

/* ─── Step definitions ─────────────────────────── */

interface StepDef {
  id: string;
  title: string;
  subtitle?: string;
  required?: boolean;
  /** Return true if this step should be shown */
  show?: (data: OrderFormData) => boolean;
}

const STEPS: StepDef[] = [
  { id: "veilColour", title: "Veil Colour", subtitle: "Choose the colour for your veil", required: true },
  { id: "veilLength", title: "Veil Length", subtitle: "Select the length of your veil", required: true },
  { id: "veilShape", title: "Veil Shape", subtitle: "Choose the shape of your veil", required: true },
  { id: "blusher", title: "Blusher", subtitle: "Would you like a blusher?" },
  { id: "borderDetails", title: "Border Details", subtitle: "Describe the border for your veil", required: true },
  { id: "stonePlacement", title: "Stone Placement", subtitle: "Where should the stones go?" },
  { id: "stoneDensity", title: "Stone Density", subtitle: "How many stones?", show: (d) => !!d.stonePlacement && d.stonePlacement !== "no-stone" },
  { id: "stoneColor", title: "Stone Colour", subtitle: "Choose the stone colour" },
  { id: "customisation", title: "Customisation", subtitle: "Add a personal touch to your veil", required: true },
  { id: "customisationDetails", title: "Customisation Details", subtitle: "Tell us more about your customisation", show: (d) => !!d.customisation && d.customisation !== "none" },
  { id: "additionalInstructions", title: "Anything Else?", subtitle: "Any special instructions for our team" },
  { id: "weddingDate", title: "Wedding Date", subtitle: "When is the big day?", required: true },
  { id: "yourDetails", title: "Your Details", subtitle: "So we can reach you and ship your veil", required: true },
];

/* ─── Component ────────────────────────────────── */

interface Props {
  source: string | null;
  campaign: string | null;
  onSuccess: (orderNumber: string) => void;
}

export default function OrderForm({ source, campaign, onSuccess }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [data, setData] = useState<OrderFormData>(INITIAL);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const visibleSteps = STEPS.filter((s) => !s.show || s.show(data));
  const current = visibleSteps[stepIdx];
  const totalSteps = visibleSteps.length;
  const isLast = stepIdx === totalSteps - 1;

  const update = useCallback(
    (field: keyof OrderFormData, value: string | boolean[]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setFieldError("");
    },
    []
  );

  const validate = (): boolean => {
    const s = current;
    if (!s) return false;

    switch (s.id) {
      case "veilColour":
        if (!data.veilColour) { setFieldError("Please select a colour"); return false; }
        if (data.veilColour === "other" && !data.veilColourOther.trim()) { setFieldError("Enter the colour name"); return false; }
        return true;
      case "veilLength":
        if (!data.veilLength) { setFieldError("Please select a length"); return false; }
        return true;
      case "veilShape":
        if (!data.veilShape) { setFieldError("Please select a shape"); return false; }
        if (data.veilShape === "other" && !data.veilShapeOther.trim()) { setFieldError("Describe the shape"); return false; }
        return true;
      case "borderDetails":
        if (!data.borderDetails.trim()) { setFieldError("Please describe the border or write 'As discussed'"); return false; }
        return true;
      case "customisation":
        if (!data.customisation) { setFieldError("Please select an option"); return false; }
        return true;
      case "weddingDate":
        if (!data.weddingDate) { setFieldError("Please select your wedding date"); return false; }
        return true;
      case "yourDetails": {
        if (!data.customerName.trim() || data.customerName.trim().length < 2) { setFieldError("Please enter your name"); return false; }
        const phone = data.whatsappNumber.replace(/[\s\-()]/g, "");
        if (!/^[6-9]\d{9}$/.test(phone)) { setFieldError("Enter a valid 10-digit mobile number"); return false; }
        if (!data.shippingAddress.trim() || data.shippingAddress.trim().length < 10) { setFieldError("Enter your complete shipping address with pincode"); return false; }
        return true;
      }
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!validate()) return;
    setFieldError("");
    if (isLast) {
      handleSubmit();
    } else {
      setDirection(1);
      setStepIdx((i) => Math.min(i + 1, totalSteps - 1));
    }
  };

  const goBack = () => {
    setFieldError("");
    setDirection(-1);
    setStepIdx((i) => Math.max(i - 1, 0));
  };

  /** Auto-advance after selecting a single-choice option */
  const selectAndNext = (field: keyof OrderFormData, value: string) => {
    update(field, value);
    // Let state settle, then advance (unless "other" needs more input)
    if (value !== "other") {
      setTimeout(() => {
        setDirection(1);
        setStepIdx((i) => Math.min(i + 1, totalSteps - 1));
      }, 250);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.customerName.trim(),
          whatsappNumber: data.whatsappNumber.replace(/[\s\-()]/g, ""),
          shippingAddress: data.shippingAddress.trim(),
          veilColour: data.veilColour === "other" ? data.veilColourOther.trim() : data.veilColour,
          veilLength: data.veilLength,
          veilShape: data.veilShape,
          veilShapeOther: data.veilShapeOther,
          blusher: data.blusher,
          borderDetails: data.borderDetails.trim(),
          stonePlacement: data.stonePlacement || null,
          stonePlacementOther: data.stonePlacementOther,
          stoneDensity: data.stoneDensity || null,
          stoneDensityOther: data.stoneDensityOther,
          stoneColor: data.stoneColor || null,
          customisation: data.customisation,
          customisationText: data.customisationText,
          customisationSize: data.customisationSize,
          customisationPlacement: data.customisationPlacement,
          additionalInstructions: data.additionalInstructions,
          weddingDate: data.weddingDate,
          source,
          campaign,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Something went wrong.");
        return;
      }
      onSuccess(result.orderNumber);
    } catch {
      setError("Could not connect. Please check your internet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
              {stepIdx + 1} / {totalSteps}
            </p>
            {current?.required && (
              <span className="text-[10px] text-red-400 font-medium">Required</span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] rounded-full"
              animate={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current?.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.2 }}
          >
            {/* Title */}
            <h2
              className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-1"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {current?.title}
            </h2>
            {current?.subtitle && (
              <p className="text-sm text-gray-400 mb-6">{current.subtitle}</p>
            )}

            {/* Render the right step */}
            {current?.id === "veilColour" && (
              <ColourStep data={data} update={update} selectAndNext={selectAndNext} />
            )}
            {current?.id === "veilLength" && (
              <SingleSelectStep
                options={veilLengthOptions}
                value={data.veilLength}
                onSelect={(v) => selectAndNext("veilLength", v)}
              />
            )}
            {current?.id === "veilShape" && (
              <ImageSelectStep
                options={veilShapeOptions}
                value={data.veilShape}
                onSelect={(v) => selectAndNext("veilShape", v)}
                otherValue={data.veilShapeOther}
                onOtherChange={(v) => update("veilShapeOther", v)}
              />
            )}
            {current?.id === "blusher" && (
              <ImageSelectStep
                options={blusherOptions}
                value={data.blusher}
                onSelect={(v) => selectAndNext("blusher", v)}
              />
            )}
            {current?.id === "borderDetails" && (
              <div>
                <p className="text-xs text-gray-400 mb-3">
                  Describe the border style or write &quot;As discussed with designer&quot;.
                </p>
                <textarea
                  value={data.borderDetails}
                  onChange={(e) => update("borderDetails", e.target.value)}
                  placeholder="Describe the border..."
                  rows={4}
                  className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                  autoFocus
                />
              </div>
            )}
            {current?.id === "stonePlacement" && (
              <ImageSelectStep
                options={stonePlacementOptions}
                value={data.stonePlacement}
                onSelect={(v) => selectAndNext("stonePlacement", v)}
                otherValue={data.stonePlacementOther}
                onOtherChange={(v) => update("stonePlacementOther", v)}
                allowSkip
                onSkip={goNext}
              />
            )}
            {current?.id === "stoneDensity" && (
              <SingleSelectStep
                options={stoneDensityOptions}
                value={data.stoneDensity}
                onSelect={(v) => {
                  if (v === "other") {
                    update("stoneDensity", v);
                  } else {
                    selectAndNext("stoneDensity", v);
                  }
                }}
                otherValue={data.stoneDensityOther}
                onOtherChange={(v) => update("stoneDensityOther", v)}
                showOther={data.stoneDensity === "other"}
                allowSkip
                onSkip={goNext}
              />
            )}
            {current?.id === "stoneColor" && (
              <ImageSelectStep
                options={stoneColorOptions}
                value={data.stoneColor}
                onSelect={(v) => selectAndNext("stoneColor", v)}
                allowSkip
                onSkip={goNext}
              />
            )}
            {current?.id === "customisation" && (
              <SingleSelectStep
                options={customisationOptions}
                value={data.customisation}
                onSelect={(v) => selectAndNext("customisation", v)}
              />
            )}
            {current?.id === "customisationDetails" && (
              <CustomisationDetailsStep data={data} update={update} />
            )}
            {current?.id === "additionalInstructions" && (
              <div>
                <textarea
                  value={data.additionalInstructions}
                  onChange={(e) => update("additionalInstructions", e.target.value)}
                  placeholder="Any other instructions for our team... (optional)"
                  rows={4}
                  className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                  autoFocus
                />
              </div>
            )}
            {current?.id === "weddingDate" && (
              <div>
                <input
                  type="date"
                  value={data.weddingDate}
                  onChange={(e) => update("weddingDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
            )}
            {current?.id === "yourDetails" && (
              <YourDetailsStep data={data} update={update} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Errors */}
        {fieldError && (
          <p className="mt-3 text-sm text-red-500">{fieldError}</p>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917223864040"}?text=Hi%2C%20I%27m%20having%20trouble%20placing%20my%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-green-700 font-semibold underline"
            >
              Contact us on WhatsApp instead →
            </a>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          {stepIdx > 0 && (
            <button
              onClick={goBack}
              className="flex-1 py-3.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={goNext}
            disabled={submitting}
            className="flex-[2] py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            {submitting
              ? "Sending..."
              : isLast
              ? "Send Enquiry ✨"
              : !current?.required
              ? "Skip / Continue →"
              : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Sub-step Components
   ══════════════════════════════════════════════════ */

/* ─── Colour Swatches ─── */
function ColourStep({
  data,
  update,
  selectAndNext,
}: {
  data: OrderFormData;
  update: (field: keyof OrderFormData, value: string) => void;
  selectAndNext: (field: keyof OrderFormData, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {veilColourOptions.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectAndNext("veilColour", c.id)}
            className={`option-card flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition-all ${
              data.veilColour === c.id
                ? "selected border-[var(--gold)] bg-[var(--gold-light)]/30"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
              style={{ backgroundColor: c.swatch }}
            />
            <span className="text-sm font-medium text-gray-700">{c.label}</span>
          </button>
        ))}

        {/* Other */}
        <button
          type="button"
          onClick={() => update("veilColour", "other")}
          className={`option-card flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition-all col-span-2 ${
            data.veilColour === "other"
              ? "selected border-[var(--gold)] bg-[var(--gold-light)]/30"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
            ?
          </div>
          <span className="text-sm font-medium text-gray-700">Other</span>
        </button>
      </div>

      {data.veilColour === "other" && (
        <input
          type="text"
          value={data.veilColourOther}
          onChange={(e) => update("veilColourOther", e.target.value)}
          placeholder="Enter the colour name"
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
          autoFocus
        />
      )}
    </div>
  );
}

/* ─── Single-select text options ─── */
function SingleSelectStep({
  options,
  value,
  onSelect,
  otherValue,
  onOtherChange,
  showOther,
  allowSkip,
  onSkip,
}: {
  options: OptionWithImage[];
  value: string;
  onSelect: (v: string) => void;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
  showOther?: boolean;
  allowSkip?: boolean;
  onSkip?: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`option-card px-4 py-3.5 text-sm font-medium rounded-xl border cursor-pointer text-center transition-all ${
              value === opt.id
                ? "selected border-[var(--gold)] bg-[var(--gold-light)]/30 text-[var(--foreground)]"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showOther && onOtherChange && (
        <input
          type="text"
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Specify..."
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
          autoFocus
        />
      )}

      {allowSkip && onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 cursor-pointer"
        >
          Skip this step →
        </button>
      )}
    </div>
  );
}

/* ─── Image card select ─── */
function ImageSelectStep({
  options,
  value,
  onSelect,
  otherValue,
  onOtherChange,
  allowSkip,
  onSkip,
}: {
  options: OptionWithImage[];
  value: string;
  onSelect: (v: string) => void;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
  allowSkip?: boolean;
  onSkip?: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`option-card rounded-xl border cursor-pointer overflow-hidden transition-all ${
              value === opt.id
                ? "selected border-[var(--gold)] ring-2 ring-[var(--gold)]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {opt.image ? (
              <div className="aspect-[4/3] bg-gray-100 relative">
                <img
                  src={opt.image}
                  alt={opt.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-50">
                  <span className="text-3xl">
                    {opt.id.includes("round") ? "◯" :
                     opt.id.includes("scallop") ? "〰️" :
                     opt.id.includes("straight") ? "▬" :
                     opt.id.includes("detach") ? "📎" :
                     opt.id.includes("attach") ? "🔗" :
                     opt.id.includes("throughout") ? "✨" :
                     opt.id.includes("border") ? "🔲" :
                     opt.id.includes("crown") ? "👑" :
                     opt.id.includes("scatter") ? "💫" :
                     opt.id.includes("gold") ? "🟡" :
                     opt.id.includes("silver") ? "⚪" :
                     "✦"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <span className="text-3xl text-gray-300">
                  {opt.id === "other" ? "✏️" : opt.id === "none" ? "✕" : "✦"}
                </span>
              </div>
            )}
            <div className="px-3 py-2.5 bg-white">
              <p className={`text-sm font-medium text-center ${
                value === opt.id ? "text-[var(--foreground)]" : "text-gray-600"
              }`}>
                {opt.label}
              </p>
            </div>
          </button>
        ))}
      </div>

      {value === "other" && onOtherChange && (
        <input
          type="text"
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Describe..."
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
          autoFocus
        />
      )}

      {allowSkip && onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 cursor-pointer"
        >
          Skip this step →
        </button>
      )}
    </div>
  );
}

/* ─── Customisation details ─── */
function CustomisationDetailsStep({
  data,
  update,
}: {
  data: OrderFormData;
  update: (field: keyof OrderFormData, value: string) => void;
}) {
  const placeholders: Record<string, string> = {
    name: "e.g. Priya",
    "couples-name": "e.g. Priya & Arjun",
    "wedding-date": "e.g. 15.12.2026",
    initials: "e.g. P & A",
    logo: "Describe the logo",
    "custom-text": "Enter your text",
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Customisation Text
        </label>
        <input
          type="text"
          value={data.customisationText}
          onChange={(e) => update("customisationText", e.target.value)}
          placeholder={placeholders[data.customisation] || "Enter text"}
          className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Size <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={data.customisationSize}
          onChange={(e) => update("customisationSize", e.target.value)}
          placeholder='e.g. "Small", "Large", "As discussed"'
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Placement <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={data.customisationPlacement}
          onChange={(e) => update("customisationPlacement", e.target.value)}
          placeholder='e.g. "Centre bottom", "Edge of veil"'
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
        />
      </div>
    </div>
  );
}

/* ─── Your Details (last before confirmation) ─── */
function YourDetailsStep({
  data,
  update,
}: {
  data: OrderFormData;
  update: (field: keyof OrderFormData, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Your Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.customerName}
          onChange={(e) => update("customerName", e.target.value)}
          placeholder="Full name"
          className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          WhatsApp Number <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-3.5 rounded-xl border border-gray-200">
            +91
          </span>
          <input
            type="tel"
            value={data.whatsappNumber}
            onChange={(e) => update("whatsappNumber", e.target.value)}
            placeholder="10-digit mobile number"
            className="flex-1 px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Shipping Address <span className="text-red-400">*</span>
        </label>
        <textarea
          value={data.shippingAddress}
          onChange={(e) => update("shippingAddress", e.target.value)}
          placeholder="Full address with pincode"
          rows={3}
          className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[var(--gold)] resize-none"
        />
      </div>
    </div>
  );
}

