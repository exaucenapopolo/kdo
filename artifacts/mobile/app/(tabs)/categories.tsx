import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ProductCard } from "@/components/ProductCard";
import { useCity } from "@/context/CityContext";
import { CATEGORIES, getByCategoryForCity } from "@/data/products";

const CAT_COLORS: Record<string, string> = {
  all:         "#FF6B00",
  ordinateurs: "#0066CC",
  phones:      "#7C3AED",
  desktops:    "#0066CC",
  disques:     "#059669",
  souris:      "#DC2626",
  claviers:    "#D97706",
  modems:      "#0891B2",
  projecteurs: "#7C3AED",
  usb:         "#DB2777",
  antivirus:   "#DC2626",
  adaptateurs: "#059669",
  sacs:        "#92400E",
  chargeurs:   "#FF6B00",
  ram:         "#0066CC",
  televisions: "#1D4ED8",
};

const CAT_ICONS: Record<string, string> = {
  all:         "grid",
  ordinateurs: "monitor",
  phones:      "smartphone",
  desktops:    "monitor",
  disques:     "hard-drive",
  souris:      "mouse-pointer",
  claviers:    "type",
  modems:      "wifi",
  projecteurs: "tv",
  usb:         "save",
  antivirus:   "shield",
  adaptateurs: "zap",
  sacs:        "briefcase",
  chargeurs:   "battery-charging",
  ram:         "server",
  televisions: "tv",
};

export default function CategoriesScreen() {
  const { cat } = useLocalSearchParams<{ cat?: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(cat || "all");
  const { selectedCity } = useCity();

  useEffect(() => {
    if (cat) setActiveCategory(cat);
  }, [cat]);

  const products = getByCategoryForCity(activeCategory, selectedCity);
  const filtered = search.length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.shortSpecs || "").toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);
  const color = CAT_COLORS[activeCategory] ?? "#FF6B00";

  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }).start();
  }, [activeCategory]);

  return (
    <View style={styles.root}>
      {/* En-tête professionnel coloré */}
      <Animated.View style={[styles.header, { backgroundColor: color, opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerIconWrap}>
            <Feather name={CAT_ICONS[activeCategory] as any ?? "grid"} size={20} color={color} />
          </View>
          <View>
            <Text style={styles.headerTitle}>{activeCat?.label ?? "Catalogue"}</Text>
            <Text style={styles.headerSub}>{filtered.length} produit{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.searchIconBtn} onPress={() => {}}>
          <Feather name="search" size={18} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Barre de recherche */}
      <View style={[styles.searchBar, { borderColor: `${color}44` }]}>
        <Feather name="search" size={14} color={color} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Rechercher dans ${activeCat?.label ?? "les produits"}…`}
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x-circle" size={16} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Catégories pills horizontaux */}
      <View style={styles.catBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(c => {
            const catColor = CAT_COLORS[c.id] ?? "#FF6B00";
            const isActive = activeCategory === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => { setActiveCategory(c.id); setSearch(""); }}
                style={[styles.catChip, isActive && { backgroundColor: catColor, borderColor: catColor }]}
              >
                <Feather name={c.icon as any} size={12} color={isActive ? "#fff" : catColor} />
                <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Grille produits */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 10, paddingBottom: Platform.OS === "web" ? 100 : 90 }}
        columnWrapperStyle={{ gap: 8, marginBottom: 10 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          filtered.length > 0 ? (
            <View style={[styles.listHeader, { borderLeftColor: color }]}>
              <Feather name={CAT_ICONS[activeCategory] as any ?? "grid"} size={13} color={color} />
              <Text style={[styles.listHeaderText, { color }]}>
                {" "}{activeCat?.label ?? "Tous les produits"}
              </Text>
              <Text style={styles.listHeaderCount}> · {filtered.length} résultats</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: `${color}18` }]}>
              <Feather name="package" size={40} color={color} />
            </View>
            <Text style={styles.emptyTitle}>
              {search ? "Aucun résultat" : "Aucun produit"}
            </Text>
            <Text style={styles.emptyText}>
              {search
                ? `Aucun produit ne correspond à "${search}"`
                : "Cette catégorie sera bientôt disponible"}
            </Text>
            {search.length > 0 && (
              <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: color }]} onPress={() => setSearch("")}>
                <Text style={styles.emptyBtnText}>Effacer la recherche</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <ProductCard product={item} style={{ flex: 1 }} animDelay={index * 30} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6FA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "web" ? 14 : 50,
    paddingBottom: 14,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 11 },
  searchIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 13, color: "#333" },

  catBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EBEBEB",
    paddingVertical: 8,
    marginBottom: 2,
  },
  catList: { paddingHorizontal: 12, gap: 8 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F5F5F5",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  catLabel: { fontSize: 11, color: "#555", fontWeight: "600" },
  catLabelActive: { color: "#fff", fontWeight: "700" },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 3,
    paddingLeft: 8,
    marginBottom: 10,
    marginLeft: 2,
  },
  listHeaderText: { fontSize: 14, fontWeight: "800" },
  listHeaderCount: { fontSize: 12, color: "#888", fontWeight: "500" },

  empty: { alignItems: "center", paddingTop: 50, gap: 12, paddingHorizontal: 20 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#333" },
  emptyText: { fontSize: 13, color: "#888", textAlign: "center", lineHeight: 18 },
  emptyBtn: { borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10, marginTop: 4 },
  emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
