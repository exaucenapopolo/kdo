import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";

const API_ORIGIN =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://kdo-api-server.vercel.app/api";

const API_BASE = API_ORIGIN.replace(/\/+$/, "").endsWith("/api")
  ? API_ORIGIN.replace(/\/+$/, "")
  : `${API_ORIGIN.replace(/\/+$/, "")}/api`;

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

/**
 * Normalise une ville pour éviter les problèmes de :
 * - majuscules/minuscules
 * - accents
 * - espaces accidentels
 */
function normalizeCity(city: string | null | undefined): string {
  return String(city ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Les IDs de produits doivent rester identiques à leur valeur serveur,
 * mais on retire les espaces accidentels.
 */
function normalizeProductId(productId: string | number): string {
  return String(productId).trim();
}

/**
 * Transforme proprement la réponse API en tableau exploitable.
 */
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
    .map((entry) => ({
      productId: normalizeProductId(entry.productId),
      city: String(entry.city ?? "").trim(),
    }))
    .filter((entry) => entry.productId.length > 0 && entry.city.length > 0);
}

export function UnavailableProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unavailableEntries, setUnavailableEntries] = useState<
    UnavailableEntry[]
  >([]);

  /**
   * Recharge la source de vérité du serveur.
   *
   * Important :
   * une erreur réseau ne vide PAS la liste déjà connue.
   */
  const reload = useCallback(async () => {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 6000);

      try {
        const response = await fetch(`${API_BASE}/admin/unavailable`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (Array.isArray(data?.unavailable)) {
          setUnavailableEntries(
            normalizeEntries(data.unavailable)
          );
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      /**
       * Ne rien faire :
       * l'état précédent reste affiché si Internet/API est temporairement
       * indisponible.
       */
    }
  }, []);

  /**
   * Chargement initial + synchronisation lorsque l'app revient
   * au premier plan.
   */
  useEffect(() => {
    void reload();

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        void reload();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [reload]);

  /**
   * Marquer un produit comme indisponible.
   *
   * L'interface est immédiatement mise à jour.
   * Si le serveur refuse l'opération, on restaure l'état précédent.
   */
  const markUnavailable = useCallback(
    async (
      productId: string,
      city: string,
      adminEmail: string
    ) => {
      const normalizedProductId =
        normalizeProductId(productId);
      const normalizedCity = normalizeCity(city);

      const previousEntries = unavailableEntries;

      setUnavailableEntries((entries) => {
        const alreadyExists = entries.some(
          (entry) =>
            normalizeProductId(entry.productId) ===
              normalizedProductId &&
            (normalizeCity(entry.city) === normalizedCity ||
              normalizeCity(entry.city) === "*")
        );

        if (alreadyExists) {
          return entries;
        }

        return [
          ...entries,
          {
            productId: normalizedProductId,
            city: city.trim(),
          },
        ];
      });

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
              city: city.trim(),
              adminEmail,
            }),
          }
        );

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          setUnavailableEntries(previousEntries);
          return;
        }

        /**
         * Après succès, le serveur devient la source de vérité.
         */
        if (Array.isArray(data?.unavailable)) {
          setUnavailableEntries(
            normalizeEntries(data.unavailable)
          );
        }
      } catch {
        setUnavailableEntries(previousEntries);
      }
    },
    [unavailableEntries]
  );

  /**
   * Remettre un produit disponible.
   *
   * Même logique :
   * suppression immédiate dans l'interface,
   * puis rollback si le serveur refuse.
   */
  const markAvailable = useCallback(
    async (
      productId: string,
      city: string,
      adminEmail: string
    ) => {
      const normalizedProductId =
        normalizeProductId(productId);
      const normalizedCity = normalizeCity(city);

      const previousEntries = unavailableEntries;

      setUnavailableEntries((entries) =>
        entries.filter((entry) => {
          const sameProduct =
            normalizeProductId(entry.productId) ===
            normalizedProductId;

          const sameCity =
            normalizeCity(entry.city) === normalizedCity;

          const globalUnavailable =
            normalizeCity(entry.city) === "*";

          /**
           * On ne retire que l'indisponibilité correspondant
           * au produit + à la ville demandée.
           */
          return !(
            sameProduct &&
            (sameCity || globalUnavailable)
          );
        })
      );

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
              city: city.trim(),
            }),
          }
        );

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          setUnavailableEntries(previousEntries);
          return;
        }

        /**
         * Le serveur reste la source de vérité après succès.
         */
        if (Array.isArray(data?.unavailable)) {
          setUnavailableEntries(
            normalizeEntries(data.unavailable)
          );
        }
      } catch {
        setUnavailableEntries(previousEntries);
      }
    },
    [unavailableEntries]
  );

  /**
   * Détermine si un produit est indisponible pour une ville.
   *
   * Une entrée "*" signifie indisponible dans toutes les villes.
   */
  const isUnavailable = useCallback(
    (
      productId: string,
      city: string | null
    ): boolean => {
      const normalizedProductId =
        normalizeProductId(productId);

      const normalizedCity =
        normalizeCity(city);

      return unavailableEntries.some((entry) => {
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
  const context = useContext(UnavailableContext);

  if (!context) {
    throw new Error(
      "useUnavailable must be used within UnavailableProvider"
    );
  }

  return context;
      }
