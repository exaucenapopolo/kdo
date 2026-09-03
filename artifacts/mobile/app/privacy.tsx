import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: "1. Données collectées",
      content: "Nous collectons les informations que vous nous fournissez directement : nom, adresse email, numéro de téléphone, adresses de livraison et historique de commandes. Ces données sont nécessaires pour traiter vos commandes et améliorer votre expérience.",
    },
    {
      title: "2. Utilisation des données",
      content: "Vos données sont utilisées pour :\n• Traiter et livrer vos commandes\n• Vous informer du statut de vos commandes\n• Vous envoyer des offres promotionnelles (si vous y avez consenti)\n• Améliorer nos services et l'expérience utilisateur\n• Prévenir la fraude et assurer la sécurité",
    },
    {
      title: "3. Partage des données",
      content: "KDO Cameroun ne vend ni ne loue vos données personnelles à des tiers. Nous pouvons partager vos informations avec :\n• Nos partenaires logistiques pour la livraison\n• Les opérateurs de paiement (MTN, Orange) pour les transactions\n• Les autorités compétentes en cas d'obligation légale",
    },
    {
      title: "4. Sécurité",
      content: "Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou destruction. Vos mots de passe sont chiffrés et jamais stockés en clair.",
    },
    {
      title: "5. Conservation des données",
      content: "Vos données personnelles sont conservées pendant la durée de votre relation commerciale avec KDO Cameroun, puis archivées pendant 5 ans conformément aux obligations légales.",
    },
    {
      title: "6. Vos droits",
      content: "Conformément à la réglementation applicable, vous disposez des droits suivants :\n• Droit d'accès à vos données\n• Droit de rectification\n• Droit à l'effacement\n• Droit à la portabilité\n\nPour exercer ces droits, contactez-nous via l'application.",
    },
    {
      title: "7. Cookies et données locales",
      content: "L'application utilise le stockage local de votre appareil pour sauvegarder vos préférences, adresses et historique de commandes. Ces données ne quittent jamais votre appareil sans votre accord.",
    },
    {
      title: "8. Contact",
      content: "Pour toute question relative à cette politique, contactez notre délégué à la protection des données :\n\nEmail : privacy@kdo-cameroun.com\nAdresse : Yaoundé, Cameroun",
    },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 14 : insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Politique de confidentialité</Text>
          <Text style={styles.headerSub}>Dernière mise à jour : Janvier 2026</Text>
        </View>
        <View style={styles.headerIcon}>
          <Feather name="shield" size={20} color="#fff" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.introText}>
            Chez KDO Cameroun, la protection de vos données personnelles est une priorité. Cette politique décrit comment nous collectons, utilisons et protégeons vos informations.
          </Text>
        </View>
        {sections.map((sec, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            <Text style={styles.sectionContent}>{sec.content}</Text>
          </View>
        ))}
        <Text style={styles.footer}>© 2026 KDO Cameroun · Tous droits réservés</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6FA" },
  header: {
    backgroundColor: "#0066CC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 15, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  content: { padding: 14, gap: 12, paddingBottom: 40 },
  intro: {
    backgroundColor: "#EEF7FF",
    borderRadius: 10, padding: 14,
    borderLeftWidth: 3, borderLeftColor: "#0066CC",
  },
  introText: { fontSize: 13, color: "#333", lineHeight: 20 },
  section: {
    backgroundColor: "#fff", borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: "#E8E8E8", gap: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: "#0066CC" },
  sectionContent: { fontSize: 12, color: "#555", lineHeight: 19 },
  footer: { textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10 },
});
