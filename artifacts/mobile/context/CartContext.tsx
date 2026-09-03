import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  brand?: string;
  description?: string;
  rating?: number;
  inStock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubSnap = useRef<(() => void) | null>(null);

  // ─── Auth state observer ────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    try {
      const auth = getFirebaseAuth();
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (!mounted) return;
        if (fbUser) {
          setUserId(fbUser.uid);
          // Load cart from Firestore when user signs in
          try {
            setIsSyncing(true);
            const db = getFirebaseDb();
            const snap = await getDoc(doc(db, "users", fbUser.uid));
            if (snap.exists()) {
              const data = snap.data();
              if (Array.isArray(data?.cart)) {
                setItems(data.cart);
                await AsyncStorage.setItem("kdo_cart", JSON.stringify(data.cart));
              }
              if (Array.isArray(data?.favorites)) {
                setFavorites(data.favorites);
                await AsyncStorage.setItem("kdo_favorites", JSON.stringify(data.favorites));
              }
            } else {
              // Load from local and push to Firestore
              const local = await AsyncStorage.getItem("kdo_cart");
              const localFav = await AsyncStorage.getItem("kdo_favorites");
              const localItems = local ? JSON.parse(local) : [];
              const localFavs = localFav ? JSON.parse(localFav) : [];
              if (localItems.length > 0) setItems(localItems);
              if (localFavs.length > 0) setFavorites(localFavs);
            }
          } catch {
            // Fall back to AsyncStorage
            const local = await AsyncStorage.getItem("kdo_cart");
            const localFav = await AsyncStorage.getItem("kdo_favorites");
            if (local) setItems(JSON.parse(local));
            if (localFav) setFavorites(JSON.parse(localFav));
          } finally {
            setIsSyncing(false);
          }
        } else {
          setUserId(null);
          if (unsubSnap.current) { unsubSnap.current(); unsubSnap.current = null; }
          // Load from AsyncStorage when not logged in
          const local = await AsyncStorage.getItem("kdo_cart");
          const localFav = await AsyncStorage.getItem("kdo_favorites");
          if (local) setItems(JSON.parse(local));
          if (localFav) setFavorites(JSON.parse(localFav));
        }
      });
      return () => { mounted = false; unsub(); };
    } catch {
      // Firebase unavailable - use only AsyncStorage
      const load = async () => {
        const local = await AsyncStorage.getItem("kdo_cart");
        const localFav = await AsyncStorage.getItem("kdo_favorites");
        if (local) setItems(JSON.parse(local));
        if (localFav) setFavorites(JSON.parse(localFav));
      };
      load();
      return () => { mounted = false; };
    }
  }, []);

  // ─── Persist to Firestore + AsyncStorage (debounced) ───────────────────────
  const persistCart = useCallback((newItems: CartItem[], newFavs: string[]) => {
    AsyncStorage.setItem("kdo_cart", JSON.stringify(newItems)).catch(() => {});
    AsyncStorage.setItem("kdo_favorites", JSON.stringify(newFavs)).catch(() => {});

    if (!userId) return;

    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      try {
        const db = getFirebaseDb();
        await setDoc(
          doc(db, "users", userId),
          { cart: newItems, favorites: newFavs, updatedAt: new Date().toISOString() },
          { merge: true }
        );
      } catch {
        // Silently fail - data is already in AsyncStorage
      }
    }, 800); // debounce 800ms to avoid too many Firestore writes
  }, [userId]);

  // ─── Cart operations ───────────────────────────────────────────────────────
  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const newItems = existing
        ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { ...product, quantity }];
      persistCart(newItems, favorites);
      return newItems;
    });
  }, [persistCart, favorites]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== id);
      persistCart(newItems, favorites);
      return newItems;
    });
  }, [persistCart, favorites]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const newItems = quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => i.id === id ? { ...i, quantity } : i);
      persistCart(newItems, favorites);
      return newItems;
    });
  }, [persistCart, favorites]);

  const clearCart = useCallback(() => {
    setItems([]);
    persistCart([], favorites);
  }, [persistCart, favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      persistCart(items, newFavs);
      return newFavs;
    });
  }, [persistCart, items]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      total, itemCount,
      favorites, toggleFavorite, isFavorite,
      isSyncing,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
