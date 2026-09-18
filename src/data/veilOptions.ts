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
  { id: "bridal-red", name: "Bridal Red", hex: "#C41E3A", textColor: "#FFFFFF" },
  { id: "deep-maroon", name: "Deep Maroon", hex: "#800020", textColor: "#FFFFFF" },
];

export const laces: LaceOption[] = [
  { id: "gota-kinari-gold", name: "Gota Kinari (Gold)", description: "Golden metallic ribbon border", emoji: "🥇" },
  { id: "gota-kinari-silver", name: "Gota Kinari (Silver)", description: "Silver metallic ribbon border", emoji: "🥈" },
  { id: "zardozi-border", name: "Zardozi Border", description: "Heavy metallic embroidered border", emoji: "👑" },
  { id: "pearl-scalloped", name: "Pearl Scalloped", description: "Scalloped border with pearl accents", emoji: "🫧" },
  { id: "sequin-scalloped", name: "Sequin Scalloped", description: "Shimmering sequin scalloped trim", emoji: "✨" },
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
export const previewImages: Record<string, string> = {
  // Zardozi × Bridal Red
  "zardozi-bridal-red-gota-kinari-gold": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713412/306bd8bf-5621-4624-941b-2c4cfd676948.jpg",
  "zardozi-bridal-red-gota-kinari-silver": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713443/f798d51d7f224f9d84f1882afb79bae0.jpg",
  "zardozi-bridal-red-zardozi-border": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713450/eebfac9f93f345caafb83e02a0d7002d.jpg",
  "zardozi-bridal-red-pearl-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713456/5758d9101bd242718bee1ea661cf72c9.jpg",
  "zardozi-bridal-red-sequin-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713463/40cbac1ae0e541ed82b8ec7134459814.jpg",
  // Zardozi × Deep Maroon
  "zardozi-deep-maroon-gota-kinari-gold": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713470/300abf64141847adbb2d923050b9a0ce.jpg",
  "zardozi-deep-maroon-gota-kinari-silver": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713476/b90c341cb2764c689a190cb90fd474b1.jpg",
  "zardozi-deep-maroon-zardozi-border": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713483/8809b1abbf014618a60fdba85a96c77a.jpg",
  "zardozi-deep-maroon-pearl-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713490/fd2b79db267640f4af3711a74b6f1e4f.jpg",
  "zardozi-deep-maroon-sequin-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713496/d134f3ac6c334621becda6b0bdc942ec.jpg",
  // Gota Patti × Bridal Red
  "gota-patti-bridal-red-gota-kinari-gold": "https://res.cloudinary.com/fetch-ai/image/upload/v1789713503/4a39dbfde8e74c939bc2bedd2eb1ce3a.jpg",
  "gota-patti-bridal-red-gota-kinari-silver": "https://res.cloudinary.com/fetch-ai/image/upload/v1789714663/859fcf3914f6487cab33ae42fbd0df40.jpg",
  "gota-patti-bridal-red-zardozi-border": "https://res.cloudinary.com/fetch-ai/image/upload/v1789714670/682aad8038324ade8ad21b196a7a2ec9.jpg",
  "gota-patti-bridal-red-pearl-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789714676/a82a0e0e3426472391e96696ae8d446c.jpg",
  "gota-patti-bridal-red-sequin-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789714683/05d49c9416ab43369b613f675179e3fb.jpg",
  // Gota Patti × Deep Maroon
  "gota-patti-deep-maroon-gota-kinari-gold": "https://res.cloudinary.com/fetch-ai/image/upload/v1789715043/dc3cd6c6babc491ea4d517e9c505e6a0.jpg",
  "gota-patti-deep-maroon-gota-kinari-silver": "https://res.cloudinary.com/fetch-ai/image/upload/v1789715460/113bebb120f142c5ae2efe30c943fb5e.jpg",
  "gota-patti-deep-maroon-zardozi-border": "https://res.cloudinary.com/fetch-ai/image/upload/v1789715467/de0c0298f4c64dd5811c46e9e418ac2d.jpg",
  "gota-patti-deep-maroon-pearl-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789715473/a7f15e6bbc9540dcbe414290a5ab90f8.jpg",
  "gota-patti-deep-maroon-sequin-scalloped": "https://res.cloudinary.com/fetch-ai/image/upload/v1789715480/b436bdb7749745108714356c24aea350.jpg",
  // Mirror Work × Bridal Red
  "mirror-work-bridal-red-gota-kinari-gold": "",
  "mirror-work-bridal-red-gota-kinari-silver": "",
  "mirror-work-bridal-red-zardozi-border": "",
  "mirror-work-bridal-red-pearl-scalloped": "",
  "mirror-work-bridal-red-sequin-scalloped": "",
  // Mirror Work × Deep Maroon
  "mirror-work-deep-maroon-gota-kinari-gold": "",
  "mirror-work-deep-maroon-gota-kinari-silver": "",
  "mirror-work-deep-maroon-zardozi-border": "",
  "mirror-work-deep-maroon-pearl-scalloped": "",
  "mirror-work-deep-maroon-sequin-scalloped": "",
  // Sequin Scatter × Bridal Red
  "sequin-scatter-bridal-red-gota-kinari-gold": "",
  "sequin-scatter-bridal-red-gota-kinari-silver": "",
  "sequin-scatter-bridal-red-zardozi-border": "",
  "sequin-scatter-bridal-red-pearl-scalloped": "",
  "sequin-scatter-bridal-red-sequin-scalloped": "",
  // Sequin Scatter × Deep Maroon
  "sequin-scatter-deep-maroon-gota-kinari-gold": "",
  "sequin-scatter-deep-maroon-gota-kinari-silver": "",
  "sequin-scatter-deep-maroon-zardozi-border": "",
  "sequin-scatter-deep-maroon-pearl-scalloped": "",
  "sequin-scatter-deep-maroon-sequin-scalloped": "",
};

export function getPreviewImageKey(patternId: string, colorId: string, laceId: string): string {
  return `${patternId}-${colorId}-${laceId}`;
}

export function getPreviewImageUrl(patternId: string, colorId: string, laceId: string): string {
  const key = getPreviewImageKey(patternId, colorId, laceId);
  return previewImages[key] || "";
}
