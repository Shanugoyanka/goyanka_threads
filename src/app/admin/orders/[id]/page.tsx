"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { orderStatuses, teamMembers, getOrderStatusConfig, getTeamMemberName } from "@/data/teamConfig";
import {
  veilShapeOptions,
  stonePlacementOptions,
  stoneDensityOptions,
  stoneColorOptions,
  blusherOptions,
  customisationOptions,
} from "@/data/orderOptions";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  whatsappNumber: string;
  shippingAddress: string;
  veilWidth: string;
  veilColour: string;
  veilLength: string;
  blusher: string | null;
  veilShape: string;
  veilShapeOther: string | null;
  stonePlacement: string | null;
  stonePlacementOther: string | null;
  stoneDensity: string | null;
  stoneDensityOther: string | null;
  stoneColor: string | null;
  borderDetails: string;
  referenceImageUrl: string | null;
  customisation: string;
  customisationText: string | null;
  customisationSize: string | null;
  customisationPlacement: string | null;
  additionalInstructions: string | null;
  customisationRefImageUrl: string | null;
  weddingDate: string;
  dispatchDate: string;
  paymentScreenshotUrl: string | null;
  assignedTo: string | null;
  internalNotes: string | null;
  source: string | null;
  campaign: string | null;
  submittedAt: string;
  firstOpenedAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
}

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("91") && cleaned.length === 12) return cleaned;
  if (cleaned.length === 10) return `91${cleaned}`;
  return `91${cleaned}`;
}

function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function buildWhatsAppMessage(
  customerName: string,
  orderNumber: string,
  assignedTo: string | null
): string {
  const firstName = customerName.split(" ")[0] || customerName;
  const teamMember = assignedTo
    ? getTeamMemberName(assignedTo) || "the Goyanka Threads team"
    : "the Goyanka Threads team";

  return `Hi ${firstName} ❤️\n\nThis is ${teamMember} from Goyanka Threads.\n\nI have your order ${orderNumber} and I'm getting started on your custom veil. ✨\n\nJust wanted to confirm a few details before we proceed.`;
}

function getLabel(
  id: string | null,
  options: { id: string; label: string }[]
): string {
  if (!id) return "—";
  const found = options.find((o) => o.id === id);
  return found ? found.label : id;
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setOrder(data.order);
      setNotes(data.order.internalNotes || "");
      setStatus(data.order.status);
      setAssignedTo(data.order.assignedTo || "");

      // Mark as opened
      if (!data.order.firstOpenedAt) {
        fetch(`/api/admin/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstOpenedAt: new Date().toISOString() }),
        });
      }
    } catch {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleSave = async (field: string, value: unknown) => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      const data = await res.json();
      setOrder((prev) => (prev ? { ...prev, ...data.order } : prev));
      setSaveMsg("Saved ✓");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">{error || "Not found"}</p>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const statusConf = getOrderStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {order.orderNumber}
              </h1>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.color}`}
              >
                {statusConf.label}
              </span>
            </div>
          </div>
          {saveMsg && (
            <span
              className={`text-xs ${
                saveMsg.includes("✓") ? "text-green-600" : "text-red-600"
              }`}
            >
              {saveMsg}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 space-y-5 pb-8">
        {/* WhatsApp Button */}
        <a
          href={buildWhatsAppUrl(
            order.whatsappNumber,
            buildWhatsAppMessage(order.customerName, order.orderNumber, order.assignedTo)
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-xl font-semibold text-base shadow-lg transition-colors"
        >
          Open in WhatsApp →
        </a>
        <p className="text-[10px] text-gray-400 text-center -mt-3">
          Opens WhatsApp with a pre-filled message — edit before sending
        </p>

        {/* Customer Info */}
        <Section title="Customer">
          <InfoRow label="Name" value={order.customerName} />
          <InfoRow label="WhatsApp" value={`+91 ${order.whatsappNumber}`} />
          <InfoRow label="Shipping Address" value={order.shippingAddress} />
        </Section>

        {/* Veil Specifications */}
        <Section title="Veil Specifications">
          <InfoRow label="Width" value={order.veilWidth} />
          <InfoRow label="Colour" value={order.veilColour} />
          <InfoRow label="Length" value={order.veilLength} />
          <InfoRow
            label="Shape"
            value={
              order.veilShape === "other"
                ? `Other: ${order.veilShapeOther || "—"}`
                : getLabel(order.veilShape, veilShapeOptions)
            }
          />
          <InfoRow
            label="Blusher"
            value={order.blusher ? getLabel(order.blusher, blusherOptions) : "None"}
          />
        </Section>

        {/* Design & Stones */}
        <Section title="Design & Stones">
          <InfoRow label="Border" value={order.borderDetails} />
          <InfoRow
            label="Stone Placement"
            value={
              order.stonePlacement === "other"
                ? `Other: ${order.stonePlacementOther || "—"}`
                : getLabel(order.stonePlacement, stonePlacementOptions)
            }
          />
          <InfoRow
            label="Stone Density"
            value={
              order.stoneDensity === "other"
                ? `Other: ${order.stoneDensityOther || "—"}`
                : getLabel(order.stoneDensity, stoneDensityOptions)
            }
          />
          <InfoRow
            label="Stone Color"
            value={getLabel(order.stoneColor, stoneColorOptions)}
          />
        </Section>

        {/* Customisation */}
        <Section title="Customisation">
          <InfoRow
            label="Type"
            value={getLabel(order.customisation, customisationOptions)}
          />
          {order.customisation !== "none" && (
            <>
              <InfoRow label="Text" value={order.customisationText || "—"} />
              <InfoRow label="Size" value={order.customisationSize || "—"} />
              <InfoRow
                label="Placement"
                value={order.customisationPlacement || "—"}
              />
            </>
          )}
          {order.additionalInstructions && (
            <InfoRow
              label="Additional Instructions"
              value={order.additionalInstructions}
            />
          )}
        </Section>

        {/* Dates */}
        <Section title="Dates">
          <InfoRow label="Wedding Date" value={order.weddingDate} />
          <InfoRow label="Requested Dispatch" value={order.dispatchDate} />
        </Section>

        {/* Source */}
        <Section title="Source">
          <InfoRow label="Source" value={order.source || "Direct"} />
          {order.campaign && (
            <InfoRow label="Campaign" value={order.campaign} />
          )}
        </Section>

        {/* Timeline */}
        <Section title="Timeline">
          <InfoRow label="Received" value={formatDateTime(order.submittedAt)} />
          <InfoRow
            label="First opened"
            value={formatDateTime(order.firstOpenedAt)}
          />
          <InfoRow
            label="Dispatched"
            value={formatDateTime(order.dispatchedAt)}
          />
          <InfoRow
            label="Delivered"
            value={formatDateTime(order.deliveredAt)}
          />
        </Section>

        {/* Status */}
        <Section title="Status">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleSave("status", e.target.value);
            }}
            disabled={saving}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 disabled:opacity-50"
          >
            {orderStatuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Section>

        {/* Assignment */}
        <Section title="Assigned To">
          <select
            value={assignedTo}
            onChange={(e) => {
              setAssignedTo(e.target.value);
              handleSave("assignedTo", e.target.value || null);
            }}
            disabled={saving}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 disabled:opacity-50"
          >
            <option value="">Unassigned</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Section>

        {/* Internal Notes */}
        <Section title="Internal Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this order..."
            rows={4}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 resize-none"
          />
          <button
            onClick={() => handleSave("internalNotes", notes)}
            disabled={saving}
            className="mt-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Notes"}
          </button>
        </Section>

        {/* Tracking Link */}
        <Section title="Customer Tracking Link">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Share this link with the customer:</p>
            <p className="text-sm font-mono text-blue-600 break-all">
              {typeof window !== "undefined"
                ? `${window.location.origin}/track/${order.orderNumber}`
                : `/track/${order.orderNumber}`}
            </p>
          </div>
        </Section>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right ml-4 max-w-[65%]">
        {value}
      </span>
    </div>
  );
}
