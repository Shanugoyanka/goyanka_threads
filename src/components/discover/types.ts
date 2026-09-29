export interface MatchedProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  styleTags: string[];
  colours: string[];
  veilLength: string;
  fabric: string;
  embroidery: string;
  basePrice: number;
  minPrice: number | null;
  maxPrice: number | null;
  customizationOptions: string[];
  status: string;
  imageUrls: string[];
  videoUrls: string[];
  customerMediaUrls: string[];
  deliveryDays: number;
  isFeatured: boolean;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
  matchScore: number;
  matchTier: "best" | "also-like";
  matchLabel: string | null;
}

export function formatPrice(price: number): string {
  return "₹" + price.toLocaleString("en-IN");
}

export function getPriceDisplay(product: MatchedProduct): string {
  const min = product.minPrice ?? product.basePrice;
  const max = product.maxPrice ?? product.basePrice;
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}
