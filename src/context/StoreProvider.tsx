"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { readJSON, writeJSON } from "@/lib/storage";
import { SHIPPING } from "@/data/site";
import type { CartLine, DeliveryMode, Order } from "@/lib/types";

const CART_KEY = "stepup.cart.v1";
const WISH_KEY = "stepup.wishlist.v1";
const ORDER_KEY = "stepup.last-order.v1";

export const lineKey = (productId: string, size: string) => `${productId}:${size}`;

/* ------------------------------------------------------------------ panier */

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "remove"; key: string }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "clear" };

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const key = lineKey(action.line.productId, action.line.size);
      const existing = state.find((l) => lineKey(l.productId, l.size) === key);
      if (existing) {
        // le stock est unitaire par pointure : la quantité reste bornée
        const quantity = Math.min(
          existing.quantity + action.line.quantity,
          existing.maxQuantity,
        );
        return state.map((l) =>
          lineKey(l.productId, l.size) === key ? { ...l, quantity } : l,
        );
      }
      return [
        ...state,
        { ...action.line, quantity: Math.min(action.line.quantity, action.line.maxQuantity) },
      ];
    }
    case "remove":
      return state.filter((l) => lineKey(l.productId, l.size) !== action.key);
    case "setQuantity":
      return state.flatMap((l) => {
        if (lineKey(l.productId, l.size) !== action.key) return [l];
        const quantity = Math.min(Math.max(action.quantity, 0), l.maxQuantity);
        return quantity === 0 ? [] : [{ ...l, quantity }];
      });
    case "clear":
      return [];
  }
}

/* ------------------------------------------------------------------- toasts */

export interface Toast {
  id: number;
  title: string;
  detail?: string;
  image?: string;
  href?: string;
}

/* ------------------------------------------------------------------ context */

interface StoreValue {
  /** false tant que le localStorage n'a pas été relu (évite un écart SSR/client) */
  hydrated: boolean;

  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  shippingFor: (mode: DeliveryMode) => number;
  addToCart: (line: CartLine) => void;
  removeFromCart: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;

  wishlist: string[];
  isWished: (slug: string) => boolean;
  toggleWish: (slug: string, name?: string) => void;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;

  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;

  lastOrder: Order | null;
  saveOrder: (order: Order) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, [] as CartLine[]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [cartOpen, setCartOpenState] = useState(false);
  const [searchOpen, setSearchOpenState] = useState(false);
  const [menuOpen, setMenuOpenState] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // relecture du stockage après le premier rendu
  useEffect(() => {
    dispatch({ type: "hydrate", lines: readJSON<CartLine[]>(CART_KEY, []) });
    setWishlist(readJSON<string[]>(WISH_KEY, []));
    setLastOrder(readJSON<Order | null>(ORDER_KEY, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(CART_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(WISH_KEY, wishlist);
  }, [wishlist, hydrated]);

  // un seul panneau ouvert à la fois + blocage du défilement de fond
  const anyPanelOpen = cartOpen || searchOpen || menuOpen;

  useEffect(() => {
    if (!anyPanelOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [anyPanelOpen]);

  // Échap ferme le panneau ouvert
  useEffect(() => {
    if (!anyPanelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCartOpenState(false);
      setSearchOpenState(false);
      setMenuOpenState(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anyPanelOpen]);

  const setCartOpen = useCallback((open: boolean) => {
    setCartOpenState(open);
    if (open) {
      setSearchOpenState(false);
      setMenuOpenState(false);
    }
  }, []);

  const setSearchOpen = useCallback((open: boolean) => {
    setSearchOpenState(open);
    if (open) {
      setCartOpenState(false);
      setMenuOpenState(false);
    }
  }, []);

  const setMenuOpen = useCallback((open: boolean) => {
    setMenuOpenState(open);
    if (open) {
      setCartOpenState(false);
      setSearchOpenState(false);
    }
  }, []);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
    window.setTimeout(
      () => setToasts((current) => current.filter((t) => t.id !== id)),
      3600,
    );
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const addToCart = useCallback(
    (line: CartLine) => {
      dispatch({ type: "add", line });
      pushToast({
        title: "Ajouté au panier",
        detail: `${line.name} · ${line.colorName} · Taille ${line.size}`,
        image: line.image,
        href: "/panier",
      });
    },
    [pushToast],
  );

  const removeFromCart = useCallback((key: string) => dispatch({ type: "remove", key }), []);

  const setQuantity = useCallback(
    (key: string, quantity: number) => dispatch({ type: "setQuantity", key, quantity }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  const toggleWish = useCallback(
    (slug: string, name?: string) => {
      setWishlist((list) => {
        const has = list.includes(slug);
        pushToast({
          title: has ? "Retiré des favoris" : "Ajouté aux favoris",
          detail: name,
          href: has ? undefined : "/favoris",
        });
        return has ? list.filter((s) => s !== slug) : [...list, slug];
      });
    },
    [pushToast],
  );

  const saveOrder = useCallback((order: Order) => {
    setLastOrder(order);
    writeJSON(ORDER_KEY, order);
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [cart],
  );

  const cartCount = useMemo(
    () => cart.reduce((count, line) => count + line.quantity, 0),
    [cart],
  );

  const shippingFor = useCallback(
    (mode: DeliveryMode) => {
      if (cart.length === 0) return 0;
      if (subtotal >= SHIPPING.freeFrom) return 0;
      return mode === "domicile" ? SHIPPING.domicile : SHIPPING.bureau;
    },
    [cart.length, subtotal],
  );

  const isWished = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      cartCount,
      subtotal,
      shippingFor,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      wishlist,
      isWished,
      toggleWish,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      toasts,
      pushToast,
      dismissToast,
      lastOrder,
      saveOrder,
    }),
    [
      hydrated,
      cart,
      cartCount,
      subtotal,
      shippingFor,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      wishlist,
      isWished,
      toggleWish,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      toasts,
      pushToast,
      dismissToast,
      lastOrder,
      saveOrder,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore doit être utilisé dans <StoreProvider>");
  return context;
}
