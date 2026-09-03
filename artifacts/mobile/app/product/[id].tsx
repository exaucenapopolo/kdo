import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { getProductById, getByCategory, formatPrice, getDiscount } from "@/data/products";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem, items } = useCart();

  const product = getProductById(id ?? "");
  const [specsOpen, setSpecsOpen] = useState(true);
  const [zoomVisible, setZoomVisible] = useState(false);
  const cartAnim = useRef(new Animated.Value(1)).current;

  const inCart = items.find(i => i.id === id);
  const discount = product?.originalPrice
    ? getDiscount(product.price, product.originalPrice)
    : 0;

  // Produits similaires (même catégorie, max 8, excluant le produit actuel)
  const similar = product
    ? getByCategory(product.category)
        .filter(p => p.id !== product.id)
        .slice(0, 8)
    : [];

  const handleCart = () => {
    if (!product) return;
    Animated.sequence([
      Animated.spring(cartAnim, { toValue: 1.15, useNativeDriver: true, speed: 50 }),
      Animated.spring(cartAnim, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();
    addItem(product);
  };

  if (!product) {
    return (
      <View style={styles.notFound}>
        <AppHeader showBack title="Produit" showSearch={false} />
        <View style={styles.notFoundInner}>
          <Feather name="alert-circle" size={48} color="#ccc" />
          <Text style={styles.notFoundText}>Produit introuvable</Text>
          <TouchableOpacity style={styles.backBtn2} onPress={() => router.back()}>
            <Text style={styles.backBtn2Text}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppHeader showBack title={product.name} showSearch={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Image cliquable pour zoom */}
        <TouchableOpacity activeOpacity={0.92} onPress={() => setZoomVisible(true)}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.availBadge}>
              <Feather name="check" size={11} color="#fff" />
              <Text style={styles.availText}> DISPONIBLE</Text>
            </View>
            {discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}
            {/* Hint zoom */}
            <View style={styles.zoomHint}>
              <Feather name="zoom-in" size={14} color="#fff" />
              <Text style={styles.zoomHintText}> Appuyer pour agrandir</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.body}>
          {/* Nom */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Prix */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text style={styles.oldPrice}>{formatPrice(product.originalPrice)}</Text>
            )}
            {discount > 0 && (
              <View style={styles.discountPill}>
                <Text style={styles.discountPillText}>-{discount}%</Text>
              </View>
            )}
          </View>

          {/* Specs courtes */}
          {(product.shortSpecs || product.description) && (
            <Text style={styles.shortSpecs}>{product.shortSpecs || product.description}</Text>
          )}

          {/* Commandes */}
          <View style={styles.ordersRow}>
            <Feather name="shopping-cart" size={13} color="#888" />
            <Text style={styles.ordersText}> {(product.orders ?? 0).toLocaleString("fr-FR")} commandes</Text>
            <View style={styles.verifiedBadge}>
              <Feather name="shield" size={10} color="#52C41A" />
              <Text style={styles.verifiedText}> Vérifié KDO</Text>
            </View>
          </View>

          <View style={styles.sep} />

          {/* Specs techniques */}
          {product.specs && product.specs.length > 0 && (
            <View style={styles.specsSection}>
              <TouchableOpacity style={styles.specsToggle} onPress={() => setSpecsOpen(!specsOpen)}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Feather name="list" size={14} color="#FF6B00" />
                  <Text style={styles.specsToggleTitle}>Caractéristiques techniques</Text>
                </View>
                <Feather name={specsOpen ? "chevron-up" : "chevron-down"} size={16} color="#FF6B00" />
              </TouchableOpacity>
              {specsOpen && (
                <View style={styles.specsList}>
                  {product.specs.map((spec, i) => (
                    <View key={i} style={[styles.specRow, { backgroundColor: i % 2 === 0 ? "#fff" : "#FAFAFA" }]}>
                      <Text style={styles.specLabel}>{spec.label}</Text>
                      <Text style={styles.specValue}>{spec.value}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Description complète */}
          {product.fullDescription && (
            <>
              <View style={styles.sep} />
              <View style={styles.descSection}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Feather name="info" size={14} color="#0066CC" />
                  <Text style={styles.descTitle}>Description</Text>
                </View>
                <Text style={styles.descText}>{product.fullDescription}</Text>
              </View>
            </>
          )}

          <View style={styles.sep} />

          {/* Garanties */}
          <View style={styles.guarantees}>
            {[
              { icon: "shield", text: "Garantie incluse", color: "#52C41A" },
              { icon: "rotate-ccw", text: "Retour sous 7 jours", color: "#0066CC" },
              { icon: "truck", text: "Livraison nationale", color: "#FF6B00" },
            ].map(g => (
              <View key={g.text} style={styles.guaranteeItem}>
                <View style={[styles.guaranteeIcon, { backgroundColor: `${g.color}18` }]}>
                  <Feather name={g.icon as any} size={14} color={g.color} />
                </View>
                <Text style={styles.guaranteeText}>{g.text}</Text>
              </View>
            ))}
          </View>

          {/* Produits similaires */}
          {similar.length > 0 && (
            <>
              <View style={styles.sep} />
              <View style={styles.similarSection}>
                <View style={styles.similarHeader}>
                  <Feather name="grid" size={14} color="#FF6B00" />
                  <Text style={styles.similarTitle}> Vous pourriez aussi aimer</Text>
                </View>
                <Text style={styles.similarSub}>Produits similaires · Même catégorie</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 6, gap: 10 }}
                >
                  {similar.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      compact
                      animDelay={i * 50}
                      style={{ marginRight: 0 }}
                    />
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Barre basse */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.btnContact}
          onPress={() =>
            router.push({ pathname: "/contact", params: { productName: product.name } } as any)
          }
        >
          <Feather name="message-circle" size={16} color="#fff" />
          <Text style={styles.btnContactText}> Contacter</Text>
        </TouchableOpacity>
        <Animated.View style={{ flex: 2, transform: [{ scale: cartAnim }] }}>
          <TouchableOpacity
            style={[styles.btnCart, inCart ? styles.btnCartActive : null]}
            onPress={handleCart}
          >
            <Feather name="shopping-cart" size={16} color="#fff" />
            <Text style={styles.btnCartText}>
              {inCart ? ` Panier (${inCart.quantity})` : " Ajouter au panier"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Modal zoom image */}
      <Modal visible={zoomVisible} transparent animationType="fade" onRequestClose={() => setZoomVisible(false)}>
        <TouchableOpacity style={styles.zoomOverlay} activeOpacity={1} onPress={() => setZoomVisible(false)}>
          <Image source={{ uri: product.image }} style={styles.zoomImage} resizeMode="contain" />
          <TouchableOpacity style={styles.zoomClose} onPress={() => setZoomVisible(false)}>
            <Feather name="x" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.zoomLabel}>{product.name}</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  notFound: { flex: 1, backgroundColor: "#fff" },
  notFoundInner: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 18, color: "#888", fontWeight: "700" },
  backBtn2: { backgroundColor: "#FF6B00", borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  backBtn2Text: { color: "#fff", fontWeight: "700" },

  imageWrap: { width: "100%", height: 270, backgroundColor: "#F5F5F5", position: "relative" },
  image: { width: "100%", height: "100%" },
  availBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#52C41A",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF4D4F",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  zoomHint: {
    position: "absolute",
    bottom: 10,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.48)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  zoomHintText: { color: "#fff", fontSize: 10 },

  body: { padding: 14 },
  productName: { fontSize: 18, fontWeight: "800", color: "#333", marginBottom: 8, lineHeight: 24 },
  priceRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 },
  price: { fontSize: 22, fontWeight: "900", color: "#FF6B00" },
  oldPrice: { fontSize: 15, color: "#999", textDecorationLine: "line-through" },
  discountPill: { backgroundColor: "#FFF0F0", borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  discountPillText: { color: "#FF4D4F", fontSize: 13, fontWeight: "700" },
  shortSpecs: { fontSize: 12, color: "#666", lineHeight: 18, marginBottom: 8 },
  ordersRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14, flexWrap: "wrap" },
  ordersText: { fontSize: 12, color: "#888" },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6FFED",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#B7EB8F",
  },
  verifiedText: { fontSize: 10, color: "#52C41A", fontWeight: "700" },
  sep: { height: 1, backgroundColor: "#EBEBEB", marginVertical: 14 },

  specsSection: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, overflow: "hidden" },
  specsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF8F0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE0C0",
  },
  specsToggleTitle: { fontSize: 14, fontWeight: "700", color: "#333" },
  specsList: {},
  specRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 9 },
  specLabel: { fontSize: 12, color: "#555", flex: 1 },
  specValue: { fontSize: 12, fontWeight: "700", color: "#333", flex: 1, textAlign: "right" },

  descSection: {},
  descTitle: { fontSize: 14, fontWeight: "700", color: "#333" },
  descText: { fontSize: 13, color: "#555", lineHeight: 20 },

  guarantees: { flexDirection: "row", justifyContent: "space-around" },
  guaranteeItem: { alignItems: "center", gap: 6, flex: 1 },
  guaranteeIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  guaranteeText: { fontSize: 10, color: "#444", textAlign: "center" },

  similarSection: {},
  similarHeader: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  similarTitle: { fontSize: 15, fontWeight: "800", color: "#333" },
  similarSub: { fontSize: 11, color: "#888", marginBottom: 8 },

  bottomBar: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  btnContact: {
    flex: 1,
    backgroundColor: "#0066CC",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnContactText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  btnCart: {
    flex: 1,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCartActive: { backgroundColor: "#CC5500" },
  btnCartText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  zoomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomImage: { width: "95%", height: "78%" },
  zoomClose: {
    position: "absolute",
    top: Platform.OS === "web" ? 20 : 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 8,
  },
  zoomLabel: {
    position: "absolute",
    bottom: 60,
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
