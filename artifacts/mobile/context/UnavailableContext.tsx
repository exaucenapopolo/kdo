import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_ORIGIN =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://kdo-api-server.vercel.app/api";

const API_BASE = API_ORIGIN.replace(/\/+$/, "").endsWith("/api")
  ? API_ORIGIN.replace(/\/+$/, "")
  : `${API_ORIGIN.replace(/\/+$/, "")}/api`;

const STORAGE_KEY = "@kdo/unavailable-products/v1";

export interface UnavailableEntry {
  productId: string;
  city: string;
}

interface UnavailableContextType {
  unavailableEntries: UnavailableEntry[];
  isUnavailable: (productId: string, city: string | null) => boolean;
  markUnavailable: (
    productId: string,
    city: string,
    adminEmail: string
  ) => Promise<void>;
  markAvailable: (
    productId: string,
    city: string,
    adminEmail: string
  ) => Promise<void>;
  reload: () => Promise<void>;
}

const UnavailableContext =
  createContext<UnavailableContextType | null>(null);

function normalizeCity(city: string | null | undefined): string {
  return String(city ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeProductId(productId: string | number): string {
  return String(productId).trim();
}

function normalizeEntry(entry: UnavailableEntry): UnavailableEntry {
  return {
    productId: normalizeProductId(entry.productId),
    city: String(entry.city ?? "").trim(),
  };
}

function normalizeEntries(value: unknown): UnavailableEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (
        entry
      ): entry is {
        productId: string | number;
        city: string;
      } =>
        Boolean(entry) &&
        typeof entry === "object" &&
        "productId" in entry &&
        "city" in entry
    )
    .map((entry) =>
      normalizeEntry({
        productId: String(entry.productId),
        city: String(entry.city),
      })
    )
    .filter(
      (entry) =>
        entry.productId.length > 0 &&
        entry.city.length > 0
    );
}

async function readLocalEntries(): Promise<UnavailableEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return normalizeEntries(JSON.parse(raw));
  } catch {
    return [];
  }
}

async function writeLocalEntries(
  entries: UnavailableEntry[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries.map(normalizeEntry))
    );
  } catch {
    // Le stockage local ne doit jamais empêcher l'application de fonctionner.
  }
}

export function UnavailableProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unavailableEntries, setUnavailableEntries] =
    useState<UnavailableEntry[]>([]);

  /**
   * Recharge d'abord le cache local pour que l'état soit immédiatement
   * disponible, même sans réseau.
   */
  useEffect(() => {
    let mounted = true;

    void readLocalEntries().then((entries) => {
      if (mounted && entries.length > 0) {
        setUnavailableEntries(entries);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const reload = useCallback(async () => {
    try {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 6000);

      try {
        const response = await fetch(
          `${API_BASE}/admin/unavailable`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (Array.isArray(data?.unavailable)) {
          const entries = normalizeEntries(
            data.unavailable
          );

          setUnavailableEntries(entries);
          await writeLocalEntries(entries);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch {
      /**
       * Important :
       * une panne réseau ne doit jamais effacer une indisponibilité
       * déjà mémorisée localement.
       */
    }
  }, []);

  /**
   * Au lancement :
   * 1. cache local
   * 2. serveur
   *
   * Puis resynchronisation à chaque retour au premier plan.
   */
  useEffect(() => {
    void reload();

    const handleAppStateChange = (
      state: AppStateStatus
    ) => {
      if (state === "active") {
        void reload();
      }
    };

    const subscription =
      AppState.addEventListener(
        "change",
        handleAppStateChange
      );

    return () => {
      subscription.remove();
    };
  }, [reload]);

  const markUnavailable = useCallback(
    async (
      productId: string,
      city: string,
      adminEmail: string
    ) => {
      const normalizedProductId =
        normalizeProductId(productId);

      const normalizedCity =
        city.trim();

      const previous =
        unavailableEntries;

      const nextEntries = unavailableEntries.some(
        (entry) =>
          normalizeProductId(entry.productId) ===
            normalizedProductId &&
          (
            normalizeCity(entry.city) ===
              normalizeCity(normalizedCity) ||
            normalizeCity(entry.city) === "*"
          )
      )
        ? unavailableEntries
        : [
            ...unavailableEntries,
            {
              productId: normalizedProductId,
              city: normalizedCity,
            },
          ];

      setUnavailableEntries(nextEntries);
      await writeLocalEntries(nextEntries);

      try {
        const response = await fetch(
          `${API_BASE}/admin/mark-unavailable`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              productId: normalizedProductId,
              city: normalizedCity,
              adminEmail,
            }),
          }
        );

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          setUnavailableEntries(previous);
          await writeLocalEntries(previous);
          return;
        }

        if (Array.isArray(data?.unavailable)) {
          const serverEntries =
            normalizeEntries(data.unavailable);

          setUnavailableEntries(serverEntries);
          await writeLocalEntries(serverEntries);
        } else {
          await reload();
        }
      } catch {
        setUnavailableEntries(previous);
        await writeLocalEntries(previous);
      }
    },
    [unavailableEntries, reload]
  );

  const markAvailable = useCallback(
    async (
      productId: string,
      city: string,
      adminEmail: string
    ) => {
      const normalizedProductId =
        normalizeProductId(productId);

      const normalizedCity =
        city.trim();

      const previous =
        unavailableEntries;

      const nextEntries =
        unavailableEntries.filter(
          (entry) => {
            const sameProduct =
              normalizeProductId(entry.productId) ===
              normalizedProductId;

            const sameCity =
              normalizeCity(entry.city) ===
              normalizeCity(normalizedCity);

            const globalCity =
              normalizeCity(entry.city) === "*";

            return !(
              sameProduct &&
              (sameCity || globalCity)
            );
          }
        );

      setUnavailableEntries(nextEntries);
      await writeLocalEntries(nextEntries);

      try {
        const response = await fetch(
          `${API_BASE}/admin/mark-unavailable/${encodeURIComponent(
            normalizedProductId
          )}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              adminEmail,
              city: normalizedCity,
            }),
          }
        );

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          setUnavailableEntries(previous);
          await writeLocalEntries(previous);
          return;
        }

        if (Array.isArray(data?.unavailable)) {
          const serverEntries =
            normalizeEntries(data.unavailable);

          setUnavailableEntries(serverEntries);
          await writeLocalEntries(serverEntries);
        } else {
          await reload();
        }
      } catch {
        setUnavailableEntries(previous);
        await writeLocalEntries(previous);
      }
    },
    [unavailableEntries, reload]
  );

  const isUnavailable = useCallback(
    (
      productId: string,
      city: string | null
    ): boolean => {
      const normalizedProductId =
        normalizeProductId(productId);

      const normalizedCity =
        normalizeCity(city);

      return unavailableEntries.some(
        (entry) => {
          if (
            normalizeProductId(entry.productId) !==
            normalizedProductId
          ) {
            return false;
          }

          const entryCity =
            normalizeCity(entry.city);

          return (
            entryCity === "*" ||
            entryCity === normalizedCity
          );
        }
      );
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
  const context =
    useContext(UnavailableContext);

  if (!context) {
    throw new Error(
      "useUnavailable must be used within UnavailableProvider"
    );
  }

  return context;
    }
