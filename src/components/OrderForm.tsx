"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  patterns,
  colors,
  laces,
  lengths,
  VeilOrder,
  CustomerInfo,
} from "@/data/veilOptions";

interface OrderFormProps {
  order: VeilOrder;
  onBack: () => void;
}

export default function OrderForm({
  order,
  onBack,
}: OrderFormProps) {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const patternName = patterns.find((p) => p.id === order.pattern)?.name ?? "";
  const colorName = colors.find((c) => c.id === order.color)?.name ?? "";
  const laceName = laces.find((l) => l.id === order.lace)?.name ?? "";
  const lengthLabel =
    lengths.find((l) => l.id === order.length)?.label ?? "";

  const buildOrderMessage = () => {
    let msg = `🧵 *New Veil Order — Goyanka Threads*\n\n`;
    msg += `👰 *Veil Details:*\n`;
    msg += `• Pattern: ${patternName}\n`;
    msg += `• Colour: ${colorName}\n`;
    msg += `• Lace/Border: ${laceName}\n`;
    msg += `• Length: ${lengthLabel}\n`;
    if (order.customType !== "none" && order.customText) {
      msg += `• Customization: "${order.customText}" (${order.customType})\n`;
    }
    msg += `\n👤 *Customer Details:*\n`;
    msg += `• Name: ${customer.name}\n`;
    msg += `• Phone: ${customer.phone}\n`;
    msg += `• Address: ${customer.address}\n`;
    if (customer.email) msg += `• Email: ${customer.email}\n`;
    msg += `\n✨ Thank you for choosing Goyanka Threads!`;
    return msg;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(buildOrderMessage());
    const whatsappNumber = "919999999999"; // Replace with your WhatsApp number
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order,
          customer,
        }),
      });

      if (res.ok) {
        setSent(true);
        handleWhatsApp();
      }
    } catch {
      handleWhatsApp();
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-green-500"
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
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Order Sent Successfully! 🎉
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          We&apos;ve received your custom veil order. Our team will contact you
          shortly to confirm the details and discuss pricing.
        </p>
        <p className="text-sm text-gray-400">
          You can also reach us on WhatsApp for any queries
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Almost There!
      </h2>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
        Share your details so we can craft your dream veil
      </p>

      <div className="max-w-xl mx-auto">
        {/* Mini order summary */}
        <div className="glass-card rounded-xl p-4 mb-8 text-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>
              <strong>Pattern:</strong> {patternName}
            </span>
            <span>
              <strong>Colour:</strong> {colorName}
            </span>
            <span>
              <strong>Border:</strong> {laceName}
            </span>
            <span>
              <strong>Length:</strong> {lengthLabel}
            </span>
            {order.customType !== "none" && order.customText && (
              <span>
                <strong>Custom:</strong> &ldquo;{order.customText}&rdquo;
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Delivery Address *
            </label>
            <textarea
              required
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
              placeholder="Full delivery address with pincode"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:border-gray-400 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <motion.button
              type="submit"
              disabled={sending || !customer.name || !customer.phone || !customer.address}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.204 0-4.247-.703-5.916-1.9l-.422-.31-2.633.883.883-2.633-.31-.422A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Send via WhatsApp
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
