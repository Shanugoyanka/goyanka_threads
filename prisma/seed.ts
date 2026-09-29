import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

/**
 * Supabase Storage public URL for the "goyanka threads" bucket.
 *
 * 🔄 TO USE YOUR OWN IMAGES:
 *    1. Upload images to the Supabase Storage bucket
 *    2. Make sure the bucket is set to PUBLIC
 *    3. Update filenames in the imageUrls arrays below
 *    4. Re-run: npx tsx prisma/seed.ts
 */
const BUCKET =
  "https://abovffewvfdlhvvqcvxy.supabase.co/storage/v1/object/public/goyanka%20threads";

function img(filename: string) {
  return `${BUCKET}/${filename}`;
}

/**
 * ⚠️  DEMO CATALOGUE — these products use real Goyanka Threads images
 *     but have placeholder descriptions and prices.
 *
 *     To convert to production inventory:
 *     1. Update prices to real prices
 *     2. Update descriptions to real descriptions
 *     3. Set isSample: false
 *     4. Re-run seed or edit via Prisma Studio
 */
const demoProducts = [
  // ─── 1. Minimal Scallop Bridal Veil ───
  {
    name: "Minimal Scallop Bridal Veil",
    description:
      "A delicate scalloped edge with subtle shimmer — perfect for brides who love understated elegance.",
    category: "bridal-veil",
    styleTags: ["minimal", "elegant", "subtle"],
    colours: ["red", "maroon", "pink", "ivory"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Fine scalloped border with minimal sequin detailing",
    basePrice: 2999,
    minPrice: 2999,
    maxPrice: 3499,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [img("01_red_minimal_scallop.jpg")],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 10,
    isFeatured: true,
    isSample: true,
  },

  // ─── 2. Pearl Border Bridal Veil ───
  {
    name: "Pearl Border Bridal Veil",
    description:
      "Elegant pearl-accented scalloped border — timeless grace for your special day.",
    category: "bridal-veil",
    styleTags: ["minimal", "elegant", "pearl"],
    colours: ["red", "pink", "ivory"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Pearl-studded scalloped border with soft tulle drape",
    basePrice: 3499,
    minPrice: 3499,
    maxPrice: 3999,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [img("02_blush_pearl_border.jpg")],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 12,
    isFeatured: false,
    isSample: true,
  },

  // ─── 3. Floral Embroidered Bridal Veil ───
  {
    name: "Floral Embroidered Bridal Veil",
    description:
      "Delicate floral embroidery with a graceful drape — for the bride who loves fine detail.",
    category: "bridal-veil",
    styleTags: ["elegant", "statement", "floral"],
    colours: ["red", "maroon", "pink"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Hand-embroidered floral motifs with thread and sequin accents",
    basePrice: 3999,
    minPrice: 3999,
    maxPrice: 4499,
    customizationOptions: ["colour", "border", "length"],
    status: "available",
    imageUrls: [
      img("05_blush_floral_statement.jpg"),
      img("11_dusty_pink_floral.jpg"),
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 14,
    isFeatured: true,
    isSample: true,
  },

  // ─── 4. Personalized Name Bridal Veil ───
  {
    name: "Personalized Name Bridal Veil",
    description:
      "Your names, initials or wedding date beautifully embroidered — a keepsake veil you'll treasure.",
    category: "bridal-veil",
    styleTags: ["personalized", "custom", "elegant"],
    colours: ["red", "maroon", "pink", "ivory"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Custom name/initials/date embroidered in metallic thread",
    basePrice: 4299,
    minPrice: 4299,
    maxPrice: 4999,
    customizationOptions: ["name", "initials", "date", "colour", "length"],
    status: "available",
    imageUrls: [img("07_ivory_personalized.jpg")],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 14,
    isFeatured: true,
    isSample: true,
  },

  // ─── 5. Heavy Zardozi Bridal Veil ───
  {
    name: "Heavy Zardozi Bridal Veil",
    description:
      "Luxurious all-over zardozi metallic threadwork — for the bride who wants to make a grand statement.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "traditional", "luxurious"],
    colours: ["red", "maroon", "gold"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Full zardozi metallic threadwork with gold bullion wire",
    basePrice: 4999,
    minPrice: 4999,
    maxPrice: 5999,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [img("09_red_heavy_zardozi.jpg")],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 18,
    isFeatured: true,
    isSample: true,
  },

  // ─── 6. Royal Statement Bridal Veil ───
  {
    name: "Royal Statement Bridal Veil",
    description:
      "Heavy embroidery with an ornate border — designed for brides who want every head to turn.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "luxurious"],
    colours: ["red", "maroon", "gold", "ivory"],
    veilLength: "120",
    fabric: "Premium Net",
    embroidery: "Zardozi and gota patti fusion with ornate border work",
    basePrice: 5499,
    minPrice: 5499,
    maxPrice: 6499,
    customizationOptions: ["border", "length"],
    status: "available",
    imageUrls: [
      img("06_red_traditional_heavy.jpg"),
      img("03_maroon_heavy_floral.jpg"),
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 21,
    isFeatured: false,
    isSample: true,
  },

  // ─── 7. Personalized Mantra Veil ───
  {
    name: "Personalized Mantra Veil",
    description:
      "A meaningful mantra, names or wedding date embroidered along the border — spiritual and personal.",
    category: "bridal-veil",
    styleTags: ["personalized", "custom", "meaningful"],
    colours: ["red", "maroon", "pink", "ivory", "gold"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Custom mantra or names embroidered along border in script",
    basePrice: 4499,
    minPrice: 4499,
    maxPrice: 5499,
    customizationOptions: ["name", "initials", "date", "custom-text", "colour"],
    status: "available",
    imageUrls: [img("12_ivory_mantra_personalized.jpg")],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 16,
    isFeatured: false,
    isSample: true,
  },

  // ─── 8. Lightweight Cathedral Veil ───
  {
    name: "Lightweight Cathedral Veil",
    description:
      "A flowing 10-foot cathedral-length veil with minimal detailing — dramatic yet weightless.",
    category: "bridal-veil",
    styleTags: ["minimal", "elegant", "lightweight", "cathedral"],
    colours: ["pink", "ivory"],
    veilLength: "120",
    fabric: "Soft Tulle",
    embroidery: "Subtle shimmer border with fine edge detailing",
    basePrice: 3299,
    minPrice: 3299,
    maxPrice: 3799,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [
      img("08_pink_lightweight_cathedral.jpg"),
      img("04_ivory_elegant.jpg"),
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 10,
    isFeatured: false,
    isSample: true,
  },

  // ─── 9. Heavy Floral Cathedral Veil ───
  {
    name: "Heavy Floral Cathedral Veil",
    description:
      "Grand 10-foot veil with rich floral embroidery — the ultimate statement piece.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "floral", "traditional"],
    colours: ["red", "maroon", "pink"],
    veilLength: "120",
    fabric: "Premium Net",
    embroidery: "Dense floral embroidery with zardozi and gota patti accents",
    basePrice: 4799,
    minPrice: 4799,
    maxPrice: 5799,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [
      img("03_maroon_heavy_floral.jpg"),
      img("11_dusty_pink_floral.jpg"),
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 21,
    isFeatured: false,
    isSample: true,
  },

  // ─── 10. Pearl & Sequin Bridal Veil ───
  {
    name: "Pearl & Sequin Bridal Veil",
    description:
      "Pearls and sequins scattered across soft tulle — sparkle meets sophistication.",
    category: "bridal-veil",
    styleTags: ["elegant", "minimal", "sparkle"],
    colours: ["pink", "ivory"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Hand-applied pearl beads with scattered sequin accents",
    basePrice: 4299,
    minPrice: 4299,
    maxPrice: 4799,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [img("10_champagne_pearl_sequin.jpg")],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 12,
    isFeatured: false,
    isSample: true,
  },

  // ─── 11. Traditional Bridal Border Veil ───
  {
    name: "Traditional Bridal Border Veil",
    description:
      "Classic gota kinari gold border with traditional appeal — the heritage choice.",
    category: "bridal-veil",
    styleTags: ["traditional", "statement", "heavy"],
    colours: ["red", "maroon", "gold"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Gota kinari gold border with traditional motifs",
    basePrice: 3799,
    minPrice: 3799,
    maxPrice: 4299,
    customizationOptions: ["colour", "length"],
    status: "available",
    imageUrls: [img("06_red_traditional_heavy.jpg")],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 14,
    isFeatured: false,
    isSample: true,
  },

  // ─── 12. Fully Customized Bridal Veil ───
  {
    name: "Fully Customized Bridal Veil",
    description:
      "Design every detail — colour, length, border, embroidery and personalized text. Your dream veil, made exactly to order.",
    category: "bridal-veil",
    styleTags: ["personalized", "custom", "versatile"],
    colours: ["red", "maroon", "pink", "ivory", "gold"],
    veilLength: "84",
    fabric: "Your choice",
    embroidery:
      "Fully custom — choose embroidery style, border, and personal text",
    basePrice: 4999,
    minPrice: 4999,
    maxPrice: 7999,
    customizationOptions: [
      "colour",
      "length",
      "border",
      "embroidery",
      "name",
      "initials",
      "date",
      "custom-text",
    ],
    status: "available",
    imageUrls: [
      img("04_ivory_elegant.jpg"),
      img("01_red_minimal_scallop.jpg"),
      img("09_red_heavy_zardozi.jpg"),
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 21,
    isFeatured: true,
    isSample: true,
  },
];

async function main() {
  console.log("🌱 Seeding demo catalogue...\n");

  // Clear existing data to allow re-running
  await prisma.enquiryProduct.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.product.deleteMany({});

  for (const product of demoProducts) {
    const created = await prisma.product.create({ data: product });
    console.log(`  ✓ ${created.name}  (₹${created.basePrice})`);
  }

  console.log(`\n✅ Seeded ${demoProducts.length} demo products`);
  console.log("\n📸 Image mapping:");
  console.log("   01_red_minimal_scallop.jpg       → Minimal Scallop");
  console.log("   02_blush_pearl_border.jpg         → Pearl Border");
  console.log("   03_maroon_heavy_floral.jpg        → Heavy Floral Cathedral, Royal Statement");
  console.log("   04_ivory_elegant.jpg              → Lightweight Cathedral, Fully Customized");
  console.log("   05_blush_floral_statement.jpg     → Floral Embroidered");
  console.log("   06_red_traditional_heavy.jpg      → Royal Statement, Traditional Border");
  console.log("   07_ivory_personalized.jpg         → Personalized Name");
  console.log("   08_pink_lightweight_cathedral.jpg  → Lightweight Cathedral");
  console.log("   09_red_heavy_zardozi.jpg          → Heavy Zardozi, Fully Customized");
  console.log("   10_champagne_pearl_sequin.jpg     → Pearl & Sequin");
  console.log("   11_dusty_pink_floral.jpg          → Floral Embroidered, Heavy Floral Cathedral");
  console.log("   12_ivory_mantra_personalized.jpg  → Personalized Mantra");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
