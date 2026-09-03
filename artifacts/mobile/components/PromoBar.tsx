import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

const MESSAGES = [
  "Livraison gratuite dès 100 000 FCFA",
  "Paiement Mobile Money accepté",
  "Garantie sur tous les ordinateurs",
  "Présents dans 8 villes du Cameroun",
  "Retour gratuit sous 7 jours",
];

export function PromoBar() {
  const colors = useColors();
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start(() => setIndex(i => (i + 1) % MESSAGES.length));
    }, 2800);
    return () => clearInterval(timer);
  }, [opacity]);

  return (
    <View style={[styles.bar, { backgroundColor: colors.secondary }]}>
      <Animated.Text style={[styles.text, { opacity }]}>
        {MESSAGES[index]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingVertical: 7, alignItems: "center" },
  text: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
