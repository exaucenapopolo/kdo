import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiPost, apiGet, apiPut } from "../utils/api";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoURL?: string;
  whatsapp?: string;
  points?: number;
  createdAt: string;
}

const ADMIN_EMAILS = ["exaucenapopolo2@gmail.com", "mcexauofficiel@gmail.com"];
const AUTH_KEY    = "@kdo_auth_user";
const TOKEN_KEY   = "@kdo_auth_token";

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authToken: string | null;
  register: (data: { name: string; phone: string; email?: string; whatsapp?: string }) => Promise<void>;
  login: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<AuthUser, "name" | "phone" | "email" | "photoURL" | "whatsapp">>) => Promise<void>;
  refreshFromServer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from AsyncStorage then sync from server
  useEffect(() => {
    (async () => {
      try {
        const [rawUser, token] = await Promise.all([
          AsyncStorage.getItem(AUTH_KEY),
          AsyncStorage.getItem(TOKEN_KEY),
        ]);
        if (rawUser) setUser(JSON.parse(rawUser));
        if (token) {
          setAuthToken(token);
          // Refresh from server in background
          try {
            const res = await apiGet("/users/me", token);
            if (res?.user) {
              const serverUser: AuthUser = {
                id:        res.user.id,
                name:      res.user.name,
                phone:     res.user.phone,
                email:     res.user.email   ?? undefined,
                photoURL:  res.user.photoURL ?? undefined,
                whatsapp:  res.user.whatsapp ?? undefined,
                points:    res.user.points   ?? 0,
                createdAt: res.user.createdAt,
              };
              setUser(serverUser);
              await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(serverUser));
            }
          } catch (_) {}
        }
      } catch (_) {}
      setIsLoading(false);
    })();
  }, []);

  const isAdmin = ADMIN_EMAILS.includes(user?.email ?? "");

  // Sync user to server and store token locally
  const syncToServer = useCallback(async (userData: { name: string; phone: string; email?: string; whatsapp?: string }) => {
    try {
      const res = await apiPost("/users/sync", {
        phone:    userData.phone,
        name:     userData.name,
        email:    userData.email,
        whatsapp: userData.whatsapp,
      });
      if (res?.user && res?.token) {
        const serverUser: AuthUser = {
          id:        res.user.id,
          name:      res.user.name,
          phone:     res.user.phone,
          email:     res.user.email   ?? undefined,
          photoURL:  res.user.photoURL ?? undefined,
          whatsapp:  res.user.whatsapp ?? undefined,
          points:    res.user.points   ?? 0,
          createdAt: res.user.createdAt,
        };
        await AsyncStorage.setItem(TOKEN_KEY, res.token);
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(serverUser));
        setAuthToken(res.token);
        setUser(serverUser);
        return serverUser;
      }
    } catch (_) {}
    return null;
  }, []);

  const register = useCallback(async (data: { name: string; phone: string; email?: string; whatsapp?: string }) => {
    // Create locally first (instant UX)
    const localUser: AuthUser = {
      id:        Date.now().toString(),
      name:      data.name.trim(),
      phone:     data.phone.trim(),
      email:     data.email?.trim() || undefined,
      whatsapp:  data.whatsapp?.trim() || undefined,
      points:    0,
      createdAt: new Date().toISOString(),
    };
    setUser(localUser);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(localUser));
    // Then sync to server (background, updates with real server ID + token)
    syncToServer(data).catch(() => {});
  }, [syncToServer]);

  // Login by phone: re-sync profile from server
  const login = useCallback(async (phone: string) => {
    const res = await apiPost("/users/sync", { phone, name: "Client KDO" });
    if (!res?.user || !res?.token) throw new Error("Compte introuvable pour ce numéro.");
    const serverUser: AuthUser = {
      id:        res.user.id,
      name:      res.user.name,
      phone:     res.user.phone,
      email:     res.user.email   ?? undefined,
      photoURL:  res.user.photoURL ?? undefined,
      whatsapp:  res.user.whatsapp ?? undefined,
      points:    res.user.points   ?? 0,
      createdAt: res.user.createdAt,
    };
    await AsyncStorage.setItem(TOKEN_KEY, res.token);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(serverUser));
    setAuthToken(res.token);
    setUser(serverUser);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.multiRemove([AUTH_KEY, TOKEN_KEY]);
  }, []);

  const updateProfile = useCallback(async (data: Partial<Pick<AuthUser, "name" | "phone" | "email" | "photoURL" | "whatsapp">>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    // Sync to server
    if (authToken) {
      try {
        const res = await apiPut("/users/me", {
          name:     data.name,
          phone:    data.phone,
          email:    data.email,
          whatsapp: data.whatsapp,
          photoUrl: data.photoURL,
        }, authToken);
        if (res?.user) {
          const serverUser = { ...updated, ...res.user };
          setUser(serverUser);
          await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(serverUser));
        }
      } catch (_) {}
    } else {
      // No token yet — try to get one
      syncToServer({ name: updated.name, phone: updated.phone, email: updated.email, whatsapp: updated.whatsapp }).catch(() => {});
    }
  }, [user, authToken, syncToServer]);

  const refreshFromServer = useCallback(async () => {
    if (!authToken) return;
    try {
      const res = await apiGet("/users/me", authToken);
      if (res?.user) {
        const serverUser: AuthUser = {
          id:        res.user.id,
          name:      res.user.name,
          phone:     res.user.phone,
          email:     res.user.email   ?? undefined,
          photoURL:  res.user.photoURL ?? undefined,
          whatsapp:  res.user.whatsapp ?? undefined,
          points:    res.user.points   ?? 0,
          createdAt: res.user.createdAt,
        };
        setUser(serverUser);
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(serverUser));
      }
    } catch (_) {}
  }, [authToken]);

  return (
    <AuthContext.Provider value={{
      user, firebaseUser: null, isLoading,
      isAuthenticated: !!user,
      isAdmin,
      authToken,
      register, login, logout, updateProfile, refreshFromServer,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
