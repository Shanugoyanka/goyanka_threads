export interface PatternOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  thumbnail: string; // CDN URL for pattern thumbnail
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  textColor: string;
}

export interface LaceOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  thumbnail: string;
}

export interface LengthOption {
  id: string;
  label: string;
  inches: number;
  description: string;
}

export const patterns: PatternOption[] = [
  {
    id: "zardozi",
    name: "Zardozi",
    description: "Heavy gold metallic threadwork motifs",
    emoji: "✨",
    thumbnail: "/thumbnails/zardozi.jpg",
  },
  {
    id: "gota-patti",
    name: "Gota Patti",
    description: "Rajasthani gold ribbon appliqué cutwork",
    emoji: "🌟",
    thumbnail: "/thumbnails/gota-patti.jpg",
  },
  {
    id: "mirror-work",
    name: "Mirror Work",
    description: "Tiny mirrors stitched for sparkle",
    emoji: "🪩",
    thumbnail: "/thumbnails/mirror-work.jpg",
  },
  {
    id: "sequin-scatter",
    name: "Sequin Scatter",
    description: "Scattered sequins for subtle shimmer",
    emoji: "💫",
    thumbnail: "/thumbnails/sequin-scatter.jpg",
  },
];

export const colors: ColorOption[] = [
  { id: "red", name: "Red", hex: "#C41E3A", textColor: "#FFFFFF" },
  { id: "mehroon", name: "Mehroon", hex: "#800020", textColor: "#FFFFFF" },
  { id: "rani-pink", name: "Rani Pink", hex: "#E4007C", textColor: "#FFFFFF" },
];

export const laces: LaceOption[] = [
  { id: "gota-kinari-gold", name: "Gota Kinari (Gold)", description: "Golden metallic ribbon border", emoji: "🥇", thumbnail: "/thumbnails/gota-kinari-gold.jpg" },
  { id: "gota-kinari-silver", name: "Gota Kinari (Silver)", description: "Silver metallic ribbon border", emoji: "🥈", thumbnail: "/thumbnails/gota-kinari-silver.jpg" },
  { id: "zardozi-border", name: "Zardozi Border", description: "Heavy metallic embroidered border", emoji: "👑", thumbnail: "/thumbnails/zardozi-border.jpg" },
  { id: "pearl-scalloped", name: "Pearl Scalloped", description: "Scalloped border with pearl accents", emoji: "🫧", thumbnail: "/thumbnails/pearl-scalloped.jpg" },
  { id: "sequin-scalloped", name: "Sequin Scalloped", description: "Shimmering sequin scalloped trim", emoji: "✨", thumbnail: "/thumbnails/sequin-scalloped.jpg" },
];

export const lengths: LengthOption[] = [
  { id: "84", label: "7 ft (84\")", inches: 84, description: "Traditional bridal drape" },
  { id: "120", label: "10 ft (120\")", inches: 120, description: "Cathedral-style statement" },
];

export interface VeilOrder {
  pattern: string;
  color: string;
  lace: string;
  length: string;
  customText: string;
  customType: "initials" | "name" | "date" | "custom" | "none";
}

export interface CustomerInfo {
  address: string;
}

// Image lookup: pattern-color-border → CDN URL
// Replace these with your actual CDN URLs
// 4 patterns × 3 colors × 5 borders = 60 images
// Key format: {pattern}-{color}-{border}
// Paste your CDN URLs below
export const previewImages: Record<string, string> = {
  // ── Zardozi ──
  "zardozi-red-gota-kinari-gold": "",
  "zardozi-red-gota-kinari-silver": "",
  "zardozi-red-zardozi-border": "",
  "zardozi-red-pearl-scalloped": "",
  "zardozi-red-sequin-scalloped": "",
  "zardozi-mehroon-gota-kinari-gold": "",
  "zardozi-mehroon-gota-kinari-silver": "",
  "zardozi-mehroon-zardozi-border": "",
  "zardozi-mehroon-pearl-scalloped": "",
  "zardozi-mehroon-sequin-scalloped": "",
  "zardozi-rani-pink-gota-kinari-gold": "",
  "zardozi-rani-pink-gota-kinari-silver": "",
  "zardozi-rani-pink-zardozi-border": "",
  "zardozi-rani-pink-pearl-scalloped": "",
  "zardozi-rani-pink-sequin-scalloped": "",
  // ── Gota Patti ──
  "gota-patti-red-gota-kinari-gold": "",
  "gota-patti-red-gota-kinari-silver": "",
  "gota-patti-red-zardozi-border": "",
  "gota-patti-red-pearl-scalloped": "",
  "gota-patti-red-sequin-scalloped": "",
  "gota-patti-mehroon-gota-kinari-gold": "",
  "gota-patti-mehroon-gota-kinari-silver": "",
  "gota-patti-mehroon-zardozi-border": "",
  "gota-patti-mehroon-pearl-scalloped": "",
  "gota-patti-mehroon-sequin-scalloped": "",
  "gota-patti-rani-pink-gota-kinari-gold": "",
  "gota-patti-rani-pink-gota-kinari-silver": "",
  "gota-patti-rani-pink-zardozi-border": "",
  "gota-patti-rani-pink-pearl-scalloped": "",
  "gota-patti-rani-pink-sequin-scalloped": "",
  // ── Mirror Work ──
  "mirror-work-red-gota-kinari-gold": "",
  "mirror-work-red-gota-kinari-silver": "",
  "mirror-work-red-zardozi-border": "",
  "mirror-work-red-pearl-scalloped": "",
  "mirror-work-red-sequin-scalloped": "",
  "mirror-work-mehroon-gota-kinari-gold": "",
  "mirror-work-mehroon-gota-kinari-silver": "",
  "mirror-work-mehroon-zardozi-border": "",
  "mirror-work-mehroon-pearl-scalloped": "",
  "mirror-work-mehroon-sequin-scalloped": "",
  "mirror-work-rani-pink-gota-kinari-gold": "",
  "mirror-work-rani-pink-gota-kinari-silver": "",
  "mirror-work-rani-pink-zardozi-border": "",
  "mirror-work-rani-pink-pearl-scalloped": "",
  "mirror-work-rani-pink-sequin-scalloped": "",
  // ── Sequin Scatter ──
  "sequin-scatter-red-gota-kinari-gold": "",
  "sequin-scatter-red-gota-kinari-silver": "",
  "sequin-scatter-red-zardozi-border": "",
  "sequin-scatter-red-pearl-scalloped": "",
  "sequin-scatter-red-sequin-scalloped": "",
  "sequin-scatter-mehroon-gota-kinari-gold": "",
  "sequin-scatter-mehroon-gota-kinari-silver": "",
  "sequin-scatter-mehroon-zardozi-border": "",
  "sequin-scatter-mehroon-pearl-scalloped": "",
  "sequin-scatter-mehroon-sequin-scalloped": "",
  "sequin-scatter-rani-pink-gota-kinari-gold": "",
  "sequin-scatter-rani-pink-gota-kinari-silver": "",
  "sequin-scatter-rani-pink-zardozi-border": "",
  "sequin-scatter-rani-pink-pearl-scalloped": "",
  "sequin-scatter-rani-pink-sequin-scalloped": "",
};

export function getPreviewImageKey(patternId: string, colorId: string, laceId: string): string {
  return `${patternId}-${colorId}-${laceId}`;
}

export function getPreviewImageUrl(patternId: string, colorId: string, laceId: string): string {
  const key = getPreviewImageKey(patternId, colorId, laceId);
  return previewImages[key] || "";
}
