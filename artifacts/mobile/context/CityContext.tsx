import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export const BOUTIQUE_CITIES = [
  "Yaoundé", "Douala", "Bafoussam", "Bertoua", "Dschang", "Maroua", "Garoua", "Ngaoundéré",
];

interface CityContextType {
  selectedCity: string | null;
  setCity: (city: string) => Promise<void>;
  isCitySelected: boolean;
  isLoading: boolean;
  isPickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
}

const CityContext = createContext<CityContextType | null>(null);
const CITY_KEY = "@kdo_selected_city";

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CITY_KEY)
      .then(v => { if (v && BOUTIQUE_CITIES.includes(v)) setSelectedCity(v); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoading && !selectedCity) setIsPickerOpen(true);
  }, [isLoading, selectedCity]);

  const setCity = useCallback(async (city: string) => {
    setSelectedCity(city);
    setIsPickerOpen(false);
    try { await AsyncStorage.setItem(CITY_KEY, city); } catch {}
  }, []);

  const openPicker  = useCallback(() => setIsPickerOpen(true),  []);
  const closePicker = useCallback(() => setIsPickerOpen(false), []);

  return (
    <CityContext.Provider value={{
      selectedCity, setCity,
      isCitySelected: !!selectedCity,
      isLoading, isPickerOpen, openPicker, closePicker,
    }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
