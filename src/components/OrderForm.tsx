"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  patterns,
  colors,
  laces,
  lengths,
  VeilOrder,
} from "@/data/veilOptions";

interface OrderFormProps {
  order: VeilOrder;
  onBack: () => void;
}

export default function OrderForm({ order, onBack }: OrderFormProps) {
  const [address, setAddress] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const patternName = patterns.find((p) => p.id === order.pattern)?.name ?? "";
  const colorName = colors.find((c) => c.id === order.color)?.name ?? "";
  const laceName = laces.find((l) => l.id === order.lace)?.name ?? "";
  const lengthLabel = lengths.find((l) => l.id === order.length)?.label ?? "";

  const buildOrderMessage = () => {
    let msg = `🧵 *New Veil Order — Goyanka Threads*\n\n`;
    msg += `👰 *Veil Details:*\n`;
    msg += `• Pattern: ${patternName}\n`;
    msg += `• Colour: ${colorName}\n`;
    msg += `• Border: ${laceName}\n`;
    msg += `• Length: ${lengthLabel}\n`;
    if (order.customType !== "none" && order.customText) {
      msg += `• Customization: "${order.customText}" (${order.customType})\n`;
    }
    msg += `\n📍 *Delivery Address:*\n${address}\n`;
    msg += `\n✨ Thank you for choosing Goyanka Threads!`;
    return msg;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(buildOrderMessage());
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSent(true);
    handleWhatsApp();
    setSending(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Order Sent! 🎉
        </h2>
        <p className="text-gray-500 mb-4 max-w-sm mx-auto text-sm">
          Your order details have been sent via WhatsApp. Our team will
          confirm the details and pricing shortly.
        </p>
        <p className="text-xs text-gray-400">
          Didn&apos;t open WhatsApp?{" "}
          <button onClick={handleWhatsApp} className="text-green-600 underline cursor-pointer">
            Tap here to resend
          </button>
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <h2
        className="text-xl md:text-3xl font-bold text-center mb-1"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Almost There!
      </h2>
      <p className="text-center text-gray-500 mb-6 text-xs md:text-base">
        Add your delivery address and send the order via WhatsApp
      </p>

      <div className="max-w-md mx-auto">
        {/* Mini order summary */}
        <div className="glass-card rounded-xl p-4 mb-6 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Pattern</span>
              <span className="font-medium">{patternName}</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Colour</span>
              <span className="font-medium">{colorName}</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Border</span>
              <span className="font-medium">{laceName}</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Length</span>
              <span className="font-medium">{lengthLabel}</span>
            </div>
            {order.customType !== "none" && order.customText && (
              <div className="col-span-2">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Custom</span>
                <span className="font-medium">&ldquo;{order.customText}&rdquo;</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Delivery Address
            </label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full delivery address with pincode"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-gray-400 resize-none text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-400 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <motion.button
              type="submit"
              disabled={sending || !address.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.204 0-4.247-.703-5.916-1.9l-.422-.31-2.633.883.883-2.633-.31-.422A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Send via WhatsApp
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
