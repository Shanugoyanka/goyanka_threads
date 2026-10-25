"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TrackingData {
  orderNumber: string;
  status: string;
  customerName: string;
  veilColour: string;
  veilShape: string;
  customisation: string;
  weddingDate: string;
  dispatchDate: string | null;
  submittedAt: string;
  dispatchedAt: string | null;
  deliveredAt: string | null;
}

const STATUS_STEPS = [
  { id: "NEW", label: "Enquiry Received", icon: "📋" },
  { id: "FINALISED", label: "Finalised", icon: "✅" },
  { id: "PAYMENT_DONE", label: "Payment Done", icon: "💰" },
  { id: "DYEING", label: "Veil Dyeing", icon: "🎨" },
  { id: "STITCHING", label: "Stitching", icon: "🧵" },
  { id: "CUSTOMISATION", label: "Customisation", icon: "✨" },
  { id: "PACKED", label: "Packed", icon: "📦" },
  { id: "SHIPPED", label: "Shipped", icon: "🚚" },
  { id: "DELIVERED", label: "Delivered", icon: "🎉" },
];

function getStepIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex((s) => s.id === status);
  return idx >= 0 ? idx : 0;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TrackOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(
          `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Order not found.");
          return;
        }
        setOrder(data.order);
      } catch {
        setError("Could not load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--background)]">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">🔍</p>
          <h2
            className="text-xl font-bold mb-2 text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Order Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {error || "We couldn't find this order. Check the order number and try again."}
          </p>
          <Link
            href="/veil"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] text-white rounded-xl font-semibold text-sm"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isClosed = order.status === "CLOSED";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Order Tracking
            </p>
            <p
              className="text-lg font-bold text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {order.orderNumber}
            </p>
          </div>
          <img
            src="/logo.png"
            alt="Goyanka Threads"
            className="w-10 h-10 rounded-lg object-contain"
          />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Status Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
        >
          <h3
            className="text-sm font-semibold text-gray-700 mb-5"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {isClosed ? "Order Closed" : "Order Status"}
          </h3>

          <div className="space-y-0">
            {STATUS_STEPS.map((s, i) => {
              const isCompleted = i <= currentStep;
              const isCurrent = i === currentStep;
              const isLast = i === STATUS_STEPS.length - 1;

              return (
                <div key={s.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                        isCurrent
                          ? "bg-gradient-to-br from-[var(--gold)] to-[var(--accent)] shadow-lg"
                          : isCompleted
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {isCompleted ? (
                        isCurrent ? (
                          <span className="text-white">{s.icon}</span>
                        ) : (
                          <span>✅</span>
                        )
                      ) : (
                        <span className="opacity-40">{s.icon}</span>
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-8 ${
                          isCompleted && i < currentStep
                            ? "bg-green-300"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-2">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? "text-[var(--foreground)]"
                          : isCompleted
                          ? "text-green-700"
                          : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </p>
                    {s.id === "NEW" && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(order.submittedAt)}
                      </p>
                    )}
                    {s.id === "SHIPPED" && order.dispatchedAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(order.dispatchedAt)}
                      </p>
                    )}
                    {s.id === "DELIVERED" && order.deliveredAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(order.deliveredAt)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
        >
          <h3
            className="text-sm font-semibold text-gray-700 mb-3"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Order Summary
          </h3>
          <div className="space-y-2">
            <InfoRow label="Customer" value={order.customerName} />
            <InfoRow label="Veil Colour" value={order.veilColour} />
            <InfoRow
              label="Veil Shape"
              value={order.veilShape.charAt(0).toUpperCase() + order.veilShape.slice(1)}
            />
            <InfoRow
              label="Customisation"
              value={
                order.customisation === "none"
                  ? "None"
                  : order.customisation.charAt(0).toUpperCase() +
                    order.customisation.slice(1).replace(/-/g, " ")
              }
            />
            <InfoRow label="Wedding Date" value={order.weddingDate} />
            {order.dispatchDate && (
              <InfoRow label="Expected Dispatch" value={order.dispatchDate} />
            )}
          </div>
        </motion.div>

        {/* WhatsApp Help */}
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917223864040"}?text=${encodeURIComponent(
            `Hi! I have a question about my order ${order.orderNumber}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm text-center shadow-lg transition-colors"
        >
          Have questions? Chat with us 💬
        </motion.a>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
