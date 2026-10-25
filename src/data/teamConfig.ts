/**
 * Team members who can be assigned to enquiries/orders.
 */
export const teamMembers = [
  { id: "owner", name: "Brother / Owner" },
  { id: "sales-1", name: "Salesperson 1" },
  { id: "sales-2", name: "Salesperson 2" },
];

export const enquiryStatuses = [
  { id: "NEW", label: "New", color: "bg-blue-100 text-blue-800" },
  { id: "CONTACTED", label: "Contacted", color: "bg-amber-100 text-amber-800" },
  { id: "IN_DISCUSSION", label: "In Discussion", color: "bg-purple-100 text-purple-800" },
  { id: "PAYMENT_PENDING", label: "Payment Pending", color: "bg-orange-100 text-orange-800" },
  { id: "ORDERED", label: "Ordered", color: "bg-green-100 text-green-800" },
  { id: "CLOSED", label: "Closed", color: "bg-gray-100 text-gray-600" },
];

export const orderStatuses = [
  { id: "NEW", label: "New Enquiry", color: "bg-blue-100 text-blue-800" },
  { id: "FINALISED", label: "Finalised", color: "bg-indigo-100 text-indigo-800" },
  { id: "PAYMENT_DONE", label: "Payment Done", color: "bg-emerald-100 text-emerald-800" },
  { id: "DYEING", label: "Dyeing", color: "bg-pink-100 text-pink-800" },
  { id: "STITCHING", label: "Stitching", color: "bg-amber-100 text-amber-800" },
  { id: "CUSTOMISATION", label: "Customisation", color: "bg-violet-100 text-violet-800" },
  { id: "PACKED", label: "Packed", color: "bg-cyan-100 text-cyan-800" },
  { id: "SHIPPED", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { id: "DELIVERED", label: "Delivered", color: "bg-green-100 text-green-800" },
  { id: "CLOSED", label: "Closed", color: "bg-gray-100 text-gray-600" },
];

export function getStatusConfig(statusId: string) {
  return enquiryStatuses.find((s) => s.id === statusId) ?? enquiryStatuses[0];
}

export function getOrderStatusConfig(statusId: string) {
  return orderStatuses.find((s) => s.id === statusId) ?? orderStatuses[0];
}

export function getTeamMemberName(memberId: string | null | undefined): string {
  if (!memberId) return "";
  return teamMembers.find((m) => m.id === memberId)?.name ?? memberId;
}
