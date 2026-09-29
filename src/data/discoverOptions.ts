export interface PreferenceAnswers {
  weddingDate: string;
  weddingDateNotFixed: boolean;
  outfitColour: string;
  customOutfitColour: string;
  preferredStyle: string;
  budgetRange: string;
  personalization: string;
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
  { id: "maroon", name: "Maroon", hex: "#800020" },
  { id: "pink", name: "Pink", hex: "#E4007C" },
  { id: "pastel", name: "Pastel", hex: "#F8D7DA" },
  { id: "ivory", name: "Ivory / White", hex: "#FFFFF0" },
  { id: "gold", name: "Gold", hex: "#C5A55A" },
  { id: "other", name: "Other", hex: "#9CA3AF" },
];

export const budgetOptions = [
  { id: "under-3000", label: "Under ₹3,000", min: 0, max: 3000 },
  { id: "3000-4000", label: "₹3,000 – ₹4,000", min: 3000, max: 4000 },
  { id: "4000-5000", label: "₹4,000 – ₹5,000", min: 4000, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5000, max: 15000 },
  { id: "flexible", label: "Help Me Choose", min: 0, max: 50000 },
];

export const personalizationOptions = [
  { id: "none", label: "No personalization", emoji: "✋" },
  { id: "names", label: "Bride / Groom names", emoji: "💑" },
  { id: "date", label: "Wedding date", emoji: "📅" },
  { id: "names-date", label: "Names + wedding date", emoji: "💍" },
  { id: "custom-text", label: "Custom text / mantra", emoji: "✍️" },
  { id: "not-sure", label: "Not sure yet", emoji: "🤔" },
];

export function getBudgetRange(budgetId: string) {
  return budgetOptions.find((b) => b.id === budgetId) ?? budgetOptions[4];
}
