import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Feather } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { useEffect } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { BOUTIQUE_CITIES, CityProvider, useCity } from "@/context/CityContext";
import { UnavailableProvider } from "@/context/UnavailableContext";
import { UserDataProvider } from "@/context/UserDataContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function CityPickerModal() {
  const { isPickerOpen, closePicker, setCity, selectedCity } = useCity();
  const insets = useSafeAreaInsets();

  const CITY_INFO: Record<string, string> = {
    "Yaoundé":    "165 produits disponibles",
    "Douala":     "165 produits disponibles",
    "Bafoussam":  "120 produits disponibles",
    "Bertoua":    "95 produits disponibles",
    "Dschang":    "85 produits disponibles",
    "Maroua":     "75 produits disponibles",
    "Garoua":     "75 produits disponibles",
    "Ngaoundéré": "65 produits disponibles",
  };

  return (
    <Modal visible={isPickerOpen} transparent animationType="slide" statusBarTranslucent>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={selectedCity ? closePicker : undefined}
      >
        <TouchableOpacity activeOpacity={1} style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Feather name="map-pin" size={22} color="#FF6B00" />
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>Votre ville</Text>
              <Text style={styles.sheetSub}>Sélectionnez votre ville pour voir les produits disponibles</Text>
            </View>
            {selectedCity && (
              <TouchableOpacity onPress={closePicker} style={styles.closeBtn}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {BOUTIQUE_CITIES.map(city => {
              const active = selectedCity === city;
              return (
                <TouchableOpacity
                  key={city}
                  style={[styles.cityRow, active && styles.cityRowActive]}
                  onPress={() => setCity(city)}
                >
                  <View style={[styles.cityDot, active && styles.cityDotActive]}>
                    <Feather name="map-pin" size={14} color={active ? "#fff" : "#FF6B00"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cityName, active && styles.cityNameActive]}>{city}</Text>
                    <Text style={styles.cityInfo}>{CITY_INFO[city] ?? ""}</Text>
                  </View>
                  {active && <Feather name="check-circle" size={20} color="#FF6B00" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function RootLayoutNav() {
  return (
    <>
      <CityPickerModal />
      <Stack screenOptions={{ headerBackTitle: "Retour" }}>
        <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false, presentation: "card" }} />
        <Stack.Screen name="contact"      options={{ headerShown: false }} />
        <Stack.Screen name="privacy"      options={{ headerShown: false }} />
        <Stack.Screen name="terms"        options={{ headerShown: false }} />
        <Stack.Screen name="auth/login"   options={{ headerShown: false, presentation: "fullScreenModal", animation: "fade" }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false, presentation: "card" }} />
        <Stack.Screen name="admin"         options={{ headerShown: false, presentation: "card" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <CityProvider>
            <AuthProvider>
              <UserDataProvider>
                <UnavailableProvider>
                  <CartProvider>
                  <GestureHandlerRootView>
                    <KeyboardProvider>
                      <RootLayoutNav />
                    </KeyboardProvider>
                  </GestureHandlerRootView>
                </CartProvider>
                </UnavailableProvider>
              </UserDataProvider>
            </AuthProvider>
          </CityProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sheetTitle: { fontSize: 17, fontWeight: "700", color: "#1A1A1A" },
  sheetSub: { fontSize: 12, color: "#888", marginTop: 2 },
  closeBtn: { padding: 4 },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  cityRowActive: { backgroundColor: "#FFF3E0" },
  cityDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFD0A0",
  },
  cityDotActive: { backgroundColor: "#FF6B00", borderColor: "#FF6B00" },
  cityName: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
  cityNameActive: { color: "#FF6B00" },
  cityInfo: { fontSize: 11, color: "#999", marginTop: 1 },
});
