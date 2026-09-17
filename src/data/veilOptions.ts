export interface PatternOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
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
  { id: "zardozi", name: "Zardozi Embroidery", description: "Heavy metallic threadwork with gold/silver motifs", emoji: "✨" },
  { id: "gota-patti", name: "Gota Patti", description: "Rajasthani appliqué with gold ribbon cutwork", emoji: "🌟" },
  { id: "chikankari", name: "Chikankari", description: "Delicate Lucknowi white-on-white embroidery", emoji: "🤍" },
  { id: "mirror-work", name: "Mirror Work (Shisha)", description: "Tiny mirrors stitched into fabric for sparkle", emoji: "🪩" },
  { id: "sequin-scatter", name: "Sequin Scatter", description: "Scattered sequins for a subtle shimmer effect", emoji: "💫" },
  { id: "thread-jaal", name: "Thread Jaal", description: "All-over net pattern in intricate threadwork", emoji: "🕸️" },
  { id: "paisley", name: "Paisley (Ambi/Keri)", description: "Classic Indian paisley motifs across the veil", emoji: "🍃" },
  { id: "floral-motif", name: "Floral Motif", description: "Elegant flower patterns in thread & beadwork", emoji: "🌸" },
  { id: "mughal-jali", name: "Mughal Jali", description: "Geometric lattice inspired by Mughal architecture", emoji: "🏛️" },
  { id: "bandhani", name: "Bandhani (Tie-Dye)", description: "Traditional Rajasthani tie-dye dot patterns", emoji: "🔴" },
  { id: "aari-work", name: "Aari Work", description: "Chain stitch embroidery with fine needle detailing", emoji: "🧵" },
  { id: "kundan-stone", name: "Kundan Stone Work", description: "Stone-encrusted patterns for a royal look", emoji: "💎" },
  { id: "pearl-beaded", name: "Pearl Beaded", description: "Delicate pearl beading across the veil", emoji: "🫧" },
  { id: "resham-thread", name: "Resham Thread Work", description: "Colourful silk thread embroidery patterns", emoji: "🎨" },
  { id: "cutdana-bugle", name: "Cutdana & Bugle Beads", description: "Glass bead embellishment for a sparkling finish", emoji: "🌙" },
];

export const colors: ColorOption[] = [
  { id: "bridal-red", name: "Classic Bridal Red", hex: "#C41E3A", textColor: "#FFFFFF" },
  { id: "deep-maroon", name: "Deep Maroon", hex: "#800020", textColor: "#FFFFFF" },
  { id: "rani-pink", name: "Rani Pink", hex: "#E4007C", textColor: "#FFFFFF" },
  { id: "rose-pink", name: "Rose Pink", hex: "#E8879E", textColor: "#FFFFFF" },
  { id: "blush-pink", name: "Blush Pink", hex: "#F4C2C2", textColor: "#333333" },
];

export const laces: LaceOption[] = [
  { id: "gota-kinari-gold", name: "Gota Kinari (Gold)", description: "Continuous golden metallic ribbon border", emoji: "🥇" },
  { id: "gota-kinari-silver", name: "Gota Kinari (Silver)", description: "Silver metallic ribbon edging", emoji: "🥈" },
  { id: "zardozi-border", name: "Zardozi Border", description: "Heavy metallic embroidered border", emoji: "👑" },
  { id: "pearl-scalloped", name: "Pearl Scalloped Edge", description: "Scalloped border with pearl accents", emoji: "🫧" },
  { id: "sequin-scalloped", name: "Sequin Scalloped Lace", description: "Shimmering sequin scalloped trim", emoji: "✨" },
  { id: "mirror-border", name: "Mirror Work Border", description: "Tiny mirror-embellished edging", emoji: "🪩" },
  { id: "crochet-lace", name: "Crochet Lace", description: "Delicate hand-crocheted lace trim", emoji: "🧶" },
  { id: "velvet-trim", name: "Velvet Trim", description: "Rich velvet border for luxurious feel", emoji: "🎀" },
  { id: "beaded-fringe", name: "Beaded Fringe", description: "Dangling bead fringe for movement", emoji: "🔔" },
  { id: "zari-lace", name: "Zari Lace", description: "Fine metallic thread woven lace", emoji: "🌟" },
  { id: "dabka-border", name: "Dabka Border", description: "Coiled metallic wire embroidery border", emoji: "🌀" },
  { id: "thread-tassels", name: "Thread Tassels", description: "Colourful hanging tassel fringe", emoji: "🎊" },
  { id: "crystal-edge", name: "Crystal Edge", description: "Crystal-studded border for sparkle", emoji: "💎" },
  { id: "floral-embroidered", name: "Floral Embroidered Lace", description: "Floral pattern embroidered on lace", emoji: "🌺" },
  { id: "cutwork-border", name: "Cutwork Border", description: "Intricate cut-out patterned edging", emoji: "✂️" },
];

export const lengths: LengthOption[] = [
  { id: "60", label: "60 inches (5 ft)", inches: 60, description: "Waist length – Perfect for minimal, modern look" },
  { id: "72", label: "72 inches (6 ft)", inches: 72, description: "Hip length – Classic & elegant coverage" },
  { id: "84", label: "84 inches (7 ft)", inches: 84, description: "Knee length – Traditional bridal drape" },
  { id: "96", label: "96 inches (8 ft)", inches: 96, description: "Calf length – Grand & graceful" },
  { id: "108", label: "108 inches (9 ft)", inches: 108, description: "Ankle length – Dramatic & royal" },
  { id: "120", label: "120 inches (10 ft)", inches: 120, description: "Floor sweep – Cathedral-style statement" },
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
  name: string;
  phone: string;
  address: string;
  email?: string;
}
