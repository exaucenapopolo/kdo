import { Feather } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOUTIQUES } from "@/data/boutiques";


export default function BoutiquesScreen() {
  const insets = useSafeAreaInsets();
  const [activeCity, setActiveCity] = React.useState("all");
  const [fullImg, setFullImg] = React.useState<string | null>(null);

  const filtered = activeCity === "all"
    ? BOUTIQUES
    : BOUTIQUES.filter(b => b.id === activeCity);

  const openMaps = (ville: string) =>
    Linking.openURL(`https://maps.google.com/?q=KDO+Informatique+${encodeURIComponent(ville)}+Cameroun`);

  return (
    <View style={styles.root}>
      {/* ─── EN-TÊTE COLORÉ ─────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 14 : insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerIconWrap}>
            <Feather name="map-pin" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Nos Boutiques</Text>
            <Text style={styles.headerSub}>
              {BOUTIQUES.length} boutiques au Cameroun
            </Text>
          </View>
          <View style={styles.openPill}>
            <View style={styles.openDot} />
            <Text style={styles.openText}>Ouvertes</Text>
          </View>
        </View>

        {/* Filtre par ville */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          <TouchableOpacity
            style={[styles.chip, activeCity === "all" && styles.chipActive]}
            onPress={() => setActiveCity("all")}
          >
            <Text style={[styles.chipTxt, activeCity === "all" && styles.chipTxtActive]}>Toutes</Text>
          </TouchableOpacity>
          {BOUTIQUES.map(b => (
            <TouchableOpacity
              key={b.id}
              style={[styles.chip, activeCity === b.id && styles.chipActive]}
              onPress={() => setActiveCity(activeCity === b.id ? "all" : b.id)}
            >
              <Text style={[styles.chipTxt, activeCity === b.id && styles.chipTxtActive]}>{b.ville}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal zoom photo */}
      <Modal visible={!!fullImg} transparent animationType="fade" onRequestClose={() => setFullImg(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFullImg(null)}>
          {fullImg && <Image source={{ uri: fullImg }} style={styles.fullImage} resizeMode="contain" />}
          <TouchableOpacity style={styles.modalClose} onPress={() => setFullImg(null)}>
            <Feather name="x" size={20} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 14,
          paddingBottom: Platform.OS === "web" ? 100 : 90,
          gap: 14,
        }}
      >
        {/* ─── Cartes boutiques ─────────────────────────────────────────────── */}
        {filtered.map((boutique, index) => (
          <BoutiqueCard
            key={boutique.id}
            boutique={boutique}
            index={index}
            onZoom={() => setFullImg(boutique.image)}
            onMaps={() => openMaps(boutique.ville)}
          />
        ))}

        {/* ─── Pied de page ─────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Pourquoi choisir KDO ?</Text>
          {[
            { icon: "award", text: "Leader de l'informatique au Cameroun" },
            { icon: "shield", text: "Tous les produits garantis et testés avant livraison" },
            { icon: "truck", text: "Livraison dans toutes les villes du Cameroun" },
            { icon: "map-pin", text: "8 boutiques réparties dans tout le pays" },
          ].map(f => (
            <View key={f.text} style={styles.footerRow}>
              <View style={styles.footerIcon}>
                <Feather name={f.icon as any} size={13} color="#FF6B00" />
              </View>
              <Text style={styles.footerTxt}>{f.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── CARTE BOUTIQUE ──────────────────────────────────────────────────────────
interface BoutiqueCardProps {
  boutique: any;
  index: number;
  onZoom: () => void;
  onMaps: () => void;
}

function BoutiqueCard({ boutique, index, onZoom, onMaps }: BoutiqueCardProps) {
  const anim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
      delay: index * 70,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
        },
      ]}
    >
      {/* Photo */}
      <TouchableOpacity activeOpacity={0.92} onPress={onZoom}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: boutique.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.cityOverlay}>
            <Feather name="map-pin" size={12} color="#FF6B00" />
            <Text style={styles.cityName}> {boutique.ville}</Text>
          </View>
          <View style={styles.zoomHint}>
            <Feather name="zoom-in" size={10} color="#fff" />
            <Text style={styles.zoomTxt}> Agrandir</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Infos */}
      <View style={styles.cardBody}>
        <Text style={styles.boutiqueTitle}>KDO Informatique {boutique.ville}</Text>

        {/* Description */}
        <Text style={styles.boutiqueDesc}>{boutique.description}</Text>

        {/* Adresse */}
        <View style={styles.addrRow}>
          <Feather name="navigation" size={12} color="#0066CC" />
          <Text style={styles.addrTxt}>{boutique.indication}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          {boutique.features?.slice(0, 4).map((f: string, i: number) => (
            <View key={i} style={styles.featureChip}>
              <Feather name="check" size={9} color="#52C41A" />
              <Text style={styles.featureTxt}> {f}</Text>
            </View>
          ))}
        </View>

        {/* Bouton itinéraire */}
        <TouchableOpacity style={styles.btnItinerary} onPress={onMaps}>
          <Feather name="navigation" size={14} color="#fff" />
          <Text style={styles.btnItineraryTxt}> Obtenir l'itinéraire</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6FA" },

  // ─── HEADER ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  headerIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 1 },
  openPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },
  openDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#52C41A" },
  openText: { fontSize: 10, color: "#fff", fontWeight: "700" },
  filterList: { gap: 7, paddingRight: 4 },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  chipActive: { backgroundColor: "#fff", borderColor: "#fff" },
  chipTxt: { fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: "600" },
  chipTxtActive: { color: "#0066CC", fontWeight: "800" },

  // ─── MODAL ────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.94)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "95%", height: "75%" },
  modalClose: {
    position: "absolute",
    top: Platform.OS === "web" ? 16 : 54,
    right: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 8,
  },

  // ─── CARTE BOUTIQUE ───────────────────────────────────────────────────────
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: { width: "100%", height: 180, position: "relative" },
  image: { width: "100%", height: "100%" },
  cityOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cityName: { color: "#fff", fontSize: 13, fontWeight: "800" },
  zoomHint: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  zoomTxt: { color: "#fff", fontSize: 10 },

  cardBody: { padding: 14, gap: 10 },
  boutiqueTitle: { fontSize: 15, fontWeight: "900", color: "#1A1A1A" },
  boutiqueDesc: { fontSize: 12, color: "#666", lineHeight: 17 },
  addrRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  addrTxt: { flex: 1, fontSize: 12, color: "#444", lineHeight: 17 },
  featuresRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#B7EB8F",
  },
  featureTxt: { fontSize: 10, color: "#52C41A", fontWeight: "600" },
  btnItinerary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066CC",
    borderRadius: 10,
    paddingVertical: 13,
    gap: 7,
  },
  btnItineraryTxt: { color: "#fff", fontSize: 13, fontWeight: "800" },

  // ─── FOOTER ───────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  footerTitle: { fontSize: 13, fontWeight: "800", color: "#1A1A1A", marginBottom: 2 },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  footerIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center",
  },
  footerTxt: { fontSize: 12, color: "#555", flex: 1 },
});
