import React, { AppState, createContext, useCallback, useContext, useEffect, useState } from "react";

const DOMAIN = new URL(
  process.env.EXPO_PUBLIC_API_URL || "https://kdo-api-server.vercel.app/api"
).host;

const API_BASE = `https://${DOMAIN}/api`;

export interface UnavailableEntry {
  productId: string;
  city: string;
}

interface UnavailableContextType {
  unavailableEntries: UnavailableEntry[];
  isUnavailable: (productId: string, city: string | null) => boolean;
  markUnavailable: (productId: string, city: string, adminEmail: string) => Promise<void>;
  markAvailable: (productId: string, city: string, adminEmail: string) => Promise<void>;
  reload: () => Promise<void>;
}

const UnavailableContext = createContext<UnavailableContextType | null>(null);

const normalizeCity = (city: string | null | undefined): string =>
  String(city ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const normalizeProductId = (productId: string | number): string =>
  String(productId);

const normalizeEntries = (value: unknown): UnavailableEntry[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (entry): entry is { productId: string | number; city: string } =>
        !!entry &&
        typeof entry === "object" &&
        "productId" in entry &&
        "city" in entry
    )
    .map((entry) => ({
      productId: normalizeProductId(entry.productId),
      city: String(entry.city),
    }));
};

export function UnavailableProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unavailableEntries, setUnavailableEntries] = useState<UnavailableEntry[]>([]);

  const reload = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/admin/unavailable`, {
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      });

      if (!resp.ok) return;

      const data = await resp.json();

      if (Array.isArray(data?.unavailable)) {
        setUnavailableEntries(normalizeEntries(data.unavailable));
      }
    } catch {
      // Une erreur réseau ne doit pas effacer un état déjà chargé.
    }
  }, []);

  useEffect(() => {
    reload();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        reload();
      }
    });

    return () => subscription.remove();
  }, [reload]);

  const markUnavailable = useCallback(
    async (productId: string, city: string, adminEmail: string) => {
      const normalizedProductId = normalizeProductId(productId);
      const previous = unavailableEntries;

      setUnavailableEntries((entries) => {
        const exists = entries.some(
          (entry) =>
            normalizeProductId(entry.productId) === normalizedProductId &&
            (entry.city === "*" || normalizeCity(entry.city) === normalizeCity(city))
        );

        return exists
          ? entries
          : [...entries, { productId: normalizedProductId, city }];
      });

      try {
        const resp = await fetch(`${API_BASE}/admin/mark-unavailable`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: normalizedProductId,
            city,
            adminEmail,
          }),
        });

        const data = await resp.json().catch(() => null);

        if (!resp.ok) {
          setUnavailableEntries(previous);
          return;
        }

        if (Array.isArray(data?.unavailable)) {
          setUnavailableEntries(normalizeEntries(data.unavailable));
        }
      } catch {
        setUnavailableEntries(previous);
      }
    },
    [unavailableEntries]
  );

  const markAvailable = useCallback(
    async (productId: string, city: string, adminEmail: string) => {
      const normalizedProductId = normalizeProductId(productId);
      const previous = unavailableEntries;

      setUnavailableEntries((entries) =>
        entries.filter(
          (entry) =>
            !(
              normalizeProductId(entry.productId) === normalizedProductId &&
              (entry.city === "*" || normalizeCity(entry.city) === normalizeCity(city))
            )
        )
      );

      try {
        const resp = await fetch(
          `${API_BASE}/admin/mark-unavailable/${encodeURIComponent(normalizedProductId)}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminEmail, city }),
          }
        );

        const data = await resp.json().catch(() => null);

        if (!resp.ok) {
          setUnavailableEntries(previous);
          return;
        }

        if (Array.isArray(data?.unavailable)) {
          setUnavailableEntries(normalizeEntries(data.unavailable));
        }
      } catch {
        setUnavailableEntries(previous);
      }
    },
    [unavailableEntries]
  );

  const isUnavailable = useCallback(
    (productId: string, city: string | null): boolean => {
      const normalizedProductId = normalizeProductId(productId);
      const normalizedCity = normalizeCity(city);

      return unavailableEntries.some((entry) => {
        if (normalizeProductId(entry.productId) !== normalizedProductId) {
          return false;
        }

        return (
          entry.city === "*" ||
          normalizeCity(entry.city) === normalizedCity
        );
      });
    },
    [unavailableEntries]
  );

  return (
    <UnavailableContext.Provider
      value={{
        unavailableEntries,
        isUnavailable,
        markUnavailable,
        markAvailable,
        reload,
      }}
    >
      {children}
    </UnavailableContext.Provider>
  );
}

export function useUnavailable() {
  const ctx = useContext(UnavailableContext);
  if (!ctx) {
    throw new Error("useUnavailable must be used within UnavailableProvider");
  }
  return ctx;
}
