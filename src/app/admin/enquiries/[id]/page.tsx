"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { enquiryStatuses, teamMembers, getStatusConfig, getTeamMemberName } from "@/data/teamConfig";
import {
  colourOptions,
  styleOptions,
  budgetOptions,
  personalizationOptions,
} from "@/data/discoverOptions";

interface EnquiryDetail {
  id: string;
  enquiryNumber: string;
  status: string;
  customerName: string;
  whatsappNumber: string;
  weddingDate: string | null;
  weddingDateNotFixed: boolean;
  outfitColour: string | null;
  customOutfitColour: string | null;
  preferredStyle: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  personalization: string | null;
  source: string | null;
  campaign: string | null;
  assignedTo: string | null;
  internalNotes: string | null;
  submittedAt: string;
  firstOpenedAt: string | null;
  contactedAt: string | null;
  convertedAt: string | null;
  selectedProducts: {
    product: {
      id: string;
      name: string;
      description: string;
      basePrice: number;
      minPrice: number | null;
      maxPrice: number | null;
      imageUrls: string[];
      fabric: string;
      veilLength: string;
    };
  }[];
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
  assignedTo: string | null
): string {
  const firstName = customerName.split(" ")[0] || customerName;
  const teamMember = assignedTo
    ? getTeamMemberName(assignedTo) || "the Goyanka Threads bridal team"
    : "the Goyanka Threads bridal team";

  return `Hi ${firstName} ❤️\n\nThis is ${teamMember} from Goyanka Threads.\n\nI just saw the veil styles you shortlisted for your wedding. I'd love to help you finalize the design and customization. ✨\n\nI just wanted to confirm a couple of details with you before we take it ahead.`;
}

function getLabel(id: string | null, options: { id: string; label?: string; name?: string }[]): string {
  if (!id) return "—";
  const found = options.find((o) => o.id === id);
  return found ? (found.label ?? found.name ?? id) : id;
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

export default function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [enquiry, setEnquiry] = useState<EnquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const fetchEnquiry = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setEnquiry(data.enquiry);
      setNotes(data.enquiry.internalNotes || "");
      setStatus(data.enquiry.status);
      setAssignedTo(data.enquiry.assignedTo || "");
    } catch {
      setError("Enquiry not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEnquiry();
  }, [fetchEnquiry]);

  const handleSave = async (field: string, value: unknown) => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      const data = await res.json();
      setEnquiry((prev) => (prev ? { ...prev, ...data.enquiry } : prev));
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

  if (error || !enquiry) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">{error || "Not found"}</p>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const statusConf = getStatusConfig(enquiry.status);

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
                {enquiry.enquiryNumber}
              </h1>
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
        {/* WhatsApp Button — most important */}
        <a
          href={buildWhatsAppUrl(enquiry.whatsappNumber, buildWhatsAppMessage(enquiry.customerName, enquiry.assignedTo))}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-xl font-semibold text-base shadow-lg transition-colors"
        >
          Open in WhatsApp →
        </a>
        <p className="text-[10px] text-gray-400 text-center -mt-3">
          Opens WhatsApp with a pre-filled message — you can edit before sending
        </p>

        {/* Customer info */}
        <Section title="Customer">
          <InfoRow label="Name" value={enquiry.customerName} />
          <InfoRow label="WhatsApp" value={`+91 ${enquiry.whatsappNumber}`} />
        </Section>

        {/* Wedding */}
        <Section title="Wedding">
          <InfoRow
            label="Date"
            value={
              enquiry.weddingDate
                ? enquiry.weddingDate
                : enquiry.weddingDateNotFixed
                ? "Not fixed yet"
                : "—"
            }
          />
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <InfoRow
            label="Outfit Colour"
            value={
              enquiry.customOutfitColour
                ? `Other: ${enquiry.customOutfitColour}`
                : getLabel(enquiry.outfitColour, colourOptions)
            }
          />
          <InfoRow label="Style" value={getLabel(enquiry.preferredStyle, styleOptions)} />
          <InfoRow
            label="Budget"
            value={
              enquiry.budgetMin != null && enquiry.budgetMax != null
                ? `₹${enquiry.budgetMin.toLocaleString("en-IN")} – ₹${enquiry.budgetMax.toLocaleString("en-IN")}`
                : "—"
            }
          />
          <InfoRow label="Personalization" value={getLabel(enquiry.personalization, personalizationOptions)} />
        </Section>

        {/* Selected Veils */}
        <Section title={`Selected Veils (${enquiry.selectedProducts.length})`}>
          <div className="space-y-3">
            {enquiry.selectedProducts.map((sp) => {
              const p = sp.product;
              const img = (p.imageUrls as string[])[0];
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">👰</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">₹{p.basePrice.toLocaleString("en-IN")} • {p.fabric} • {p.veilLength === "120" ? "10 ft" : "7 ft"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Source / Campaign */}
        <Section title="Source">
          <InfoRow label="Source" value={enquiry.source || "Direct"} />
          {enquiry.campaign && <InfoRow label="Campaign" value={enquiry.campaign} />}
        </Section>

        {/* Timestamps */}
        <Section title="Timeline">
          <InfoRow label="Received" value={formatDateTime(enquiry.submittedAt)} />
          <InfoRow label="First opened" value={formatDateTime(enquiry.firstOpenedAt)} />
          <InfoRow label="Contacted" value={formatDateTime(enquiry.contactedAt)} />
          <InfoRow label="Converted" value={formatDateTime(enquiry.convertedAt)} />
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
            {enquiryStatuses.map((s) => (
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
            placeholder="Add notes about this enquiry..."
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
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}
