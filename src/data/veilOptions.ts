export interface PatternOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  thumbnail: string;
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

// ── 10 Embroidery Patterns ──
export const patterns: PatternOption[] = [
  {
    id: "zardozi",
    name: "Zardozi",
    description: "Heavy gold metallic threadwork all over",
    emoji: "✨",
    thumbnail: "/thumbnails/zardozi.jpg",
  },
  {
    id: "gota-patti",
    name: "Gota Patti",
    description: "Rajasthani gold ribbon appliqué all over",
    emoji: "🌟",
    thumbnail: "/thumbnails/gota-patti.jpg",
  },
  {
    id: "mirror-work",
    name: "Mirror Work",
    description: "Shisha mirrors stitched for sparkle",
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
  {
    id: "zardozi-gota-patti",
    name: "Zardozi + Gota Patti",
    description: "Gold threadwork with ribbon appliqué",
    emoji: "👑",
    thumbnail: "/thumbnails/zardozi.jpg",
  },
  {
    id: "zardozi-mirror-work",
    name: "Zardozi + Mirror",
    description: "Gold threadwork with mirror accents",
    emoji: "✨",
    thumbnail: "/thumbnails/zardozi.jpg",
  },
  {
    id: "gota-patti-mirror-work",
    name: "Gota Patti + Mirror",
    description: "Ribbon appliqué with mirror sparkle",
    emoji: "🌟",
    thumbnail: "/thumbnails/gota-patti.jpg",
  },
  {
    id: "sequin-gota-patti",
    name: "Sequin + Gota Patti",
    description: "Sequin shimmer with ribbon appliqué",
    emoji: "💫",
    thumbnail: "/thumbnails/gota-patti.jpg",
  },
  {
    id: "zardozi-sequin",
    name: "Zardozi + Sequin",
    description: "Gold threadwork with sequin shimmer",
    emoji: "✨",
    thumbnail: "/thumbnails/sequin-scatter.jpg",
  },
  {
    id: "mirror-sequin",
    name: "Mirror + Sequin",
    description: "Mirror sparkle with sequin shimmer",
    emoji: "🪩",
    thumbnail: "/thumbnails/mirror-work.jpg",
  },
];

// ── 3 Colours ──
export const colors: ColorOption[] = [
  { id: "red", name: "Red", hex: "#C41E3A", textColor: "#FFFFFF" },
  { id: "mehroon", name: "Mehroon", hex: "#800020", textColor: "#FFFFFF" },
  { id: "rani-pink", name: "Rani Pink", hex: "#E4007C", textColor: "#FFFFFF" },
];

// ── 5 Borders ──
export const laces: LaceOption[] = [
  { id: "gota-kinari-gold", name: "Gota Kinari (Gold)", description: "Golden metallic ribbon border", emoji: "🥇", thumbnail: "/thumbnails/gota-kinari-gold.jpg" },
  { id: "gota-kinari-silver", name: "Gota Kinari (Silver)", description: "Silver metallic ribbon border", emoji: "🥈", thumbnail: "/thumbnails/gota-kinari-silver.jpg" },
  { id: "zardozi-border", name: "Zardozi Border", description: "Heavy metallic embroidered border", emoji: "👑", thumbnail: "/thumbnails/zardozi-border.jpg" },
  { id: "pearl-scalloped", name: "Pearl Scalloped", description: "Scalloped border with pearl accents", emoji: "🫧", thumbnail: "/thumbnails/pearl-scalloped.jpg" },
  { id: "sequin-scalloped", name: "Sequin Scalloped", description: "Shimmering sequin scalloped trim", emoji: "✨", thumbnail: "/thumbnails/sequin-scalloped.jpg" },
];

// ── 2 Lengths ──
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

// ── Pattern preview images: pattern × color → URL (10 × 3 = 30) ──
const BASE = "https://raw.githubusercontent.com/Shanugoyanka/goyanka_threads/master/images";

export const patternImages: Record<string, string> = {
  // Zardozi
  "zardozi-red": `${BASE}/01_zardosi_all_over_red.jpg`,
  "zardozi-mehroon": `${BASE}/01_zardosi_all_over_mehroon.jpg`,
  "zardozi-rani-pink": `${BASE}/01_zardosi_all_over_rani_pink.jpg`,
  // Gota Patti
  "gota-patti-red": `${BASE}/02_gota_patti_all_over_red.jpg`,
  "gota-patti-mehroon": `${BASE}/02_gota_patti_all_over_mehroon.jpg`,
  "gota-patti-rani-pink": `${BASE}/02_gota_patti_all_over_rani_pink.jpg`,
  // Mirror Work
  "mirror-work-red": `${BASE}/03_mirror_work_shisha_red.jpg`,
  "mirror-work-mehroon": `${BASE}/03_mirror_work_shisha_mehroon.jpg`,
  "mirror-work-rani-pink": `${BASE}/03_mirror_work_shisha_rani_pink.jpg`,
  // Sequin Scatter
  "sequin-scatter-red": `${BASE}/04_sequin_scatter_red.jpg`,
  "sequin-scatter-mehroon": `${BASE}/04_sequin_scatter_mehroon.jpg`,
  "sequin-scatter-rani-pink": `${BASE}/04_sequin_scatter_rani_pink.jpg`,
  // Zardozi + Gota Patti
  "zardozi-gota-patti-red": `${BASE}/05_zardosi_gota_patti_red.jpg`,
  "zardozi-gota-patti-mehroon": `${BASE}/05_zardosi_gota_patti_mehroon.jpg`,
  "zardozi-gota-patti-rani-pink": `${BASE}/05_zardosi_gota_patti_rani_pink.jpg`,
  // Zardozi + Mirror Work
  "zardozi-mirror-work-red": `${BASE}/06_zardosi_mirror_work_red.jpg`,
  "zardozi-mirror-work-mehroon": `${BASE}/06_zardosi_mirror_work_mehroon.jpg`,
  "zardozi-mirror-work-rani-pink": `${BASE}/06_zardosi_mirror_work_rani_pink.jpg`,
  // Gota Patti + Mirror Work
  "gota-patti-mirror-work-red": `${BASE}/07_gota_patti_mirror_work_red.jpg`,
  "gota-patti-mirror-work-mehroon": `${BASE}/07_gota_patti_mirror_work_mehroon.jpg`,
  "gota-patti-mirror-work-rani-pink": `${BASE}/07_gota_patti_mirror_work_rani_pink.jpg`,
  // Sequin + Gota Patti
  "sequin-gota-patti-red": `${BASE}/08_sequin_gota_patti_red.jpg`,
  "sequin-gota-patti-mehroon": `${BASE}/08_sequin_gota_patti_mehroon.jpg`,
  "sequin-gota-patti-rani-pink": `${BASE}/08_sequin_gota_patti_rani_pink.jpg`,
  // Zardozi + Sequin
  "zardozi-sequin-red": `${BASE}/09_zardosi_sequin_red.jpg`,
  "zardozi-sequin-mehroon": `${BASE}/09_zardosi_sequin_mehroon.jpg`,
  "zardozi-sequin-rani-pink": `${BASE}/09_zardosi_sequin_rani_pink.jpg`,
  // Mirror + Sequin
  "mirror-sequin-red": `${BASE}/10_mirror_sequin_red.jpg`,
  "mirror-sequin-mehroon": `${BASE}/10_mirror_sequin_mehroon.jpg`,
  "mirror-sequin-rani-pink": `${BASE}/10_mirror_sequin_rani_pink.jpg`,
};

// ── Border preview images: border × color → URL (5 × 3 = 15) ──
export const borderImages: Record<string, string> = {
  "gota-kinari-gold-red": `${BASE}/11_gota_kinari_gold_border_red.jpg`,
  "gota-kinari-gold-mehroon": `${BASE}/11_gota_kinari_gold_border_mehroon.jpg`,
  "gota-kinari-gold-rani-pink": `${BASE}/11_gota_kinari_gold_border_rani_pink.jpg`,
  "gota-kinari-silver-red": `${BASE}/12_gota_kinari_silver_border_red.jpg`,
  "gota-kinari-silver-mehroon": `${BASE}/12_gota_kinari_silver_border_mehroon.jpg`,
  "gota-kinari-silver-rani-pink": `${BASE}/12_gota_kinari_silver_border_rani_pink.jpg`,
  "zardozi-border-red": `${BASE}/13_zardosi_border_red.jpg`,
  "zardozi-border-mehroon": `${BASE}/13_zardosi_border_mehroon.jpg`,
  "zardozi-border-rani-pink": `${BASE}/13_zardosi_border_rani_pink.jpg`,
  "pearl-scalloped-red": `${BASE}/14_pearl_scalloped_border_red.jpg`,
  "pearl-scalloped-mehroon": `${BASE}/14_pearl_scalloped_border_mehroon.jpg`,
  "pearl-scalloped-rani-pink": `${BASE}/14_pearl_scalloped_border_rani_pink.jpg`,
  "sequin-scalloped-red": `${BASE}/15_sequin_scalloped_border_red.jpg`,
  "sequin-scalloped-mehroon": `${BASE}/15_sequin_scalloped_border_mehroon.jpg`,
  "sequin-scalloped-rani-pink": `${BASE}/15_sequin_scalloped_border_rani_pink.jpg`,
};

export function getPatternImageUrl(patternId: string, colorId: string): string {
  return patternImages[`${patternId}-${colorId}`] || "";
}

export function getBorderImageUrl(borderId: string, colorId: string): string {
  return borderImages[`${borderId}-${colorId}`] || "";
}
