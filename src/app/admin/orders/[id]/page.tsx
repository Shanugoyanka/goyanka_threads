"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import {
  orderStatuses,
  teamMembers,
  getOrderStatusConfig,
  getTeamMemberName,
} from "@/data/teamConfig";
import {
  veilShapeOptions,
  veilLengthOptions,
  stonePlacementOptions,
  stoneDensityOptions,
  stoneColorOptions,
  blusherOptions,
  customisationOptions,
  veilColourOptions,
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
  dispatchDate: string | null;
  finalisedPrice: number | null;
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
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
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
  return options.find((o) => o.id === id)?.label ?? id;
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
            <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
              ← Back
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{order.orderNumber}</h1>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.color}`}>
                {statusConf.label}
              </span>
            </div>
          </div>
          {saveMsg && (
            <span className={`text-xs ${saveMsg.includes("✓") ? "text-green-600" : "text-red-600"}`}>
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

        {/* Customer Info — editable */}
        <Section title="Customer">
          <EditableField label="Name" value={order.customerName} field="customerName" onSave={handleSave} saving={saving} />
          <EditableField label="WhatsApp" value={order.whatsappNumber} field="whatsappNumber" onSave={handleSave} saving={saving} prefix="+91 " />
          <EditableField label="Shipping Address" value={order.shippingAddress} field="shippingAddress" onSave={handleSave} saving={saving} multiline />
        </Section>

        {/* Veil Specifications — editable */}
        <Section title="Veil Specifications">
          <EditableField label="Width" value={order.veilWidth} field="veilWidth" onSave={handleSave} saving={saving} />
          <EditableField label="Colour" value={order.veilColour} field="veilColour" onSave={handleSave} saving={saving} />
          <EditableSelect
            label="Length"
            value={order.veilLength}
            field="veilLength"
            options={veilLengthOptions.map((o) => ({ value: o.id, label: o.label }))}
            onSave={handleSave}
            saving={saving}
            allowCustom
          />
          <EditableSelect
            label="Shape"
            value={order.veilShape}
            field="veilShape"
            options={veilShapeOptions.map((o) => ({ value: o.id, label: o.label }))}
            onSave={handleSave}
            saving={saving}
          />
          {order.veilShape === "other" && (
            <EditableField label="Shape (Other)" value={order.veilShapeOther || ""} field="veilShapeOther" onSave={handleSave} saving={saving} />
          )}
          <EditableSelect
            label="Blusher"
            value={order.blusher || "none"}
            field="blusher"
            options={[{ value: "none", label: "None" }, ...blusherOptions.filter(o => o.id !== "none").map((o) => ({ value: o.id, label: o.label }))]}
            onSave={handleSave}
            saving={saving}
          />
        </Section>

        {/* Design & Stones — editable */}
        <Section title="Design & Stones">
          <EditableField label="Border" value={order.borderDetails} field="borderDetails" onSave={handleSave} saving={saving} multiline />
          {order.referenceImageUrl && (
            <div className="py-2 border-b border-gray-50">
              <span className="text-xs text-gray-500 block mb-1.5">Border Reference Image</span>
              <a href={order.referenceImageUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-gray-200 max-w-xs">
                <img src={order.referenceImageUrl} alt="Border reference" className="w-full h-auto" />
              </a>
            </div>
          )}
          <EditableSelect
            label="Stone Placement"
            value={order.stonePlacement || ""}
            field="stonePlacement"
            options={[{ value: "", label: "Not set" }, ...stonePlacementOptions.map((o) => ({ value: o.id, label: o.label }))]}
            onSave={handleSave}
            saving={saving}
          />
          {order.stonePlacement === "other" && (
            <EditableField label="Placement (Other)" value={order.stonePlacementOther || ""} field="stonePlacementOther" onSave={handleSave} saving={saving} />
          )}
          <EditableSelect
            label="Stone Density"
            value={order.stoneDensity || ""}
            field="stoneDensity"
            options={[{ value: "", label: "Not set" }, ...stoneDensityOptions.map((o) => ({ value: o.id, label: o.label }))]}
            onSave={handleSave}
            saving={saving}
          />
          {order.stoneDensity === "other" && (
            <EditableField label="Density (Other)" value={order.stoneDensityOther || ""} field="stoneDensityOther" onSave={handleSave} saving={saving} />
          )}
          <EditableSelect
            label="Stone Color"
            value={order.stoneColor || ""}
            field="stoneColor"
            options={[{ value: "", label: "Not set" }, ...stoneColorOptions.map((o) => ({ value: o.id, label: o.label }))]}
            onSave={handleSave}
            saving={saving}
          />
        </Section>

        {/* Customisation — editable */}
        <Section title="Customisation">
          <EditableSelect
            label="Type"
            value={order.customisation}
            field="customisation"
            options={customisationOptions.map((o) => ({ value: o.id, label: o.label }))}
            onSave={handleSave}
            saving={saving}
          />
          {order.customisation !== "none" && (
            <>
              <EditableField label="Text" value={order.customisationText || ""} field="customisationText" onSave={handleSave} saving={saving} />
              <EditableField label="Size" value={order.customisationSize || ""} field="customisationSize" onSave={handleSave} saving={saving} />
              <EditableField label="Placement" value={order.customisationPlacement || ""} field="customisationPlacement" onSave={handleSave} saving={saving} />
            </>
          )}
          <EditableField label="Additional Instructions" value={order.additionalInstructions || ""} field="additionalInstructions" onSave={handleSave} saving={saving} multiline />
        </Section>

        {/* Dates — editable */}
        <Section title="Dates">
          <EditableField label="Wedding Date" value={order.weddingDate} field="weddingDate" onSave={handleSave} saving={saving} />
          <EditableField label="Dispatch Date" value={order.dispatchDate || ""} field="dispatchDate" onSave={handleSave} saving={saving} placeholder="Set by admin" />
        </Section>

        {/* Payment & Price (admin only) */}
        <Section title="Payment & Price">
          <div className="py-1.5 border-b border-gray-50">
            <label className="text-xs text-gray-500 block mb-1">Finalised Price (₹)</label>
            <PriceField
              value={order.finalisedPrice}
              onSave={(val) => handleSave("finalisedPrice", val)}
              saving={saving}
            />
          </div>
          <div className="py-1.5">
            <label className="text-xs text-gray-500 block mb-1">Payment Screenshot</label>
            {order.paymentScreenshotUrl ? (
              <div className="space-y-2">
                <a
                  href={order.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-gray-200 max-w-xs"
                >
                  <img
                    src={order.paymentScreenshotUrl}
                    alt="Payment screenshot"
                    className="w-full h-auto"
                  />
                </a>
                <ImageUrlField
                  value={order.paymentScreenshotUrl}
                  field="paymentScreenshotUrl"
                  onSave={handleSave}
                  saving={saving}
                />
              </div>
            ) : (
              <ImageUrlField
                value=""
                field="paymentScreenshotUrl"
                onSave={handleSave}
                saving={saving}
                placeholder="Paste image URL here"
              />
            )}
          </div>
        </Section>

        {/* Source */}
        <Section title="Source">
          <InfoRow label="Source" value={order.source || "Direct"} />
          {order.campaign && <InfoRow label="Campaign" value={order.campaign} />}
        </Section>

        {/* Timeline */}
        <Section title="Timeline">
          <InfoRow label="Received" value={formatDateTime(order.submittedAt)} />
          <InfoRow label="First opened" value={formatDateTime(order.firstOpenedAt)} />
          <InfoRow label="Dispatched" value={formatDateTime(order.dispatchedAt)} />
          <InfoRow label="Delivered" value={formatDateTime(order.deliveredAt)} />
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
              <option key={s.id} value={s.id}>{s.label}</option>
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
              <option key={m.id} value={m.id}>{m.name}</option>
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

/* ══════════════════════════════════════════════════
   Reusable Components
   ══════════════════════════════════════════════════ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right ml-4 max-w-[65%]">{value}</span>
    </div>
  );
}

/** Inline-editable text field — tap to edit, blur/enter to save */
function EditableField({
  label,
  value,
  field,
  onSave,
  saving,
  prefix,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  field: string;
  onSave: (field: string, value: string) => Promise<void>;
  saving: boolean;
  prefix?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    if (draft !== value) {
      onSave(field, draft);
    }
    setEditing(false);
  };

  if (!editing) {
    return (
      <div
        className="flex items-baseline justify-between py-1.5 border-b border-gray-50 last:border-0 group cursor-pointer"
        onClick={() => { setDraft(value); setEditing(true); }}
      >
        <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
        <div className="flex items-center gap-1.5 ml-4 max-w-[65%]">
          <span className="text-sm font-medium text-gray-900 text-right">
            {prefix}{value || <span className="text-gray-300">{placeholder || "—"}</span>}
          </span>
          <span className="text-gray-300 group-hover:text-blue-400 text-xs transition-colors">✎</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-1.5 border-b border-gray-50 last:border-0">
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          rows={3}
          autoFocus
          disabled={saving}
          className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === "Enter") save(); }}
          autoFocus
          disabled={saving}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-400"
        />
      )}
      <div className="flex gap-2 mt-1.5">
        <button
          onClick={save}
          disabled={saving}
          className="text-xs text-white bg-blue-500 px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600 disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs text-gray-500 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Inline-editable select — tap to change, saves immediately */
function EditableSelect({
  label,
  value,
  field,
  options,
  onSave,
  saving,
  allowCustom,
}: {
  label: string;
  value: string;
  field: string;
  options: { value: string; label: string }[];
  onSave: (field: string, value: string) => Promise<void>;
  saving: boolean;
  allowCustom?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const displayLabel = options.find((o) => o.value === value)?.label ?? value;

  if (!editing) {
    return (
      <div
        className="flex items-baseline justify-between py-1.5 border-b border-gray-50 last:border-0 group cursor-pointer"
        onClick={() => setEditing(true)}
      >
        <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
        <div className="flex items-center gap-1.5 ml-4">
          <span className="text-sm font-medium text-gray-900 text-right">{displayLabel || "—"}</span>
          <span className="text-gray-300 group-hover:text-blue-400 text-xs transition-colors">✎</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-1.5 border-b border-gray-50 last:border-0">
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          onSave(field, e.target.value);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        autoFocus
        disabled={saving}
        className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-400"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {allowCustom && (
        <p className="text-[10px] text-gray-400 mt-1">Or type a custom value in the text field below</p>
      )}
    </div>
  );
}

/** Price input with ₹ formatting */
function PriceField({
  value,
  onSave,
  saving,
}: {
  value: number | null;
  onSave: (val: number | null) => Promise<void>;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value?.toString() || "");

  if (!editing) {
    return (
      <div
        className="flex items-center justify-between group cursor-pointer"
        onClick={() => { setDraft(value?.toString() || ""); setEditing(true); }}
      >
        <span className="text-sm font-medium text-gray-900">
          {value ? `₹${value.toLocaleString("en-IN")}` : <span className="text-gray-300">Not set</span>}
        </span>
        <span className="text-gray-300 group-hover:text-blue-400 text-xs transition-colors">✎</span>
      </div>
    );
  }

  const save = () => {
    const num = parseInt(draft.replace(/[^\d]/g, ""));
    onSave(isNaN(num) ? null : num);
    setEditing(false);
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-500">₹</span>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
        onBlur={save}
        onKeyDown={(e) => { if (e.key === "Enter") save(); }}
        autoFocus
        disabled={saving}
        placeholder="e.g. 5500"
        className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-400"
      />
      <button onClick={save} disabled={saving} className="text-xs text-white bg-blue-500 px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-600 disabled:opacity-50">
        Save
      </button>
      <button onClick={() => setEditing(false)} className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
        Cancel
      </button>
    </div>
  );
}

/** URL input for images (paste a URL) */
function ImageUrlField({
  value,
  field,
  onSave,
  saving,
  placeholder,
}: {
  value: string;
  field: string;
  onSave: (field: string, value: string | null) => Promise<void>;
  saving: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(!value);
  const [draft, setDraft] = useState(value);

  if (!editing && value) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-blue-600 truncate flex-1">{value}</span>
        <button
          onClick={() => { setDraft(value); setEditing(true); }}
          className="text-xs text-gray-400 hover:text-blue-500 cursor-pointer"
        >
          ✎ Edit
        </button>
        <button
          onClick={() => onSave(field, null)}
          disabled={saving}
          className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
        >
          Remove
        </button>
      </div>
    );
  }

  const save = () => {
    const url = draft.trim();
    onSave(field, url || null);
    if (url) setEditing(false);
  };

  return (
    <div className="flex gap-2">
      <input
        type="url"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => { if (e.key === "Enter") save(); }}
        autoFocus={!value}
        disabled={saving}
        placeholder={placeholder || "Paste image URL"}
        className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400"
      />
      <button onClick={save} disabled={saving} className="text-xs text-white bg-blue-500 px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-600 disabled:opacity-50">
        Save
      </button>
    </div>
  );
}
