export interface OptionWithImage {
  id: string;
  label: string;
  image?: string; // path to image in /public/order/ — replace placeholders later
}

// ── Colours ──
export const veilColourOptions: { id: string; label: string; swatch: string }[] = [
  { id: "white", label: "White", swatch: "#FFFFFF" },
  { id: "ivory", label: "Ivory", swatch: "#FFFFF0" },
  { id: "off-white", label: "Off-white", swatch: "#FAF9F6" },
  { id: "blush", label: "Blush", swatch: "#F8C8C8" },
  { id: "champagne", label: "Champagne", swatch: "#F7E7CE" },
  { id: "nude", label: "Nude", swatch: "#E8BEAC" },
  { id: "red", label: "Red", swatch: "#C41E3A" },
  { id: "maroon", label: "Maroon", swatch: "#800000" },
];

// ── Lengths ──
export const veilLengthOptions: OptionWithImage[] = [
  { id: "shoulder", label: "Shoulder" },
  { id: "elbow", label: "Elbow" },
  { id: "fingertip", label: "Fingertip" },
  { id: "chapel", label: "Chapel" },
  { id: "cathedral", label: "Cathedral" },
];

// ── Shapes (will have real images) ──
export const veilShapeOptions: OptionWithImage[] = [
  { id: "round", label: "Round", image: "/order/shape-round.jpg" },
  { id: "scalloped", label: "Scalloped", image: "/order/shape-scalloped.jpg" },
  { id: "straight", label: "Straight", image: "/order/shape-straight.jpg" },
  { id: "other", label: "Other" },
];

// ── Blusher (will have real images) ──
export const blusherOptions: OptionWithImage[] = [
  { id: "detachable", label: "Detachable", image: "/order/blusher-detachable.jpg" },
  { id: "attached", label: "Attached", image: "/order/blusher-attached.jpg" },
  { id: "none", label: "No Blusher" },
];

// ── Stone Placement (will have real images) ──
export const stonePlacementOptions: OptionWithImage[] = [
  { id: "throughout", label: "Throughout", image: "/order/stone-throughout.jpg" },
  { id: "border-only", label: "Border Only", image: "/order/stone-border.jpg" },
  { id: "heavy-crown", label: "Heavy Crown", image: "/order/stone-crown.jpg" },
  { id: "scattered", label: "Scattered", image: "/order/stone-scattered.jpg" },
  { id: "other", label: "Other" },
];

// ── Stone Density ──
export const stoneDensityOptions: OptionWithImage[] = [
  { id: "100", label: "100 stones" },
  { id: "200", label: "200 stones" },
  { id: "200+", label: "200+ stones" },
  { id: "other", label: "Other" },
];

// ── Stone Color (will have real images) ──
export const stoneColorOptions: OptionWithImage[] = [
  { id: "gold", label: "Gold", image: "/order/stone-gold.jpg" },
  { id: "silver", label: "Silver", image: "/order/stone-silver.jpg" },
  { id: "no-stone", label: "No Stone" },
];

// ── Customisation ──
export const customisationOptions: OptionWithImage[] = [
  { id: "name", label: "Name" },
  { id: "couples-name", label: "Couple's Name" },
  { id: "wedding-date", label: "Wedding Date" },
  { id: "initials", label: "Initials" },
  { id: "logo", label: "Logo" },
  { id: "custom-text", label: "Custom Text" },
  { id: "none", label: "No Customisation" },
];

// ── Confirmation ──
export const confirmationStatements = [
  "I confirm that all details provided are accurate",
  "I understand that my customised veil will be made according to the details submitted in the form",
  "I understand that dispatch date & delivery timeline must be confirmed by Goyanka Threads",
  "I understand that if any changes are required after the veil is made according to the details submitted (like additional stone or border) will be chargeable",
];
