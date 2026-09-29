import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const IMG_BASE =
  "https://raw.githubusercontent.com/Shanugoyanka/goyanka_threads/master/images";

/**
 * ⚠️  SAMPLE DATA — these are placeholder entries for development.
 *     Replace with real Goyanka Threads products, prices, and media
 *     before going live. Every entry has isSample: true.
 */
const sampleProducts = [
  {
    name: "Zardozi Classic Veil",
    description:
      "Heavy gold zardozi threadwork all over — a timeless statement piece for the traditional bride.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "traditional"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Full zardozi metallic threadwork with gold bullion wire",
    basePrice: 8500,
    minPrice: 8500,
    maxPrice: 12000,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/01_zardosi_all_over_red.jpg`,
      `${IMG_BASE}/01_zardosi_all_over_mehroon.jpg`,
      `${IMG_BASE}/01_zardosi_all_over_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 21,
    isFeatured: true,
    isSample: true,
  },
  {
    name: "Gota Patti Bridal Veil",
    description:
      "Rajasthani gota patti ribbon appliqué for a regal, festive look.",
    category: "bridal-veil",
    styleTags: ["heavy", "traditional", "rajasthani"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Gold ribbon appliqué (gota patti) hand-stitched throughout",
    basePrice: 7500,
    minPrice: 7500,
    maxPrice: 10500,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/02_gota_patti_all_over_red.jpg`,
      `${IMG_BASE}/02_gota_patti_all_over_mehroon.jpg`,
      `${IMG_BASE}/02_gota_patti_all_over_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 18,
    isFeatured: false,
    isSample: true,
  },
  {
    name: "Mirror Work Shisha Veil",
    description:
      "Shisha mirrors stitched across the veil for eye-catching sparkle.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "sparkle"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "120",
    fabric: "Soft Tulle",
    embroidery: "Hand-stitched shisha mirror work all over",
    basePrice: 9000,
    minPrice: 9000,
    maxPrice: 13000,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/03_mirror_work_shisha_red.jpg`,
      `${IMG_BASE}/03_mirror_work_shisha_mehroon.jpg`,
      `${IMG_BASE}/03_mirror_work_shisha_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 25,
    isFeatured: true,
    isSample: true,
  },
  {
    name: "Sequin Scatter Veil",
    description:
      "Scattered sequins for a subtle, understated shimmer — perfect for the minimal bride.",
    category: "bridal-veil",
    styleTags: ["minimal", "elegant", "subtle"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Scattered sequins hand-applied for subtle shine",
    basePrice: 5500,
    minPrice: 5500,
    maxPrice: 7500,
    customizationOptions: ["initials", "name", "date"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/04_sequin_scatter_red.jpg`,
      `${IMG_BASE}/04_sequin_scatter_mehroon.jpg`,
      `${IMG_BASE}/04_sequin_scatter_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 14,
    isFeatured: false,
    isSample: true,
  },
  {
    name: "Zardozi + Gota Patti Fusion Veil",
    description:
      "Gold threadwork combined with ribbon appliqué — the best of both worlds.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "fusion"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "120",
    fabric: "Premium Net",
    embroidery: "Zardozi metallic thread with gota patti ribbon appliqué",
    basePrice: 11000,
    minPrice: 11000,
    maxPrice: 15000,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/05_zardosi_gota_patti_red.jpg`,
      `${IMG_BASE}/05_zardosi_gota_patti_mehroon.jpg`,
      `${IMG_BASE}/05_zardosi_gota_patti_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 28,
    isFeatured: true,
    isSample: true,
  },
  {
    name: "Zardozi + Mirror Statement Veil",
    description:
      "Gold threadwork with mirror accents — a bold, luxurious statement.",
    category: "bridal-veil",
    styleTags: ["heavy", "statement", "luxurious"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "120",
    fabric: "Premium Net",
    embroidery: "Zardozi threadwork interlaced with shisha mirror work",
    basePrice: 12000,
    minPrice: 12000,
    maxPrice: 16000,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/06_zardosi_mirror_work_red.jpg`,
      `${IMG_BASE}/06_zardosi_mirror_work_mehroon.jpg`,
      `${IMG_BASE}/06_zardosi_mirror_work_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 28,
    isFeatured: false,
    isSample: true,
  },
  {
    name: "Gota Patti + Mirror Veil",
    description:
      "Ribbon appliqué with mirror sparkle — festive and radiant.",
    category: "bridal-veil",
    styleTags: ["heavy", "traditional", "sparkle"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "84",
    fabric: "Premium Net",
    embroidery: "Gota patti appliqué combined with mirror work detailing",
    basePrice: 8000,
    minPrice: 8000,
    maxPrice: 11000,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/07_gota_patti_mirror_work_red.jpg`,
      `${IMG_BASE}/07_gota_patti_mirror_work_mehroon.jpg`,
      `${IMG_BASE}/07_gota_patti_mirror_work_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 21,
    isFeatured: false,
    isSample: true,
  },
  {
    name: "Sequin + Gota Patti Veil",
    description:
      "Sequin shimmer paired with ribbon appliqué — subtle yet ornate.",
    category: "bridal-veil",
    styleTags: ["personalized", "elegant", "versatile"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Scattered sequins with gota patti appliqué accents",
    basePrice: 7000,
    minPrice: 7000,
    maxPrice: 9500,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/08_sequin_gota_patti_red.jpg`,
      `${IMG_BASE}/08_sequin_gota_patti_mehroon.jpg`,
      `${IMG_BASE}/08_sequin_gota_patti_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 18,
    isFeatured: false,
    isSample: true,
  },
  {
    name: "Zardozi + Sequin Veil",
    description:
      "Gold threadwork with sequin shimmer — elegantly glamorous.",
    category: "bridal-veil",
    styleTags: ["personalized", "statement", "glamorous"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "120",
    fabric: "Soft Tulle",
    embroidery: "Zardozi metallic threadwork with scattered sequin accents",
    basePrice: 10000,
    minPrice: 10000,
    maxPrice: 14000,
    customizationOptions: ["initials", "name", "date", "custom"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/09_zardosi_sequin_red.jpg`,
      `${IMG_BASE}/09_zardosi_sequin_mehroon.jpg`,
      `${IMG_BASE}/09_zardosi_sequin_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 25,
    isFeatured: false,
    isSample: true,
  },
  {
    name: "Mirror + Sequin Minimal Veil",
    description:
      "Mirror sparkle with sequin shimmer — dazzling yet lightweight.",
    category: "bridal-veil",
    styleTags: ["minimal", "sparkle", "lightweight"],
    colours: ["red", "mehroon", "rani-pink"],
    veilLength: "84",
    fabric: "Soft Tulle",
    embroidery: "Shisha mirror work combined with scattered sequins",
    basePrice: 6500,
    minPrice: 6500,
    maxPrice: 8500,
    customizationOptions: ["initials", "name", "date"],
    status: "available",
    imageUrls: [
      `${IMG_BASE}/10_mirror_sequin_red.jpg`,
      `${IMG_BASE}/10_mirror_sequin_mehroon.jpg`,
      `${IMG_BASE}/10_mirror_sequin_rani_pink.jpg`,
    ],
    videoUrls: [],
    customerMediaUrls: [],
    deliveryDays: 14,
    isFeatured: false,
    isSample: true,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing sample data to allow re-running
  await prisma.enquiryProduct.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.product.deleteMany({});

  for (const product of sampleProducts) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Seeded ${sampleProducts.length} sample products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
