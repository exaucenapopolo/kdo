import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const DOMAIN = process.env["EXPO_PUBLIC_DOMAIN"] || "kdo-cameroon-app.replit.app";
const API_BASE = `https://${DOMAIN}/api`;

export interface UnavailableEntry {
  productId: string;
  city: string;
}

interface UnavailableContextType {
  unavailableEntries: UnavailableEntry[];
  isUnavailable: (productId: string, city: string | null) => boolean;
  markUnavailable: (productId: string, city: string, adminEmail: string) => Promise<void>;
  markAvailable:   (productId: string, city: string, adminEmail: string) => Promise<void>;
  reload: () => Promise<void>;
}

const UnavailableContext = createContext<UnavailableContextType | null>(null);

export function UnavailableProvider({ children }: { children: React.ReactNode }) {
  const [unavailableEntries, setUnavailableEntries] = useState<UnavailableEntry[]>([]);

  const reload = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/admin/unavailable`, { signal: AbortSignal.timeout(6000) });
      if (resp.ok) {
        const data = await resp.json();
        setUnavailableEntries(data.unavailable ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => { reload(); }, []);

  const markUnavailable = useCallback(async (productId: string, city: string, adminEmail: string) => {
    const prev = unavailableEntries;
    setUnavailableEntries(entries =>
      entries.some(e => e.productId === productId && e.city === city)
        ? entries
        : [...entries, { productId, city }]
    );
    try {
      const resp = await fetch(`${API_BASE}/admin/mark-unavailable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, city, adminEmail }),
      });
      if (!resp.ok) setUnavailableEntries(prev);
    } catch { setUnavailableEntries(prev); }
  }, [unavailableEntries]);

  const markAvailable = useCallback(async (productId: string, city: string, adminEmail: string) => {
    const prev = unavailableEntries;
    setUnavailableEntries(entries => entries.filter(e => !(e.productId === productId && e.city === city)));
    try {
      const resp = await fetch(`${API_BASE}/admin/mark-unavailable/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail, city }),
      });
      if (!resp.ok) setUnavailableEntries(prev);
    } catch { setUnavailableEntries(prev); }
  }, [unavailableEntries]);

  const isUnavailable = useCallback((productId: string, city: string | null): boolean => {
    return unavailableEntries.some(e =>
      e.productId === productId && (e.city === city || e.city === "*")
    );
  }, [unavailableEntries]);

  return (
    <UnavailableContext.Provider value={{ unavailableEntries, isUnavailable, markUnavailable, markAvailable, reload }}>
      {children}
    </UnavailableContext.Provider>
  );
}

export function useUnavailable() {
  const ctx = useContext(UnavailableContext);
  if (!ctx) throw new Error("useUnavailable must be used within UnavailableProvider");
  return ctx;
}
