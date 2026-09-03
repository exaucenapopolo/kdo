import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../utils/api";
import { useAuth } from "./AuthContext";

export interface SavedAddress {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  city: string;
  quartier?: string;
  address: string;
  deliveryMode?: string;
  instructions?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderRecord {
  ref: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryPrice: number;
  grandTotal: number;
  delivery: {
    fullName: string;
    phone: string;
    city: string;
    quartier?: string;
    address: string;
    deliveryMode: string;
    instructions?: string;
  };
  paymentMethod: string;
  points: number;
  status?: string;
  statusMessage?: string;
  userEmail?: string;
}

interface UserDataContextType {
  addresses: SavedAddress[];
  orders: OrderRecord[];
  points: number;
  usedPromos: string[];
  isLoading: boolean;
  saveOrder: (order: Omit<OrderRecord, "ref">) => Promise<OrderRecord>;
  addAddress: (addr: Omit<SavedAddress, "id">) => Promise<SavedAddress>;
  deleteAddress: (id: string) => Promise<void>;
  redeemPoints: () => Promise<boolean>;
  markPromoUsed: (code: string) => Promise<void>;
  getNextOrderRef: () => Promise<string>;
  reload: () => Promise<void>;
}

const AS_ADDRESSES   = "@kdo_addresses_v2";
const AS_ORDERS      = "@kdo_orders_v2";
const AS_POINTS      = "@kdo_points_v2";
const AS_USED_PROMOS = "@kdo_used_promos_v2";

const UserDataContext = createContext<UserDataContextType | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, authToken } = useAuth();
  const [addresses, setAddresses]   = useState<SavedAddress[]>([]);
  const [orders, setOrders]         = useState<OrderRecord[]>([]);
  const [points, setPoints]         = useState(0);
  const [usedPromos, setUsedPromos] = useState<string[]>([]);
  const [isLoading, setIsLoading]   = useState(false);

  // ── Local cache helpers ────────────────────────────────────────────────────
  const cacheAddresses = (a: SavedAddress[]) =>
    AsyncStorage.setItem(AS_ADDRESSES, JSON.stringify(a)).catch(() => {});

  const cacheOrders = (o: OrderRecord[]) =>
    AsyncStorage.setItem(AS_ORDERS, JSON.stringify(o)).catch(() => {});

  const cachePoints = (p: number) =>
    AsyncStorage.setItem(AS_POINTS, String(p)).catch(() => {});

  const cachePromos = (up: string[]) =>
    AsyncStorage.setItem(AS_USED_PROMOS, JSON.stringify(up)).catch(() => {});

  // ── Load data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Load from local cache immediately (fast)
      const [ca, co, cp, cup] = await Promise.all([
        AsyncStorage.getItem(AS_ADDRESSES),
        AsyncStorage.getItem(AS_ORDERS),
        AsyncStorage.getItem(AS_POINTS),
        AsyncStorage.getItem(AS_USED_PROMOS),
      ]);
      if (ca)  setAddresses(JSON.parse(ca));
      if (co)  setOrders(JSON.parse(co));
      if (cp)  setPoints(parseInt(cp) || 0);
      if (cup) setUsedPromos(JSON.parse(cup));

      // 2. Then sync from server (source of truth)
      if (authToken) {
        const [ordersRes, addrRes] = await Promise.all([
          apiGet("/users/orders", authToken),
          apiGet("/users/addresses", authToken),
        ]);

        if (Array.isArray(ordersRes?.orders)) {
          const serverOrders: OrderRecord[] = ordersRes.orders;
          setOrders(serverOrders);
          cacheOrders(serverOrders);
        }
        if (ordersRes?.points !== undefined) {
          setPoints(ordersRes.points);
          cachePoints(ordersRes.points);
        }
        if (Array.isArray(addrRes?.addresses)) {
          const serverAddresses: SavedAddress[] = addrRes.addresses.map((a: any) => ({
            id:           a.id,
            label:        a.label        ?? undefined,
            fullName:     a.fullName,
            phone:        a.phone,
            city:         a.city,
            quartier:     a.quartier     ?? undefined,
            address:      a.address,
            deliveryMode: a.deliveryMode ?? undefined,
            instructions: a.instructions ?? undefined,
          }));
          setAddresses(serverAddresses);
          cacheAddresses(serverAddresses);
        }
      }
    } catch (_) {}
    setIsLoading(false);
  }, [authToken]);

  useEffect(() => {
    loadData();
  }, [user?.id, authToken]);

  const reload = useCallback(() => loadData(), [loadData]);

  // ── getNextOrderRef ────────────────────────────────────────────────────────
  // Preview only — real ref is assigned by the server on saveOrder
  const getNextOrderRef = useCallback(async (): Promise<string> => {
    if (authToken) {
      try {
        const res = await apiGet("/users/next-ref", authToken);
        if (res?.ref) return res.ref;
      } catch (_) {}
    }
    return `KDO-${String(orders.length + 1).padStart(4, "0")}`;
  }, [authToken, orders.length]);

  // ── saveOrder ──────────────────────────────────────────────────────────────
  const saveOrder = useCallback(async (order: Omit<OrderRecord, "ref">): Promise<OrderRecord> => {
    // Server-side save (assigns the final ref and persists in DB)
    if (authToken) {
      try {
        const res = await apiPost("/users/orders", { order }, authToken);
        if (res?.order) {
          const saved: OrderRecord = res.order as OrderRecord;
          const newOrders = [saved, ...orders];
          const newPoints = (res.points !== undefined ? res.points : points + (saved.points ?? 0));
          setOrders(newOrders);
          setPoints(newPoints);
          cacheOrders(newOrders);
          cachePoints(newPoints);
          return saved;
        }
      } catch (_) {}
    }

    // Offline fallback
    const fallbackRef = `KDO-${String(orders.length + 1).padStart(4, "0")}`;
    const saved: OrderRecord = { ...order, ref: fallbackRef };
    const newOrders = [saved, ...orders];
    const newPoints = points + (saved.points ?? 0);
    setOrders(newOrders);
    setPoints(newPoints);
    cacheOrders(newOrders);
    cachePoints(newPoints);
    return saved;
  }, [authToken, orders, points]);

  // ── addAddress ─────────────────────────────────────────────────────────────
  const addAddress = useCallback(async (data: Omit<SavedAddress, "id">): Promise<SavedAddress> => {
    const localAddr: SavedAddress = { ...data, id: Date.now().toString() };

    // Optimistic update
    const newAddresses = [...addresses, localAddr];
    setAddresses(newAddresses);
    cacheAddresses(newAddresses);

    if (authToken) {
      try {
        const res = await apiPost("/users/addresses", { ...localAddr }, authToken);
        if (res?.address) {
          const serverAddr: SavedAddress = {
            id:           res.address.id,
            label:        res.address.label        ?? undefined,
            fullName:     res.address.fullName,
            phone:        res.address.phone,
            city:         res.address.city,
            quartier:     res.address.quartier     ?? undefined,
            address:      res.address.address,
            deliveryMode: res.address.deliveryMode ?? undefined,
            instructions: res.address.instructions ?? undefined,
          };
          // Replace local with server version (same position)
          const updated = newAddresses.map(a => a.id === localAddr.id ? serverAddr : a);
          setAddresses(updated);
          cacheAddresses(updated);
          return serverAddr;
        }
      } catch (_) {}
    }
    return localAddr;
  }, [authToken, addresses]);

  // ── deleteAddress ──────────────────────────────────────────────────────────
  const deleteAddress = useCallback(async (id: string) => {
    const newAddresses = addresses.filter(a => a.id !== id);
    setAddresses(newAddresses);
    cacheAddresses(newAddresses);

    if (authToken) {
      try {
        await apiDelete(`/users/addresses/${id}`, authToken);
      } catch (_) {}
    }
  }, [authToken, addresses]);

  // ── redeemPoints ───────────────────────────────────────────────────────────
  const redeemPoints = useCallback(async (): Promise<boolean> => {
    if (points < 100) return false;
    const newPoints = points - 100;
    setPoints(newPoints);
    cachePoints(newPoints);
    return true;
  }, [points]);

  // ── markPromoUsed ──────────────────────────────────────────────────────────
  const markPromoUsed = useCallback(async (code: string) => {
    const upper = code.toUpperCase();
    if (usedPromos.includes(upper)) return;
    const newUsedPromos = [...usedPromos, upper];
    setUsedPromos(newUsedPromos);
    cachePromos(newUsedPromos);
  }, [usedPromos]);

  return (
    <UserDataContext.Provider value={{
      addresses, orders, points, usedPromos, isLoading,
      saveOrder, addAddress, deleteAddress, redeemPoints, markPromoUsed,
      getNextOrderRef, reload,
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
}
