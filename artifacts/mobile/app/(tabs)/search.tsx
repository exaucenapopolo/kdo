import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductCard } from "@/components/ProductCard";
import { useCity } from "@/context/CityContext";
import { getProductsForCity } from "@/data/products";

const SUGGESTIONS = ["Dell Latitude", "HP EliteBook", "Samsung Galaxy", "Clé USB 64Go", "Antivirus Kaspersky", "Souris sans fil", "Modem WiFi"];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedCity } = useCity();
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const topPad = Platform.OS === "web" ? 10 : insets.top;

  const cityProducts = getProductsForCity(selectedCity);
  const results = query.trim().length >= 2
    ? cityProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.shortSpecs || "").toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      {/* Header recherche */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchWrap}>
          <Feather name="search" size={15} color="#888" />
          <TextInput
            ref={inputRef}
            autoFocus
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={15} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.trim().length < 2 ? (
        /* Suggestions */
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>Recherches populaires</Text>
          <View style={styles.suggestionsList}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity
                key={s}
                style={styles.suggestionChip}
                onPress={() => setQuery(s)}
              >
                <Feather name="search" size={13} color="#888" />
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        /* Résultats */
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 10, paddingBottom: Platform.OS === "web" ? 100 : 90 }}
          columnWrapperStyle={{ gap: 8, marginBottom: 10 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>
                {results.length === 0
                  ? "Aucun résultat"
                  : `${results.length} résultat${results.length > 1 ? "s" : ""} pour "${query}"`}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="search" size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
              <Text style={styles.emptySub}>Essayez un autre mot-clé</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard product={item} style={{ flex: 1 }} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 36,
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 13, color: "#333" },
  suggestionsSection: { padding: 16 },
  suggestionsTitle: { fontSize: 13, fontWeight: "700", color: "#333", marginBottom: 12 },
  suggestionsList: { gap: 8 },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  suggestionText: { fontSize: 13, color: "#444" },
  resultHeader: { paddingBottom: 8 },
  resultCount: { fontSize: 12, color: "#888" },
  empty: { alignItems: "center", paddingTop: 50, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#888" },
  emptySub: { fontSize: 12, color: "#aaa" },
});
