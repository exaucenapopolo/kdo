import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";
import { useCity } from "@/context/CityContext";

const LOGO = "https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/logos.png";

interface Props {
  title?: string;
  showSearch?: boolean;
  showCart?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export function AppHeader({
  title,
  showSearch = true,
  showCart = true,
  showBack = false,
  onBack,
  rightElement,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { itemCount } = useCart();
  const { selectedCity, openPicker } = useCity();
  const topPad = Platform.OS === "web" ? 10 : insets.top;

  return (
    <View style={[styles.header, { paddingTop: topPad + 4 }]}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onBack ?? (() => router.back())}>
            <Feather name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
        ) : (
          <Image source={{ uri: LOGO }} style={styles.logo} resizeMode="contain" />
        )}

        {title ? (
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        ) : (
          <TouchableOpacity style={styles.cityPill} onPress={openPicker} activeOpacity={0.75}>
            <Feather name="map-pin" size={11} color="#FF6B00" />
            <Text style={styles.cityText} numberOfLines={1}>
              {selectedCity ?? "Choisir ma ville"}
            </Text>
            <Feather name="chevron-down" size={11} color="#FF6B00" />
          </TouchableOpacity>
        )}

        <View style={styles.right}>
          {rightElement}
          {showSearch && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/(tabs)/search" as any)}
            >
              <Feather name="search" size={20} color="#333" />
            </TouchableOpacity>
          )}
          {showCart && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/(tabs)/cart" as any)}
            >
              <Feather name="shopping-cart" size={20} color="#333" />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount > 99 ? "99+" : itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 36,
  },
  logo: {
    width: 90,
    height: 34,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  cityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFD0A0",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: 160,
  },
  cityText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B00",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 2,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
});
