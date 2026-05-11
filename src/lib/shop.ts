import type { ShopProductRecord } from "@/lib/app-data";

export const SHOP_PRODUCTS: ShopProductRecord[] = [
  {
    id: "local-radiance-cleansing-oil",
    slug: "radiance-cleansing-oil",
    name: "Radiance Cleansing Oil",
    category: "Cleanse",
    subtitle: "Silk melt for SPF, makeup and city residue.",
    description:
      "A weightless botanical cleansing oil that melts sunscreen, makeup and pollution without stripping the skin barrier.",
    image_url:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    price_ngn: 28500,
    compare_at_ngn: 32000,
    featured: true,
    in_stock: true,
    inventory_count: 18,
    instagram_url: "https://instagram.com/loofahspaabuja",
  },
  {
    id: "local-enzyme-polish-powder",
    slug: "enzyme-polish-powder",
    name: "Enzyme Polish Powder",
    category: "Exfoliate",
    subtitle: "Water-activated glow reset for textured skin.",
    description:
      "A rice-enzyme powder cleanser that brightens, smooths and keeps congestion low without harsh scrubs.",
    image_url:
      "https://images.unsplash.com/photo-1556228720-da4e85f25e72?auto=format&fit=crop&w=1200&q=80",
    price_ngn: 24000,
    compare_at_ngn: null,
    featured: false,
    in_stock: true,
    inventory_count: 22,
    instagram_url: "https://instagram.com/loofahspaabuja",
  },
  {
    id: "local-vitamin-c-essence",
    slug: "vitamin-c-essence",
    name: "Vitamin C Essence",
    category: "Brighten",
    subtitle: "Daily glow concentrate for uneven tone.",
    description:
      "A stable antioxidant essence designed to support brightness, reduce dullness and defend against environmental stress.",
    image_url:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
    price_ngn: 36000,
    compare_at_ngn: 40000,
    featured: true,
    in_stock: true,
    inventory_count: 12,
    instagram_url: "https://instagram.com/loofahspaabuja",
  },
  {
    id: "local-barrier-repair-cream",
    slug: "barrier-repair-cream",
    name: "Barrier Repair Cream",
    category: "Moisturise",
    subtitle: "Cushioning comfort for sensitive, post-treatment skin.",
    description:
      "Ceramides, cholesterol and peptides rebuild resilience after peels, lasers and dry harmattan weeks.",
    image_url:
      "https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?auto=format&fit=crop&w=1200&q=80",
    price_ngn: 34500,
    compare_at_ngn: null,
    featured: false,
    in_stock: true,
    inventory_count: 16,
    instagram_url: "https://instagram.com/loofahspaabuja",
  },
  {
    id: "local-overnight-renewal-mask",
    slug: "overnight-renewal-mask",
    name: "Overnight Renewal Mask",
    category: "Treat",
    subtitle: "Sleep-in resurfacing veil for weekend radiance.",
    description:
      "A low-irritation overnight mask with lactic acid and niacinamide that wakes up tired skin looking freshly polished.",
    image_url:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    price_ngn: 42000,
    compare_at_ngn: 46000,
    featured: true,
    in_stock: true,
    inventory_count: 9,
    instagram_url: "https://instagram.com/loofahspaabuja",
  },
  {
    id: "local-daily-sheer-spf50",
    slug: "daily-sheer-spf50",
    name: "Daily Sheer SPF 50",
    category: "Protect",
    subtitle: "No-cast broad-spectrum finish for melanin-rich skin.",
    description:
      "A lightweight sunscreen with an invisible finish, humidity-friendly feel and elegant layering under makeup.",
    image_url:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=1200&q=80",
    price_ngn: 31000,
    compare_at_ngn: null,
    featured: true,
    in_stock: true,
    inventory_count: 28,
    instagram_url: "https://instagram.com/loofahspaabuja",
  },
];

export const SHOP_CATEGORIES = Array.from(new Set(SHOP_PRODUCTS.map((product) => product.category)));
