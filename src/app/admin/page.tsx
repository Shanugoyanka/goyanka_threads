"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  orderStatuses,
  teamMembers,
  getOrderStatusConfig,
  getTeamMemberName,
} from "@/data/teamConfig";

interface OrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  whatsappNumber: string;
  veilColour: string;
  veilShape: string;
  customisation: string;
  weddingDate: string;
  dispatchDate: string | null;
  finalisedPrice: number | null;
  status: string;
  assignedTo: string | null;
  submittedAt: string;
  firstOpenedAt: string | null;
}

/* ─── Helpers ─── */

const DONE_STATUSES = new Set(["DELIVERED", "CLOSED"]);

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function parseDateLoose(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Handle ISO (from calendar input) or DD/MM/YYYY or text
  const iso = new Date(dateStr);
  if (!isNaN(iso.getTime())) return iso;
  const parts = dateStr.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (parts) {
    const y = parts[3].length === 2 ? 2000 + parseInt(parts[3]) : parseInt(parts[3]);
    return new Date(y, parseInt(parts[2]) - 1, parseInt(parts[1]));
  }
  return null;
}

function daysUntilWedding(dateStr: string): number | null {
  const d = parseDateLoose(dateStr);
  if (!d) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

function weddingUrgencyLabel(days: number | null): { text: string; color: string } | null {
  if (days === null) return null;
  if (days < 0) return { text: "Wedding passed", color: "text-gray-400" };
  if (days <= 7) return { text: `${days}d away 🔴`, color: "text-red-600 font-bold" };
  if (days <= 14) return { text: `${days}d away`, color: "text-orange-600 font-semibold" };
  if (days <= 30) return { text: `${days}d away`, color: "text-amber-600" };
  return { text: `${days}d away`, color: "text-gray-500" };
}

/* ─── Sort options ─── */

type SortKey = "wedding-soon" | "newest" | "oldest" | "status";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "wedding-soon", label: "Wedding soonest" },
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "status", label: "By status" },
];

const STATUS_ORDER: Record<string, number> = {};
orderStatuses.forEach((s, i) => { STATUS_ORDER[s.id] = i; });

/* ─── Quick filters ─── */

type QuickFilter = "all" | "urgent" | "this-week" | "this-month" | "unassigned" | "active";

const QUICK_FILTERS: { id: QuickFilter; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "📋" },
  { id: "urgent", label: "Urgent", icon: "🔴" },
  { id: "this-week", label: "Wedding this week", icon: "⚡" },
  { id: "this-month", label: "Wedding this month", icon: "📅" },
  { id: "active", label: "Active", icon: "🔧" },
  { id: "unassigned", label: "Unassigned", icon: "👤" },
];

/* ─── Component ─── */

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("wedding-soon");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  /* ─── Derived data ─── */

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;

    // Status tab filter
    if (statusFilter !== "ALL") {
      list = list.filter((o) => o.status === statusFilter);
    }

    // Quick filter
    if (quickFilter === "urgent") {
      list = list.filter((o) => {
        if (DONE_STATUSES.has(o.status)) return false;
        const days = daysUntilWedding(o.weddingDate);
        return days !== null && days >= 0 && days <= 14;
      });
    } else if (quickFilter === "this-week") {
      list = list.filter((o) => {
        const days = daysUntilWedding(o.weddingDate);
        return days !== null && days >= 0 && days <= 7;
      });
    } else if (quickFilter === "this-month") {
      list = list.filter((o) => {
        const days = daysUntilWedding(o.weddingDate);
        return days !== null && days >= 0 && days <= 30;
      });
    } else if (quickFilter === "unassigned") {
      list = list.filter((o) => !o.assignedTo && !DONE_STATUSES.has(o.status));
    } else if (quickFilter === "active") {
      list = list.filter((o) => !DONE_STATUSES.has(o.status));
    }

    // Assignee filter
    if (assigneeFilter) {
      list = list.filter((o) => o.assignedTo === assigneeFilter);
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.whatsappNumber.includes(q) ||
          o.orderNumber.toLowerCase().includes(q) ||
          o.veilColour.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...list];
    switch (sortBy) {
      case "wedding-soon":
        sorted.sort((a, b) => {
          const da = daysUntilWedding(a.weddingDate);
          const db = daysUntilWedding(b.weddingDate);
          if (da === null && db === null) return 0;
          if (da === null) return 1;
          if (db === null) return -1;
          return da - db;
        });
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        break;
      case "status":
        sorted.sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));
        break;
    }

    return sorted;
  }, [orders, statusFilter, quickFilter, assigneeFilter, sortBy, search]);

  const totalNew = statusCounts["NEW"] ?? 0;
  const totalInProgress =
    (statusCounts["FINALISED"] ?? 0) +
    (statusCounts["PAYMENT_DONE"] ?? 0) +
    (statusCounts["DYEING"] ?? 0) +
    (statusCounts["STITCHING"] ?? 0) +
    (statusCounts["CUSTOMISATION"] ?? 0);
  const totalShipped = (statusCounts["PACKED"] ?? 0) + (statusCounts["SHIPPED"] ?? 0);
  const totalDelivered = statusCounts["DELIVERED"] ?? 0;

  const urgentCount = orders.filter((o) => {
    if (DONE_STATUSES.has(o.status)) return false;
    const days = daysUntilWedding(o.weddingDate);
    return days !== null && days >= 0 && days <= 14;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">GOYANKA THREADS</h1>
            <p className="text-xs text-gray-500">Orders Dashboard</p>
          </div>
          <button
            onClick={fetchData}
            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <SummaryCard label="New" count={totalNew} color="bg-blue-500" highlight={totalNew > 0} />
          <SummaryCard label="In Progress" count={totalInProgress} color="bg-amber-500" />
          <SummaryCard label="Shipped" count={totalShipped} color="bg-purple-500" />
          <SummaryCard label="Delivered" count={totalDelivered} color="bg-green-500" />
          <SummaryCard
            label="Urgent"
            count={urgentCount}
            color="bg-red-500"
            highlight={urgentCount > 0}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {QUICK_FILTERS.map((qf) => (
            <button
              key={qf.id}
              onClick={() => {
                setQuickFilter(qf.id);
                if (qf.id !== "all") setStatusFilter("ALL");
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer transition-colors ${
                quickFilter === qf.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <span>{qf.icon}</span>
              {qf.label}
              {qf.id === "urgent" && urgentCount > 0 && quickFilter !== "urgent" && (
                <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {urgentCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + Sort + Assignee row */}
        <div className="flex flex-col md:flex-row gap-2 mb-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, phone, order #..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setSearchInput(""); }}
                className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                ✕
              </button>
            )}
          </form>

          <div className="flex gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>↕ {s.label}</option>
              ))}
            </select>

            {/* Assignee */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="">All team</option>
              <option value="__unassigned">Unassigned</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {[{ id: "ALL", label: "All" }, ...orderStatuses].map((tab) => {
            const count = tab.id === "ALL" ? orders.length : statusCounts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  if (tab.id !== "ALL") setQuickFilter("all");
                }}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer transition-colors ${
                  statusFilter === tab.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {tab.label} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Active filters indicator */}
        {(quickFilter !== "all" || assigneeFilter || search || statusFilter !== "ALL") && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs text-gray-400">Filters:</span>
            {quickFilter !== "all" && (
              <FilterChip
                label={QUICK_FILTERS.find((q) => q.id === quickFilter)?.label || ""}
                onRemove={() => setQuickFilter("all")}
              />
            )}
            {statusFilter !== "ALL" && (
              <FilterChip
                label={orderStatuses.find((s) => s.id === statusFilter)?.label || ""}
                onRemove={() => setStatusFilter("ALL")}
              />
            )}
            {assigneeFilter && (
              <FilterChip
                label={assigneeFilter === "__unassigned" ? "Unassigned" : getTeamMemberName(assigneeFilter)}
                onRemove={() => setAssigneeFilter("")}
              />
            )}
            {search && (
              <FilterChip
                label={`"${search}"`}
                onRemove={() => { setSearch(""); setSearchInput(""); }}
              />
            )}
            <button
              onClick={() => {
                setQuickFilter("all");
                setStatusFilter("ALL");
                setAssigneeFilter("");
                setSearch("");
                setSearchInput("");
              }}
              className="text-xs text-red-500 hover:text-red-700 cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-gray-400 mb-3">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          {sortBy === "wedding-soon" && " · sorted by closest wedding"}
        </p>

        {/* Orders list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search ? "No orders match your search." : "No orders match filters."}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-3 py-2 font-medium">Order #</th>
                    <th className="px-3 py-2 font-medium">Customer</th>
                    <th className="px-3 py-2 font-medium">Veil</th>
                    <th className="px-3 py-2 font-medium">Wedding</th>
                    <th className="px-3 py-2 font-medium">Received</th>
                    <th className="px-3 py-2 font-medium">Assigned</th>
                    <th className="px-3 py-2 font-medium">Price</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const isNew = o.status === "NEW";
                    const statusConf = getOrderStatusConfig(o.status);
                    const days = daysUntilWedding(o.weddingDate);
                    const urgency = weddingUrgencyLabel(days);
                    return (
                      <tr
                        key={o.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          isNew ? "bg-blue-50/50" : ""
                        } ${days !== null && days >= 0 && days <= 7 && !DONE_STATUSES.has(o.status) ? "bg-red-50/40" : ""}`}
                      >
                        <td className="px-3 py-3">
                          <Link href={`/admin/orders/${o.id}`} className="font-semibold text-gray-900 hover:underline">
                            {o.orderNumber}
                            {isNew && !o.firstOpenedAt && (
                              <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </Link>
                        </td>
                        <td className="px-3 py-3">
                          <Link href={`/admin/orders/${o.id}`}>
                            <div className="font-medium text-gray-900">{o.customerName}</div>
                            <div className="text-xs text-gray-400">+91 {o.whatsappNumber}</div>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs">
                          <div>{o.veilColour}</div>
                          <div className="text-gray-400 capitalize">{o.veilShape}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-xs text-gray-600">{o.weddingDate}</div>
                          {urgency && !DONE_STATUSES.has(o.status) && (
                            <div className={`text-[10px] ${urgency.color}`}>{urgency.text}</div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs">{relativeTime(o.submittedAt)}</td>
                        <td className="px-3 py-3 text-gray-500 text-xs">{getTeamMemberName(o.assignedTo) || "—"}</td>
                        <td className="px-3 py-3 text-xs font-medium text-gray-700">
                          {o.finalisedPrice ? `₹${o.finalisedPrice.toLocaleString("en-IN")}` : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.color}`}>
                            {statusConf.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((o) => {
                const isNew = o.status === "NEW";
                const statusConf = getOrderStatusConfig(o.status);
                const days = daysUntilWedding(o.weddingDate);
                const urgency = weddingUrgencyLabel(days);
                const isUrgent = days !== null && days >= 0 && days <= 7 && !DONE_STATUSES.has(o.status);
                return (
                  <Link
                    key={o.id}
                    href={`/admin/orders/${o.id}`}
                    className={`block bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow ${
                      isUrgent
                        ? "border-red-300 bg-red-50/30"
                        : isNew && !o.firstOpenedAt
                        ? "border-blue-300 bg-blue-50/30"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{o.orderNumber}</span>
                        {isNew && !o.firstOpenedAt && (
                          <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{o.customerName}</div>
                    <div className="text-xs text-gray-400 mb-2">+91 {o.whatsappNumber}</div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{o.veilColour} · {o.veilShape}</span>
                      <span className="font-medium text-gray-700">
                        {o.finalisedPrice ? `₹${o.finalisedPrice.toLocaleString("en-IN")}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="text-xs text-gray-400">
                        🗓 {o.weddingDate}
                        {urgency && !DONE_STATUSES.has(o.status) && (
                          <span className={`ml-2 ${urgency.color}`}>{urgency.text}</span>
                        )}
                      </div>
                      {o.assignedTo && (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {getTeamMemberName(o.assignedTo)}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ─── Sub-components ─── */

function SummaryCard({
  label,
  count,
  color,
  highlight,
}: {
  label: string;
  count: number;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 md:p-4 bg-white border ${
        highlight ? "border-blue-300 ring-1 ring-blue-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full">
      {label}
      <button onClick={onRemove} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
    </span>
  );
}
