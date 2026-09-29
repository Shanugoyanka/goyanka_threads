import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

/**
 * Image base URL — points to existing repo images.
 *
 * 🔄 TO REPLACE WITH REAL PRODUCT PHOTOS:
 *    1. Upload your images to a CDN, Supabase Storage, or /public folder
 *    2. Update the URLs in each product's imageUrls array
 *    3. Re-run: npx tsx prisma/seed.ts
 */
const IMG = "https://raw.githubusercontent.com/Shanugoyanka/goyanka_threads/master/images";

/**
 * ⚠️  DEMO CATALOGUE — placeholder products for development & testing.
 *     Every entry has isSample: true.
 *
 *     To replace with real inventory:
 *     1. Set isSample: false on real products
 *     2. Update name, description, prices, images
 *     3. Run seed or use Prisma Studio
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
    imageUrls: [
      `${IMG}/14_pearl_scalloped_border_red.jpg`,
      `${IMG}/14_pearl_scalloped_border_mehroon.jpg`,
      `${IMG}/15_sequin_scalloped_border_rani_pink.jpg`,
    ],
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
    imageUrls: [
      `${IMG}/14_pearl_scalloped_border_red.jpg`,
      `${IMG}/14_pearl_scalloped_border_rani_pink.jpg`,
    ],
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
      `${IMG}/02_gota_patti_all_over_red.jpg`,
      `${IMG}/02_gota_patti_all_over_mehroon.jpg`,
      `${IMG}/02_gota_patti_all_over_rani_pink.jpg`,
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
    imageUrls: [
      `${IMG}/08_sequin_gota_patti_red.jpg`,
      `${IMG}/08_sequin_gota_patti_mehroon.jpg`,
      `${IMG}/08_sequin_gota_patti_rani_pink.jpg`,
    ],
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
    imageUrls: [
      `${IMG}/01_zardosi_all_over_red.jpg`,
      `${IMG}/01_zardosi_all_over_mehroon.jpg`,
    ],
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
      "Heavy embroidery with a ornate border — designed for brides who want every head to turn.",
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
      `${IMG}/05_zardosi_gota_patti_red.jpg`,
      `${IMG}/05_zardosi_gota_patti_mehroon.jpg`,
      `${IMG}/05_zardosi_gota_patti_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 21,
    isFeatured: false,
    isSample: true,
  },

  // ─── 7. Personalized Mantra / Name Veil ───
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
    imageUrls: [
      `${IMG}/09_zardosi_sequin_red.jpg`,
      `${IMG}/09_zardosi_sequin_mehroon.jpg`,
      `${IMG}/09_zardosi_sequin_rani_pink.jpg`,
    ],
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
      `${IMG}/04_sequin_scatter_rani_pink.jpg`,
      `${IMG}/15_sequin_scalloped_border_rani_pink.jpg`,
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
      `${IMG}/06_zardosi_mirror_work_red.jpg`,
      `${IMG}/06_zardosi_mirror_work_mehroon.jpg`,
      `${IMG}/07_gota_patti_mirror_work_rani_pink.jpg`,
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
    imageUrls: [
      `${IMG}/10_mirror_sequin_rani_pink.jpg`,
      `${IMG}/04_sequin_scatter_rani_pink.jpg`,
    ],
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
    imageUrls: [
      `${IMG}/11_gota_kinari_gold_border_red.jpg`,
      `${IMG}/11_gota_kinari_gold_border_mehroon.jpg`,
      `${IMG}/13_zardosi_border_red.jpg`,
    ],
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
    embroidery: "Fully custom — choose embroidery style, border, and personal text",
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
      `${IMG}/03_mirror_work_shisha_red.jpg`,
      `${IMG}/01_zardosi_all_over_mehroon.jpg`,
      `${IMG}/09_zardosi_sequin_rani_pink.jpg`,
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
  console.log(
    "\n📝 These are DEMO products. Replace with real Goyanka Threads inventory by:"
  );
  console.log("   1. Editing this file or using Prisma Studio (npx prisma studio)");
  console.log("   2. Setting isSample: false on real products");
  console.log("   3. Updating imageUrls with your own product photos\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
