import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useCity } from "@/context/CityContext";
import { useUnavailable } from "@/context/UnavailableContext";
import { ProductDetail, formatPrice, getDiscount } from "@/data/products";

interface Props {
  product: ProductDetail;
  style?: object;
  compact?: boolean;
  animDelay?: number;
}

export function ProductCard({ product, style, compact, animDelay = 0 }: Props) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const { user, isAdmin } = useAuth();
  const { selectedCity } = useCity();
  const { isUnavailable, markUnavailable, markAvailable } = useUnavailable();
  const [adminLoading, setAdminLoading] = useState(false);

  const discount = product.originalPrice
    ? getDiscount(product.price, product.originalPrice)
    : 0;
  const inCart      = items.find(i => i.id === product.id);
  const unavailable = isUnavailable(product.id, selectedCity);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const cartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, delay: animDelay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: animDelay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAddToCart = () => {
    if (unavailable) return;
    addItem(product);
    Animated.sequence([
      Animated.spring(cartScale, { toValue: 1.18, useNativeDriver: true, speed: 50 }),
      Animated.spring(cartScale, { toValue: 1,    useNativeDriver: true, speed: 30 }),
    ]).start();
  };

  const city = selectedCity ?? "*";

  const handleAdminToggle = async () => {
    if (!user?.email) return;
    setAdminLoading(true);
    try {
      if (unavailable) {
        Alert.alert(
          "Remettre en stock ?",
          `"${product.name}" sera de nouveau disponible à l'achat à ${city}.`,
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Remettre en stock",
              onPress: async () => {
                await markAvailable(product.id, city, user.email!);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Marquer épuisé ?",
          `"${product.name}" sera affiché comme rupture de stock à ${city} uniquement.`,
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Marquer épuisé",
              style: "destructive",
              onPress: async () => {
                await markUnavailable(product.id, city, user.email!);
              },
            },
          ]
        );
      }
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        compact && styles.cardCompact,
        unavailable && styles.cardUnavailable,
        style,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={() => router.push(`/product/${product.id}` as any)}
        activeOpacity={0.93}
      >
        <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
          <Image
            source={{ uri: product.image }}
            style={[styles.image, unavailable && !isAdmin && { opacity: 0.5 }]}
            resizeMode="cover"
          />
          {/* Badge disponibilité */}
          {unavailable ? (
            <View style={styles.outOfStockBadge}>
              <Feather name="x-circle" size={8} color="#fff" />
              <Text style={styles.outOfStockText}> ÉPUISÉ</Text>
            </View>
          ) : (
            <View style={styles.availBadge}>
              <Feather name="check" size={8} color="#fff" />
              <Text style={styles.availText}> DISPO</Text>
            </View>
          )}
          {/* Badge réduction */}
          {discount > 0 && !unavailable && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
          {/* Badge panier */}
          {inCart && !unavailable && (
            <Animated.View style={[styles.cartQtyBadge, { transform: [{ scale: cartScale }] }]}>
              <Text style={styles.cartQtyText}>{inCart.quantity}</Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, unavailable && !isAdmin && { color: "#aaa" }]}>{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text style={styles.oldPrice}>{formatPrice(product.originalPrice)}</Text>
            )}
          </View>
          {product.shortSpecs ? (
            <Text style={styles.specs} numberOfLines={2}>{product.shortSpecs}</Text>
          ) : null}
          <View style={styles.ordersRow}>
            <Feather name="shopping-cart" size={10} color="#888" />
            <Text style={styles.orders}> {(product.orders ?? 0).toLocaleString("fr-FR")} commandes</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnContact}
          onPress={() => router.push({ pathname: "/contact", params: { productName: product.name } } as any)}
          activeOpacity={0.8}
        >
          <Feather name="message-circle" size={12} color="#fff" />
          <Text style={styles.btnContactText}> Contacter</Text>
        </TouchableOpacity>

        {unavailable && !isAdmin ? (
          <View style={[styles.btnCartWrap]}>
            <View style={[styles.btnCart, styles.btnCartUnavailable]}>
              <Feather name="x" size={12} color="#888" />
              <Text style={[styles.btnCartText, { color: "#888" }]}> Épuisé</Text>
            </View>
          </View>
        ) : (
          <Animated.View style={[styles.btnCartWrap, { transform: [{ scale: cartScale }] }]}>
            <TouchableOpacity
              style={[styles.btnCart, inCart ? styles.btnCartActive : null, unavailable && { opacity: 0.6 }]}
              onPress={handleAddToCart}
              disabled={unavailable}
              activeOpacity={0.8}
            >
              <Feather name="shopping-cart" size={12} color="#fff" />
              <Text style={styles.btnCartText}>{inCart ? " +1" : " Panier"}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Bouton admin — scoped par ville */}
      {isAdmin && (
        <TouchableOpacity
          style={[styles.adminBtn, unavailable && styles.adminBtnRestore]}
          onPress={handleAdminToggle}
          disabled={adminLoading}
          activeOpacity={0.8}
        >
          <Feather name={unavailable ? "refresh-ccw" : "slash"} size={11} color="#fff" />
          <Text style={styles.adminBtnTxt}>
            {unavailable ? ` Remettre en stock (${city})` : ` Épuisé à ${city}`}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardCompact:     { width: 160 },
  cardUnavailable: { borderColor: "#F0F0F0", opacity: 0.85 },

  imageWrap:        { width: "100%", height: 140, backgroundColor: "#F5F5F5", position: "relative" },
  imageWrapCompact: { height: 120 },
  image:            { width: "100%", height: "100%" },

  availBadge: {
    position: "absolute", top: 6, left: 6,
    backgroundColor: "#52C41A",
    borderRadius: 3, flexDirection: "row", alignItems: "center",
    paddingHorizontal: 5, paddingVertical: 2,
  },
  availText: { color: "#fff", fontSize: 8, fontWeight: "700", letterSpacing: 0.3 },

  outOfStockBadge: {
    position: "absolute", top: 6, left: 6,
    backgroundColor: "#FF4D4F",
    borderRadius: 3, flexDirection: "row", alignItems: "center",
    paddingHorizontal: 5, paddingVertical: 2,
  },
  outOfStockText: { color: "#fff", fontSize: 8, fontWeight: "700", letterSpacing: 0.3 },

  discountBadge: {
    position: "absolute", top: 6, right: 6,
    backgroundColor: "#FF4D4F",
    borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2,
  },
  discountText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  cartQtyBadge: {
    position: "absolute", bottom: 6, right: 6,
    backgroundColor: "#FF6B00", borderRadius: 10,
    minWidth: 20, height: 20,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 5,
  },
  cartQtyText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  info:     { padding: 8 },
  name:     { fontSize: 12, fontWeight: "700", color: "#333", marginBottom: 4, lineHeight: 16 },
  priceRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 3 },
  price:    { fontSize: 14, fontWeight: "800", color: "#FF6B00" },
  oldPrice: { fontSize: 11, color: "#999", textDecorationLine: "line-through" },
  specs:    { fontSize: 10, color: "#666", marginBottom: 3, lineHeight: 14 },
  ordersRow:{ flexDirection: "row", alignItems: "center", marginBottom: 8 },
  orders:   { fontSize: 10, color: "#888" },

  actions:        { flexDirection: "row", gap: 5, paddingHorizontal: 8, paddingBottom: 8 },
  btnContact:     { flex: 1, backgroundColor: "#0066CC", borderRadius: 4, paddingVertical: 6, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  btnContactText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  btnCartWrap:    { flex: 1 },
  btnCart:        { flex: 1, backgroundColor: "#FF6B00", borderRadius: 4, paddingVertical: 6, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  btnCartActive:      { backgroundColor: "#CC5500" },
  btnCartUnavailable: { backgroundColor: "#F0F0F0" },
  btnCartText:    { color: "#fff", fontSize: 11, fontWeight: "600" },

  adminBtn:        { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FF4D4F", paddingVertical: 5, paddingHorizontal: 8, marginHorizontal: 8, marginBottom: 8, borderRadius: 4 },
  adminBtnRestore: { backgroundColor: "#28A745" },
  adminBtnTxt:     { color: "#fff", fontSize: 11, fontWeight: "700" },
});
