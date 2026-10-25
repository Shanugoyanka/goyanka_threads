"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { orderStatuses, getOrderStatusConfig, getTeamMemberName } from "@/data/teamConfig";

interface OrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  whatsappNumber: string;
  veilColour: string;
  veilShape: string;
  customisation: string;
  weddingDate: string;
  dispatchDate: string;
  status: string;
  assignedTo: string | null;
  submittedAt: string;
  firstOpenedAt: string | null;
}

const FILTER_TABS = [
  { id: "ALL", label: "All" },
  ...orderStatuses,
];

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [filter, setFilter] = useState("ALL");
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

  // Client-side filter and search
  const filtered = orders.filter((o) => {
    if (filter !== "ALL" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.whatsappNumber.includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.veilColour.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Status counts from all orders (not just filtered)
  const statusCounts: Record<string, number> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  const totalNew = statusCounts["NEW"] ?? 0;
  const totalProduction = statusCounts["IN_PRODUCTION"] ?? 0;
  const totalDispatched = statusCounts["DISPATCHED"] ?? 0;
  const totalDelivered = statusCounts["DELIVERED"] ?? 0;

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <SummaryCard label="New" count={totalNew} color="bg-blue-500" highlight />
          <SummaryCard label="In Production" count={totalProduction} color="bg-amber-500" />
          <SummaryCard label="Dispatched" count={totalDispatched} color="bg-purple-500" />
          <SummaryCard label="Delivered" count={totalDelivered} color="bg-green-500" />
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, phone, order #, or colour..."
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
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                }}
                className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.id === "ALL"
                ? orders.length
                : statusCounts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer transition-colors ${
                  filter === tab.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {tab.label} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search ? "No orders match your search." : "No orders yet."}
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
                    <th className="px-3 py-2 font-medium">Dispatch</th>
                    <th className="px-3 py-2 font-medium">Received</th>
                    <th className="px-3 py-2 font-medium">Assigned</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const isNew = o.status === "NEW";
                    const statusConf = getOrderStatusConfig(o.status);
                    return (
                      <tr
                        key={o.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          isNew ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <td className="px-3 py-3">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="font-semibold text-gray-900 hover:underline"
                          >
                            {o.orderNumber}
                            {isNew && !o.firstOpenedAt && (
                              <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </Link>
                        </td>
                        <td className="px-3 py-3">
                          <Link href={`/admin/orders/${o.id}`}>
                            <div className="font-medium text-gray-900">
                              {o.customerName}
                            </div>
                            <div className="text-xs text-gray-400">
                              +91 {o.whatsappNumber}
                            </div>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs">
                          <div>{o.veilColour}</div>
                          <div className="text-gray-400 capitalize">
                            {o.veilShape}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs">
                          {o.weddingDate}
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs">
                          {o.dispatchDate}
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs">
                          {relativeTime(o.submittedAt)}
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs">
                          {getTeamMemberName(o.assignedTo) || "—"}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.color}`}
                          >
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
                return (
                  <Link
                    key={o.id}
                    href={`/admin/orders/${o.id}`}
                    className={`block bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow ${
                      isNew && !o.firstOpenedAt
                        ? "border-blue-300 bg-blue-50/30"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">
                          {o.orderNumber}
                        </span>
                        {isNew && !o.firstOpenedAt && (
                          <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.color}`}
                      >
                        {statusConf.label}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {o.customerName}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      +91 {o.whatsappNumber}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {o.veilColour} • {o.veilShape}
                      </span>
                      <span>{relativeTime(o.submittedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                      <span>Wedding: {o.weddingDate}</span>
                      <span>Dispatch: {o.dispatchDate}</span>
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
      className={`rounded-xl p-4 bg-white border ${
        highlight && count > 0
          ? "border-blue-300 ring-1 ring-blue-200"
          : "border-gray-200"
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
