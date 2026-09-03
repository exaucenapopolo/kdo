import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";
import { useCity } from "@/context/CityContext";
import { REAL_PROMOS, formatPrice, getDiscount } from "@/data/products";

const ALL_CITIES = ["Yaoundé", "Douala", "Bafoussam", "Bertoua", "Dschang", "Maroua", "Garoua", "Ngaoundéré"];

export default function PromosScreen() {
  const router = useRouter();
  const { addItem, items } = useCart();
  const { selectedCity } = useCity();
  const insets = useSafeAreaInsets();

  const [filterCity, setFilterCity] = useState<string | null>(selectedCity);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const visiblePromos = REAL_PROMOS.map(p => {
    const cities: string[] | undefined = (p as any).cities;
    const availableHere = !cities || !filterCity || cities.includes(filterCity);
    return { ...p, cities, availableHere };
  });

  const availableCount = visiblePromos.filter(p => p.availableHere).length;

  return (
    <View style={s.root}>
      {/* ─── HEADER ────────────────────────────────────────────────────────────── */}
      <View style={[s.header, { paddingTop: Platform.OS === "web" ? 16 : insets.top + 10 }]}>
        <View style={s.headerTopRow}>
          <View>
            <Text style={s.headerTitle}>Promotions</Text>
            <Text style={s.headerSub}>
              {availableCount} offre{availableCount > 1 ? "s" : ""} · Stocks limités
            </Text>
          </View>
          <View style={s.urgencyBadge}>
            <View style={s.urgencyDot} />
            <Text style={s.urgencyTxt}>En cours</Text>
          </View>
        </View>

        <View style={s.bannerStrip}>
          <Feather name="zap" size={11} color="#FF6B00" />
          <Text style={s.bannerTxt} numberOfLines={1}>
            {"  "}Jusqu'à -56% · Livraison dans tout le Cameroun · Garantie incluse{"  "}
          </Text>
        </View>

        {/* Filtre ville */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          <TouchableOpacity
            style={[s.chip, !filterCity && s.chipActive]}
            onPress={() => setFilterCity(null)}
          >
            <Text style={[s.chipTxt, !filterCity && s.chipTxtActive]}>Toutes les villes</Text>
          </TouchableOpacity>
          {ALL_CITIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.chip, filterCity === c && s.chipActive]}
              onPress={() => setFilterCity(filterCity === c ? null : c)}
            >
              <Text style={[s.chipTxt, filterCity === c && s.chipTxtActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ─── LISTE ─────────────────────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
      >
        {visiblePromos.map(promo => {
          const inCart = items.find(i => i.id === promo.id);
          const discount = promo.originalPrice ? getDiscount(promo.price, promo.originalPrice) : 0;
          const savings  = promo.originalPrice ? promo.originalPrice - promo.price : 0;

          return (
            <PromoCard
              key={promo.id}
              promo={promo as any}
              inCart={!!inCart}
              inCartQty={inCart?.quantity ?? 0}
              discount={discount}
              savings={savings}
              available={promo.availableHere}
              filterCity={filterCity}
              onZoom={() => setZoomImg((promo as any).image ?? null)}
              onCart={() =>
                addItem({
                  id: promo.id,
                  name: promo.name,
                  price: promo.price,
                  originalPrice: promo.originalPrice,
                  category: promo.category,
                  image: (promo as any).image,
                })
              }
              onDetail={() =>
                router.push({ pathname: "/product/[id]", params: { id: promo.id } } as any)
              }
            />
          );
        })}

        {/* Footer engagements */}
        <View style={s.engagements}>
          <Text style={s.engagementsTitle}>Nos engagements</Text>
          <View style={s.engagementsGrid}>
            {[
              { icon: "shield",     txt: "Garantie incluse" },
              { icon: "truck",      txt: "Livraison Cameroun" },
              { icon: "rotate-ccw", txt: "Retour 7 jours" },
              { icon: "check-circle", txt: "Produits testés" },
            ].map(g => (
              <View key={g.txt} style={s.engItem}>
                <View style={s.engIcon}>
                  <Feather name={g.icon as any} size={14} color="#FF6B00" />
                </View>
                <Text style={s.engTxt}>{g.txt}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal zoom */}
      <Modal visible={!!zoomImg} transparent animationType="fade" onRequestClose={() => setZoomImg(null)}>
        <TouchableOpacity style={s.zoomOverlay} activeOpacity={1} onPress={() => setZoomImg(null)}>
          <Image source={{ uri: zoomImg ?? "" }} style={s.zoomImg} resizeMode="contain" />
          <TouchableOpacity style={s.zoomClose} onPress={() => setZoomImg(null)}>
            <Feather name="x" size={18} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ─── CARTE PROMO ──────────────────────────────────────────────────────────────
interface CardProps {
  promo: any;
  inCart: boolean;
  inCartQty: number;
  discount: number;
  savings: number;
  available: boolean;
  filterCity: string | null;
  onZoom: () => void;
  onCart: () => void;
  onDetail: () => void;
}

function PromoCard({ promo, inCart, inCartQty, discount, savings, available, filterCity, onZoom, onCart, onDetail }: CardProps) {
  const specs: { label: string; value: string }[] = promo.specs ?? [];

  return (
    <View style={[s.card, !available && s.cardUnavailable]}>
      {/* Badge réduction */}
      {discount > 0 && (
        <View style={s.discountBadge}>
          <Text style={s.discountTxt}>-{discount}%</Text>
        </View>
      )}

      {/* Contenu horizontal */}
      <TouchableOpacity style={s.cardInner} activeOpacity={0.95} onPress={onDetail}>
        {/* Image */}
        <TouchableOpacity style={s.imgWrap} onPress={onZoom} activeOpacity={0.85}>
          <Image
            source={{ uri: promo.image }}
            style={[s.img, !available && s.imgGray]}
            resizeMode="cover"
          />
          <View style={s.zoomHint}>
            <Feather name="zoom-in" size={10} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Infos */}
        <View style={s.info}>
          {/* Catégorie + marque */}
          <View style={s.tagRow}>
            <View style={s.categoryTag}>
              <Text style={s.categoryTxt}>{promo.category}</Text>
            </View>
            {promo.brand && (
              <View style={s.brandTag}>
                <Text style={s.brandTxt}>{promo.brand}</Text>
              </View>
            )}
          </View>

          {/* Nom */}
          <Text style={[s.name, !available && s.nameGray]} numberOfLines={2}>
            {promo.name}
          </Text>

          {/* Prix */}
          <View style={s.priceRow}>
            <Text style={[s.price, !available && s.priceGray]}>
              {formatPrice(promo.price)}
            </Text>
            {promo.originalPrice && (
              <Text style={s.oldPrice}>{formatPrice(promo.originalPrice)}</Text>
            )}
          </View>

          {savings > 0 && available && (
            <View style={s.savingsPill}>
              <Text style={s.savingsTxt}>Économie : {formatPrice(savings)}</Text>
            </View>
          )}

          {/* 2 specs clés */}
          {specs.slice(0, 2).map((sp, i) => (
            <Text key={i} style={s.specLine} numberOfLines={1}>
              <Text style={s.specLbl}>{sp.label} </Text>
              <Text style={s.specVal}>{sp.value}</Text>
            </Text>
          ))}
        </View>
      </TouchableOpacity>

      {/* Disponibilité ville */}
      {promo.cities && (
        <View style={[s.cityRow, !available && s.cityRowUnavail]}>
          <Feather
            name="map-pin"
            size={11}
            color={available ? "#52C41A" : "#FF4D4F"}
          />
          <Text style={[s.cityTxt, !available && s.cityTxtUnavail]}>
            {available
              ? `Disponible à ${promo.cities.join(", ")}`
              : `Non disponible à ${filterCity ?? "votre ville"}`}
          </Text>
        </View>
      )}

      {/* Cadeaux inclus */}
      {Array.isArray(promo.gifts) && promo.gifts.length > 0 && (
        <View style={s.giftsRow}>
          <Feather name="gift" size={11} color="#FF6B00" />
          <Text style={s.giftsTxt}>
            {" "}Cadeaux inclus :{" "}
            <Text style={{ fontWeight: "700" }}>{promo.gifts.join(" · ")}</Text>
          </Text>
        </View>
      )}

      {/* Séparateur */}
      <View style={s.divider} />

      {/* Boutons */}
      <View style={s.actions}>
        <TouchableOpacity style={s.btnDetail} onPress={onDetail}>
          <Feather name="eye" size={13} color="#0066CC" />
          <Text style={s.btnDetailTxt}> Détails</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.btnCart, (!available || inCart) && s.btnCartIn]}
          onPress={available ? onCart : undefined}
          disabled={!available}
        >
          <Feather name="shopping-cart" size={13} color="#fff" />
          <Text style={s.btnCartTxt}>
            {!available ? " Indisponible" : inCart ? ` (${inCartQty})` : " Ajouter"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F5F8" },

  // Header
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#1A1A1A" },
  headerSub:   { fontSize: 12, color: "#888", marginTop: 1 },

  urgencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    borderWidth: 1,
    borderColor: "#FFD0A0",
  },
  urgencyDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FF6B00" },
  urgencyTxt: { color: "#E05900", fontSize: 11, fontWeight: "800" },

  bannerStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFE0C0",
  },
  bannerTxt: { color: "#CC5500", fontSize: 11, fontWeight: "600", flex: 1 },

  chipRow: { gap: 7, paddingBottom: 2 },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipActive: { backgroundColor: "#FF6B00", borderColor: "#FF6B00" },
  chipTxt: { fontSize: 12, color: "#555", fontWeight: "600" },
  chipTxtActive: { color: "#fff", fontWeight: "800" },

  // Liste
  list: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: Platform.OS === "web" ? 100 : 90,
    gap: 12,
  },

  // Carte
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  cardUnavailable: { borderColor: "#FFCDD2", opacity: 0.85 },

  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: "#FF4D4F",
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  discountTxt: { color: "#fff", fontSize: 13, fontWeight: "900" },

  cardInner: { flexDirection: "row", padding: 12, gap: 12 },

  imgWrap: {
    width: 110,
    height: 110,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    flexShrink: 0,
    position: "relative",
  },
  img: { width: "100%", height: "100%" },
  imgGray: { opacity: 0.55 },
  zoomHint: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 5,
    padding: 4,
  },

  info: { flex: 1, gap: 4 },

  tagRow: { flexDirection: "row", gap: 5, flexWrap: "wrap" },
  categoryTag: {
    backgroundColor: "#EEF4FF",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryTxt: { fontSize: 10, color: "#0066CC", fontWeight: "700", textTransform: "capitalize" },
  brandTag: {
    backgroundColor: "#F6FFED",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  brandTxt: { fontSize: 10, color: "#389E0D", fontWeight: "700" },

  name: { fontSize: 13, fontWeight: "800", color: "#1A1A1A", lineHeight: 18 },
  nameGray: { color: "#999" },

  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 8, flexWrap: "wrap" },
  price:    { fontSize: 18, fontWeight: "900", color: "#FF6B00" },
  priceGray:{ color: "#aaa" },
  oldPrice: { fontSize: 12, color: "#bbb", textDecorationLine: "line-through" },

  savingsPill: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF3E0",
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#FFD6A0",
  },
  savingsTxt: { fontSize: 10, color: "#E05900", fontWeight: "700" },

  specLine: { fontSize: 11, color: "#666" },
  specLbl:  { color: "#333", fontWeight: "700" },
  specVal:  { color: "#666" },

  // Disponibilité
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#F6FFED",
    borderTopWidth: 1,
    borderTopColor: "#D9F7BE",
  },
  cityRowUnavail: { backgroundColor: "#FFF2F0", borderTopColor: "#FFCCC7" },
  cityTxt:        { fontSize: 11, color: "#52C41A", fontWeight: "600", flex: 1 },
  cityTxtUnavail: { color: "#FF4D4F" },

  // Cadeaux
  giftsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFF8F0",
    borderTopWidth: 1,
    borderTopColor: "#FFE0B2",
  },
  giftsTxt: { fontSize: 11, color: "#E05900", flex: 1 },

  divider: { height: 1, backgroundColor: "#F0F0F0" },

  // Actions
  actions: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  btnDetail: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#0066CC",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnDetailTxt: { color: "#0066CC", fontSize: 12, fontWeight: "700" },
  btnCart: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    paddingVertical: 10,
  },
  btnCartIn:  { backgroundColor: "#999" },
  btnCartTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },

  // Engagements
  engagements: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    gap: 10,
  },
  engagementsTitle: { fontSize: 13, fontWeight: "800", color: "#1A1A1A" },
  engagementsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  engItem:  { width: "46%", flexDirection: "row", alignItems: "center", gap: 8 },
  engIcon:  {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center",
  },
  engTxt: { fontSize: 11, color: "#555", fontWeight: "600", flex: 1 },

  // Zoom modal
  zoomOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center", alignItems: "center",
  },
  zoomImg: { width: "95%", height: "75%" },
  zoomClose: {
    position: "absolute",
    top: Platform.OS === "web" ? 16 : 52,
    right: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 8,
  },
});
