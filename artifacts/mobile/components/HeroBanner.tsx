import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");
const GH = "https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/Photo";

const SLIDES = [
  {
    image: `${GH}/Acceuil/a1.jpg`,
    title: "Bienvenue chez KDO",
    subtitle: "Leader de l'informatique au Cameroun",
    overlay: "rgba(21,101,192,0.70)",
  },
  {
    image: `${GH}/Acceuil/a2.jpg`,
    title: "Ordinateurs Portables",
    subtitle: "Marques reconnues – Garantie constructeur",
    overlay: "rgba(21,101,192,0.65)",
  },
  {
    image: `${GH}/Acceuil/a3.jpg`,
    title: "Promotions Exceptionnelles",
    subtitle: "Jusqu'à -40% sur une sélection de produits",
    overlay: "rgba(230,81,0,0.70)",
  },
  {
    image: `${GH}/Acceuil/a4.jpg`,
    title: "8 Boutiques au Cameroun",
    subtitle: "Yaoundé • Douala • Bafoussam et plus",
    overlay: "rgba(21,101,192,0.72)",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const colors = useColors();

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % SLIDES.length;
      Animated.timing(translateX, {
        toValue: -next * (width - 32),
        duration: 450,
        useNativeDriver: true,
      }).start(() => setCurrent(next));
    }, 4000);
    return () => clearInterval(timer);
  }, [current, translateX]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.overflow}>
        <Animated.View style={[styles.track, { transform: [{ translateX }] }]}>
          {SLIDES.map((slide, i) => (
            <View key={i} style={styles.slide}>
              <Image
                source={{ uri: slide.image }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: slide.overlay }]} />
              <View style={styles.content}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>KDO Cameroun</Text>
                </View>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === current ? colors.primary : colors.muted,
                width: i === current ? 20 : 6,
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 4 },
  overflow: { overflow: "hidden", borderRadius: 16, marginHorizontal: 16 },
  track: { flexDirection: "row" },
  slide: {
    width: width - 32,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  content: { padding: 18 },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,111,0,0.9)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  pillText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF", marginBottom: 4 },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.9)", lineHeight: 16 },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 10 },
  dot: { height: 6, borderRadius: 3 },
});
