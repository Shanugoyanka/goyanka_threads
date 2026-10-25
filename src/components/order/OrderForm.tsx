"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  veilShapeOptions,
  stonePlacementOptions,
  stoneDensityOptions,
  stoneColorOptions,
  blusherOptions,
  customisationOptions,
  confirmationStatements,
} from "@/data/orderOptions";

export interface OrderFormData {
  customerName: string;
  whatsappNumber: string;
  shippingAddress: string;
  veilWidth: string;
  veilColour: string;
  veilLength: string;
  blusher: string;
  veilShape: string;
  veilShapeOther: string;
  stonePlacement: string;
  stonePlacementOther: string;
  stoneDensity: string;
  stoneDensityOther: string;
  stoneColor: string;
  borderDetails: string;
  customisation: string;
  customisationText: string;
  customisationSize: string;
  customisationPlacement: string;
  additionalInstructions: string;
  weddingDate: string;
  dispatchDate: string;
  confirmations: boolean[];
}

const INITIAL_DATA: OrderFormData = {
  customerName: "",
  whatsappNumber: "",
  shippingAddress: "",
  veilWidth: "",
  veilColour: "",
  veilLength: "",
  blusher: "none",
  veilShape: "",
  veilShapeOther: "",
  stonePlacement: "",
  stonePlacementOther: "",
  stoneDensity: "",
  stoneDensityOther: "",
  stoneColor: "",
  borderDetails: "",
  customisation: "",
  customisationText: "",
  customisationSize: "",
  customisationPlacement: "",
  additionalInstructions: "",
  weddingDate: "",
  dispatchDate: "",
  confirmations: [false, false, false, false],
};

const STEP_TITLES = [
  "Your Details",
  "Veil Specifications",
  "Design & Stones",
  "Customisation",
  "Dates & Confirmation",
];

interface Props {
  source: string | null;
  campaign: string | null;
  onSuccess: (orderNumber: string) => void;
}

export default function OrderForm({ source, campaign, onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OrderFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const update = useCallback(
    (field: keyof OrderFormData, value: string | boolean[]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (step === 0) {
      if (!data.customerName.trim()) errs.customerName = "Name is required";
      const phone = data.whatsappNumber.replace(/[\s\-()]/g, "");
      if (!phone || !/^[6-9]\d{9}$/.test(phone))
        errs.whatsappNumber = "Enter a valid 10-digit mobile number";
      if (!data.shippingAddress.trim() || data.shippingAddress.trim().length < 10)
        errs.shippingAddress = "Enter your complete shipping address";
    }

    if (step === 1) {
      if (!data.veilWidth.trim()) errs.veilWidth = "Veil width is required";
      if (!data.veilColour.trim()) errs.veilColour = "Veil colour is required";
      if (!data.veilLength.trim()) errs.veilLength = "Veil length is required";
      if (!data.veilShape) errs.veilShape = "Select a veil shape";
      if (data.veilShape === "other" && !data.veilShapeOther.trim())
        errs.veilShapeOther = "Describe the shape";
    }

    if (step === 2) {
      if (!data.borderDetails.trim())
        errs.borderDetails = "Describe the border or write 'As discussed'";
    }

    if (step === 3) {
      if (!data.customisation) errs.customisation = "Select a customisation option";
    }

    if (step === 4) {
      if (!data.weddingDate) errs.weddingDate = "Wedding date is required";
      if (!data.dispatchDate) errs.dispatchDate = "Dispatch date is required";
      if (!data.confirmations.every(Boolean))
        errs.confirmations = "Please confirm all statements";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setApiError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source,
          campaign,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setApiError(result.error || "Something went wrong. Please try again.");
        return;
      }

      onSuccess(result.orderNumber);
    } catch {
      setApiError("Could not connect. Please check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleConfirmation = (index: number) => {
    const next = [...data.confirmations];
    next[index] = !next[index];
    update("confirmations", next);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
              Step {step + 1} of {STEP_TITLES.length}
            </p>
            <p
              className="text-sm font-semibold text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {STEP_TITLES[step]}
            </p>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <Step0
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 1 && (
              <Step1
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 2 && (
              <Step2
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 3 && (
              <Step3
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 4 && (
              <Step4
                data={data}
                errors={errors}
                update={update}
                toggleConfirmation={toggleConfirmation}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {apiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {apiError}
            <a
              href={`https://wa.me/917223864040?text=${encodeURIComponent("Hi, I'm having trouble placing my order on the website. Can you help?")}`}
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
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
            >
              ← Back
            </button>
          )}
          {step < STEP_TITLES.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-[2] py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-[2] py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : "Place Order ✨"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Steps ─────────────────────────────────────── */

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
}) {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:border-[var(--gold)] transition-colors ${
          error ? "border-red-300" : "border-gray-200"
        }`}
      />
      <FieldError msg={error} />
    </>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  error,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:border-[var(--gold)] transition-colors resize-none ${
          error ? "border-red-300" : "border-gray-200"
        }`}
      />
      <FieldError msg={error} />
    </>
  );
}

function OptionCards({
  options,
  value,
  onChange,
  error,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`option-card px-4 py-3 text-sm font-medium rounded-xl border cursor-pointer text-left transition-all ${
              value === opt.id
                ? "selected border-[var(--gold)] bg-[var(--gold-light)]/30 text-[var(--foreground)]"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <FieldError msg={error} />
    </>
  );
}

/* Step 0: Your Details */
function Step0({
  data,
  errors,
  update,
}: {
  data: OrderFormData;
  errors: Record<string, string>;
  update: (field: keyof OrderFormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel label="Your Name" required />
        <TextInput
          value={data.customerName}
          onChange={(v) => update("customerName", v)}
          placeholder="Full name"
          error={errors.customerName}
        />
      </div>
      <div>
        <FieldLabel label="WhatsApp Number" required />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-3 rounded-xl border border-gray-200">
            +91
          </span>
          <div className="flex-1">
            <TextInput
              value={data.whatsappNumber}
              onChange={(v) => update("whatsappNumber", v)}
              placeholder="10-digit mobile number"
              error={errors.whatsappNumber}
              type="tel"
            />
          </div>
        </div>
      </div>
      <div>
        <FieldLabel label="Shipping Address" required />
        <TextArea
          value={data.shippingAddress}
          onChange={(v) => update("shippingAddress", v)}
          placeholder="Full address with pincode"
          error={errors.shippingAddress}
          rows={3}
        />
      </div>
    </div>
  );
}

/* Step 1: Veil Specifications */
function Step1({
  data,
  errors,
  update,
}: {
  data: OrderFormData;
  errors: Record<string, string>;
  update: (field: keyof OrderFormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel label="Veil Width" required />
        <TextInput
          value={data.veilWidth}
          onChange={(v) => update("veilWidth", v)}
          placeholder='e.g. "72 inches" or "As discussed"'
          error={errors.veilWidth}
        />
      </div>
      <div>
        <FieldLabel label="Veil Colour" required />
        <TextInput
          value={data.veilColour}
          onChange={(v) => update("veilColour", v)}
          placeholder='e.g. "Ivory", "Off-white", "Blush"'
          error={errors.veilColour}
        />
      </div>
      <div>
        <FieldLabel label="Veil Length" required />
        <TextInput
          value={data.veilLength}
          onChange={(v) => update("veilLength", v)}
          placeholder='e.g. "Cathedral length" or "10 feet"'
          error={errors.veilLength}
        />
      </div>
      <div>
        <FieldLabel label="Veil Shape" required />
        <OptionCards
          options={veilShapeOptions}
          value={data.veilShape}
          onChange={(v) => update("veilShape", v)}
          error={errors.veilShape}
        />
        {data.veilShape === "other" && (
          <div className="mt-3">
            <TextInput
              value={data.veilShapeOther}
              onChange={(v) => update("veilShapeOther", v)}
              placeholder="Describe the shape"
              error={errors.veilShapeOther}
            />
          </div>
        )}
      </div>
      <div>
        <FieldLabel label="Blusher" />
        <OptionCards
          options={blusherOptions}
          value={data.blusher}
          onChange={(v) => update("blusher", v)}
        />
      </div>
    </div>
  );
}

/* Step 2: Design & Stones */
function Step2({
  data,
  errors,
  update,
}: {
  data: OrderFormData;
  errors: Record<string, string>;
  update: (field: keyof OrderFormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel label="Border Finalised" required />
        <p className="text-xs text-gray-400 mb-2">
          Describe the border style or write &quot;As discussed with designer&quot;. You can also
          share a reference image on WhatsApp.
        </p>
        <TextArea
          value={data.borderDetails}
          onChange={(v) => update("borderDetails", v)}
          placeholder="Describe the border..."
          error={errors.borderDetails}
          rows={3}
        />
      </div>
      <div>
        <FieldLabel label="Stone Placement" />
        <OptionCards
          options={stonePlacementOptions}
          value={data.stonePlacement}
          onChange={(v) => update("stonePlacement", v)}
        />
        {data.stonePlacement === "other" && (
          <div className="mt-3">
            <TextInput
              value={data.stonePlacementOther}
              onChange={(v) => update("stonePlacementOther", v)}
              placeholder="Describe placement"
            />
          </div>
        )}
      </div>
      <div>
        <FieldLabel label="Stone Density" />
        <OptionCards
          options={stoneDensityOptions}
          value={data.stoneDensity}
          onChange={(v) => update("stoneDensity", v)}
        />
        {data.stoneDensity === "other" && (
          <div className="mt-3">
            <TextInput
              value={data.stoneDensityOther}
              onChange={(v) => update("stoneDensityOther", v)}
              placeholder="Specify density"
            />
          </div>
        )}
      </div>
      <div>
        <FieldLabel label="Stone Color" />
        <OptionCards
          options={stoneColorOptions}
          value={data.stoneColor}
          onChange={(v) => update("stoneColor", v)}
        />
      </div>
    </div>
  );
}

/* Step 3: Customisation */
function Step3({
  data,
  errors,
  update,
}: {
  data: OrderFormData;
  errors: Record<string, string>;
  update: (field: keyof OrderFormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel label="Customisation Type" required />
        <OptionCards
          options={customisationOptions}
          value={data.customisation}
          onChange={(v) => update("customisation", v)}
          error={errors.customisation}
        />
      </div>
      {data.customisation && data.customisation !== "none" && (
        <>
          <div>
            <FieldLabel label="Customisation Text" />
            <TextInput
              value={data.customisationText}
              onChange={(v) => update("customisationText", v)}
              placeholder={
                data.customisation === "name"
                  ? "e.g. Priya"
                  : data.customisation === "couples-name"
                  ? "e.g. Priya & Arjun"
                  : data.customisation === "wedding-date"
                  ? "e.g. 15.12.2026"
                  : data.customisation === "initials"
                  ? "e.g. P & A"
                  : "Enter text"
              }
            />
          </div>
          <div>
            <FieldLabel label="Customisation Size" />
            <TextInput
              value={data.customisationSize}
              onChange={(v) => update("customisationSize", v)}
              placeholder='e.g. "Small", "Large", "As discussed"'
            />
          </div>
          <div>
            <FieldLabel label="Customisation Placement" />
            <TextInput
              value={data.customisationPlacement}
              onChange={(v) => update("customisationPlacement", v)}
              placeholder='e.g. "Centre bottom", "Edge of veil"'
            />
          </div>
        </>
      )}
      <div>
        <FieldLabel label="Additional Instructions" />
        <TextArea
          value={data.additionalInstructions}
          onChange={(v) => update("additionalInstructions", v)}
          placeholder="Any other instructions for our team..."
          rows={3}
        />
      </div>
    </div>
  );
}

/* Step 4: Dates & Confirmation */
function Step4({
  data,
  errors,
  update,
  toggleConfirmation,
}: {
  data: OrderFormData;
  errors: Record<string, string>;
  update: (field: keyof OrderFormData, value: string) => void;
  toggleConfirmation: (index: number) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel label="Wedding Date" required />
        <TextInput
          value={data.weddingDate}
          onChange={(v) => update("weddingDate", v)}
          placeholder="DD/MM/YYYY"
          error={errors.weddingDate}
        />
      </div>
      <div>
        <FieldLabel label="Dispatch Date" required />
        <p className="text-xs text-gray-400 mb-2">
          When do you need the veil shipped by?
        </p>
        <TextInput
          value={data.dispatchDate}
          onChange={(v) => update("dispatchDate", v)}
          placeholder="DD/MM/YYYY"
          error={errors.dispatchDate}
        />
      </div>

      {/* Payment Info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-green-800 mb-1">Payment</p>
        <p className="text-xs text-green-700 mb-2">
          Please make payment to the following number and share the screenshot on WhatsApp:
        </p>
        <p className="text-lg font-bold text-green-900 mb-2">+91 7223-864040</p>
        <a
          href="https://wa.me/917223864040?text=Hi%2C%20I%20am%20sharing%20my%20payment%20screenshot%20for%20my%20veil%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Share on WhatsApp →
        </a>
      </div>

      {/* Confirmations */}
      <div>
        <FieldLabel label="Order Confirmation" required />
        <div className="space-y-3">
          {confirmationStatements.map((statement, i) => (
            <label
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                data.confirmations[i]
                  ? "border-[var(--gold)] bg-[var(--gold-light)]/20"
                  : "border-gray-200 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={data.confirmations[i]}
                onChange={() => toggleConfirmation(i)}
                className="mt-0.5 w-4 h-4 accent-[var(--gold)] cursor-pointer"
              />
              <span className="text-xs text-gray-700 leading-relaxed">
                {statement}
              </span>
            </label>
          ))}
        </div>
        <FieldError msg={errors.confirmations} />
      </div>
    </div>
  );
}
