import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ShopProductRecord } from "@/lib/app-data";

const STORAGE_KEY = "loofah-cart";

export interface CartItem {
  product_id: string | null;
  slug: string;
  name: string;
  image_url: string;
  price_ngn: number;
  quantity: number;
  inventory_count: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: ShopProductRecord, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as Array<Partial<CartItem>>).map((item) => ({
      product_id: item.product_id ?? null,
      slug: item.slug ?? "",
      name: item.name ?? "",
      image_url: item.image_url ?? "",
      price_ngn: Number(item.price_ngn ?? 0),
      quantity: Math.max(1, Math.min(Number(item.quantity ?? 1), 10)),
      inventory_count: Math.max(1, Number(item.inventory_count ?? 10)),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((total, item) => total + item.price_ngn * item.quantity, 0);
    const count = items.reduce((total, item) => total + item.quantity, 0);

    return {
      items,
      count,
      subtotal,
      addItem(product, quantity = 1) {
        setItems((current) => {
          const maxQuantity = Math.max(0, Math.min(product.inventory_count, 10));
          if (!product.in_stock || maxQuantity === 0) {
            return current;
          }

          const existing = current.find((item) => item.slug === product.slug);
          if (existing) {
            return current.map((item) =>
              item.slug === product.slug
                ? {
                    ...item,
                    inventory_count: maxQuantity,
                    quantity: Math.min(item.quantity + quantity, maxQuantity),
                  }
                : item,
            );
          }
          return [
            {
              product_id: product.id,
              slug: product.slug,
              name: product.name,
              image_url: product.image_url,
              price_ngn: product.price_ngn,
              quantity: Math.min(quantity, maxQuantity),
              inventory_count: maxQuantity,
            },
            ...current,
          ];
        });
      },
      updateQuantity(slug, quantity) {
        setItems((current) =>
          current
            .map((item) =>
              item.slug === slug
                ? {
                    ...item,
                    quantity: Math.max(0, Math.min(quantity, Math.max(1, item.inventory_count))),
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(slug) {
        setItems((current) => current.filter((item) => item.slug !== slug));
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }
  return value;
}
