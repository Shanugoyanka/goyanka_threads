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
  { id: "NEW", label: "New Order", color: "bg-blue-100 text-blue-800" },
  { id: "IN_PRODUCTION", label: "In Production", color: "bg-amber-100 text-amber-800" },
  { id: "DISPATCHED", label: "Dispatched", color: "bg-purple-100 text-purple-800" },
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
