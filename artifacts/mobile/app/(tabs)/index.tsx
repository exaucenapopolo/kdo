import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard } from "@/components/ProductCard";
import { PromoBar } from "@/components/PromoBar";
import { useCity } from "@/context/CityContext";
import { CATEGORIES, REAL_PROMOS, getByCategoryForCity } from "@/data/products";

const HOME_SECTIONS = [
  { id: "ordinateurs", label: "Ordinateurs Portables" },
  { id: "phones",      label: "Téléphones" },
  { id: "desktops",    label: "Ordinateurs de Bureau" },
  { id: "disques",     label: "Disques Durs" },
  { id: "souris",      label: "Souris" },
  { id: "modems",      label: "Modems / WiFi" },
  { id: "projecteurs", label: "Projecteurs" },
  { id: "usb",         label: "Clés USB" },
  { id: "antivirus",   label: "Antivirus" },
  { id: "adaptateurs", label: "Adaptateurs" },
  { id: "sacs",        label: "Sacs & Étuis" },
  { id: "claviers",    label: "Claviers" },
  { id: "chargeurs",   label: "Chargeurs" },
  { id: "ram",         label: "RAM" },
  { id: "televisions", label: "Télévisions" },
];

const ITEMS_PER_ROW = 6;

export default function HomeScreen() {
  const router = useRouter();
  const { selectedCity } = useCity();

  return (
    <View style={styles.root}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}
      >
        <PromoBar />
        <HeroBanner />

        {/* Catégories pills */}
        <View style={styles.catBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catChip}
                onPress={() =>
                  router.push({ pathname: "/(tabs)/categories", params: { cat: cat.id } } as any)
                }
              >
                <Feather name={cat.icon as any} size={13} color="#FF6B00" />
                <Text style={styles.catLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Promotions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Feather name="zap" size={16} color="#FF4D4F" />
              <Text style={styles.sectionTitle}> Promotions en Cours</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/promos" as any)}>
              <Text style={styles.seeAll}>Voir plus →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {REAL_PROMOS.filter(p => {
              const cities = (p as any).cities as string[] | undefined;
              return !cities || !selectedCity || cities.includes(selectedCity);
            }).map(p => (
              <ProductCard key={p.id} product={p as any} compact style={styles.hCard} />
            ))}
          </ScrollView>
        </View>

        {/* Sections par catégorie — filtrées par ville */}
        {HOME_SECTIONS.map(section => {
          const products = getByCategoryForCity(section.id, selectedCity).slice(0, ITEMS_PER_ROW);
          if (products.length === 0) return null;
          return (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.label}</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/(tabs)/categories", params: { cat: section.id } } as any)
                  }
                >
                  <Text style={styles.seeAll}>Voir plus →</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
                {products.map(p => (
                  <ProductCard key={p.id} product={p} compact style={styles.hCard} />
                ))}
              </ScrollView>
            </View>
          );
        })}

        {/* Bannière boutiques */}
        <TouchableOpacity
          style={styles.boutiquesBanner}
          onPress={() => router.push("/(tabs)/boutiques" as any)}
        >
          <Feather name="map-pin" size={22} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.boutiquesTitle}>Nos Boutiques</Text>
            <Text style={styles.boutiquesSub}>8 villes au Cameroun · Yaoundé · Douala · Bafoussam…</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Services */}
        <View style={styles.servicesRow}>
          {[
            { icon: "shield",       label: "Garantie" },
            { icon: "truck",        label: "Livraison" },
            { icon: "rotate-ccw",   label: "Retour 7j" },
            { icon: "phone",        label: "Support" },
          ].map(s => (
            <View key={s.label} style={styles.serviceItem}>
              <View style={styles.serviceIcon}>
                <Feather name={s.icon as any} size={18} color="#FF6B00" />
              </View>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  catBar: {
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 8,
  },
  catList: { paddingHorizontal: 12, gap: 8 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  catLabel: { fontSize: 11, color: "#333", fontWeight: "500" },

  section: { marginTop: 14 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#333" },
  seeAll: { fontSize: 12, color: "#FF6B00", fontWeight: "600" },

  hList: { paddingHorizontal: 12, gap: 8, paddingBottom: 4 },
  hCard: { width: 160 },

  boutiquesBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 12,
    marginTop: 16,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    padding: 14,
  },
  boutiquesTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  boutiquesSub: { color: "rgba(255,255,255,0.88)", fontSize: 11, marginTop: 2 },

  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
    padding: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  serviceItem: { alignItems: "center", gap: 6 },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceLabel: { fontSize: 10, color: "#666", textAlign: "center" },
});
