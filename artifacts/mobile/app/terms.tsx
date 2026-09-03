import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: "1. Acceptation des conditions",
      content: "En utilisant l'application KDO Cameroun, vous acceptez pleinement et sans réserve les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.",
    },
    {
      title: "2. Services proposés",
      content: "KDO Cameroun est une plateforme de commerce électronique permettant l'achat de produits informatiques, téléphones et accessoires. Nos services incluent :\n• Navigation dans le catalogue produits\n• Passation et suivi de commandes\n• Livraison à domicile ou retrait en boutique\n• Service client et support après-vente",
    },
    {
      title: "3. Compte utilisateur",
      content: "Vous êtes responsable de la confidentialité de vos identifiants de connexion. Toute commande passée depuis votre compte est réputée émaner de vous. En cas de perte ou de vol de vos identifiants, contactez-nous immédiatement.",
    },
    {
      title: "4. Commandes et paiements",
      content: "Les prix affichés sont en FCFA, toutes taxes comprises. Le paiement s'effectue via MTN Mobile Money ou Orange Money. Une commande n'est définitive qu'après confirmation du paiement. KDO se réserve le droit d'annuler toute commande suspecte ou erronée.",
    },
    {
      title: "5. Livraison",
      content: "Les délais de livraison sont indicatifs :\n• Retrait en boutique : immédiat\n• Livraison dans les villes avec boutique : 24h\n• Expédition nationale : 1-3 jours ouvrables\n\nKDO Cameroun ne saurait être tenu responsable des retards dus à des circonstances exceptionnelles.",
    },
    {
      title: "6. Retours et remboursements",
      content: "Tout produit défectueux peut être retourné dans un délai de 7 jours à compter de la réception. Le produit doit être dans son emballage d'origine, non endommagé. Le remboursement sera effectué dans les 5-10 jours ouvrables suivant la réception du retour.",
    },
    {
      title: "7. Garanties",
      content: "Tous nos produits bénéficient d'une garantie constructeur. KDO Cameroun assure le service après-vente dans ses boutiques. La garantie couvre les défauts de fabrication mais exclut les dommages causés par une mauvaise utilisation.",
    },
    {
      title: "8. Propriété intellectuelle",
      content: "L'application KDO Cameroun et son contenu (logos, textes, images, données) sont protégés par les droits de propriété intellectuelle. Toute reproduction, modification ou utilisation non autorisée est strictement interdite.",
    },
    {
      title: "9. Responsabilité",
      content: "KDO Cameroun s'efforce d'assurer la disponibilité et la fiabilité de son application. Cependant, nous ne pouvons garantir une disponibilité ininterrompue et déclinons toute responsabilité pour les dommages indirects résultant de l'utilisation de nos services.",
    },
    {
      title: "10. Modifications",
      content: "KDO Cameroun se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des modifications importantes. La poursuite de l'utilisation de l'application vaut acceptation des nouvelles conditions.",
    },
    {
      title: "11. Droit applicable",
      content: "Les présentes conditions sont soumises au droit camerounais. Tout litige sera soumis à la juridiction compétente de Yaoundé, Cameroun.",
    },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 14 : insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Conditions d'utilisation</Text>
          <Text style={styles.headerSub}>Dernière mise à jour : Janvier 2026</Text>
        </View>
        <View style={styles.headerIcon}>
          <Feather name="file-text" size={20} color="#fff" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.introText}>
            Ces conditions régissent votre utilisation de l'application KDO Cameroun. Veuillez les lire attentivement avant d'utiliser nos services.
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
    backgroundColor: "#F6FFED",
    borderRadius: 10, padding: 14,
    borderLeftWidth: 3, borderLeftColor: "#52C41A",
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
