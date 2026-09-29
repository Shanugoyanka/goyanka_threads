export interface PreferenceAnswers {
  weddingDate: string;
  city: string;
  pincode: string;
  outfitColour: string;
  preferredStyle: string;
  budgetRange: string;
}

export const styleOptions = [
  {
    id: "minimal",
    label: "Minimal & Elegant",
    description: "Subtle shimmer, lightweight, understated beauty",
    emoji: "✨",
  },
  {
    id: "heavy",
    label: "Heavy & Statement",
    description: "Bold embroidery, rich detailing, show-stopping",
    emoji: "👑",
  },
  {
    id: "personalized",
    label: "Personalized",
    description: "Custom text, unique combinations, your own style",
    emoji: "💌",
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    description: "Show me everything — I'll decide as I browse",
    emoji: "🤔",
  },
];

export const colourOptions = [
  { id: "red", name: "Red", hex: "#C41E3A" },
  { id: "mehroon", name: "Mehroon", hex: "#800020" },
  { id: "rani-pink", name: "Rani Pink", hex: "#E4007C" },
  { id: "other", name: "Other / Not decided", hex: "#9CA3AF" },
];

export const budgetOptions = [
  { id: "under-7000", label: "Under ₹7,000", min: 0, max: 7000 },
  { id: "7000-10000", label: "₹7,000 – ₹10,000", min: 7000, max: 10000 },
  { id: "10000-15000", label: "₹10,000 – ₹15,000", min: 10000, max: 15000 },
  { id: "above-15000", label: "Above ₹15,000", min: 15000, max: 50000 },
  { id: "flexible", label: "Flexible / Not decided", min: 0, max: 50000 },
];

export function getBudgetRange(budgetId: string) {
  return budgetOptions.find((b) => b.id === budgetId) ?? budgetOptions[4];
}
