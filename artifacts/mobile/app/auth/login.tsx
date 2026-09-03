import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

const LOGO    = "https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/logos.png";
const PRIMARY = "#FF6B00";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register, user } = useAuth();

  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  if (user) {
    router.replace("/(tabs)");
    return null;
  }

  const handleRegister = async () => {
    if (!name.trim()) { setError("Entrez votre nom complet"); return; }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) { setError("Numéro invalide (ex: 691 234 567)"); return; }
    setError("");
    setLoading(true);
    try {
      await register({ name: name.trim(), phone: phone.trim() });
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[s.root, { paddingTop: Platform.OS === "web" ? 0 : insets.top }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card */}
          <View style={s.card}>
            {/* Header orange */}
            <View style={s.header}>
              <Image source={{ uri: LOGO }} style={s.logo} resizeMode="contain" />
              <Text style={s.headerSub}>Bienvenue chez KDO Cameroun</Text>
            </View>

            {/* Body */}
            <View style={s.body}>
              <Text style={s.title}>Créer votre profil</Text>
              <Text style={s.desc}>
                Enregistrez votre nom et numéro pour suivre vos commandes et accéder à vos points KDO.{"\n"}
                <Text style={{ color: PRIMARY, fontWeight: "700" }}>Aucun mot de passe requis.</Text>
              </Text>

              {!!error && (
                <View style={s.errorBox}>
                  <Feather name="alert-circle" size={15} color="#DC3545" />
                  <Text style={s.errorTxt}>{error}</Text>
                </View>
              )}

              {/* Name */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>Nom complet *</Text>
                <View style={s.fieldRow}>
                  <Feather name="user" size={15} color="#999" />
                  <TextInput
                    style={s.fieldInput}
                    placeholder="Jean Dupont"
                    placeholderTextColor="#C0C0C0"
                    value={name}
                    onChangeText={v => { setName(v); setError(""); }}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>Téléphone *</Text>
                <View style={s.fieldRow}>
                  <Feather name="phone" size={15} color="#999" />
                  <TextInput
                    style={s.fieldInput}
                    placeholder="691 234 567"
                    placeholderTextColor="#C0C0C0"
                    value={phone}
                    onChangeText={v => { setPhone(v); setError(""); }}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={[s.ctaBtn, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.ctaTxt}>Créer mon profil KDO</Text>
                }
              </TouchableOpacity>

              {/* Separator */}
              <View style={s.sep}>
                <View style={s.sepLine} />
                <Text style={s.sepTxt}>ou</Text>
                <View style={s.sepLine} />
              </View>

              {/* Guest CTA */}
              <TouchableOpacity style={s.guestBtn} onPress={() => router.replace("/(tabs)")}>
                <Feather name="shopping-bag" size={15} color={PRIMARY} />
                <Text style={s.guestTxt}> Commander sans compte</Text>
              </TouchableOpacity>

              <Text style={s.hint}>
                Votre profil sera aussi créé automatiquement lors de votre première commande.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: PRIMARY },
  scroll: { flexGrow: 1, padding: 16, paddingBottom: 48, justifyContent: "center" },
  card:   { backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", elevation: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 20 },

  header:    { backgroundColor: PRIMARY, paddingVertical: 32, paddingHorizontal: 24, alignItems: "center" },
  logo:      { width: 180, height: 72, marginBottom: 10 },
  headerSub: { color: "rgba(255,255,255,0.9)", fontSize: 14, textAlign: "center" },

  body:  { padding: 28, gap: 0 },
  title: { fontSize: 22, fontWeight: "700", color: "#1A1A1A", marginBottom: 8 },
  desc:  { fontSize: 13, color: "#666", lineHeight: 20, marginBottom: 24 },

  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFF3F3", borderWidth: 1, borderColor: "#DC3545", borderRadius: 8, padding: 12, marginBottom: 20 },
  errorTxt: { color: "#DC3545", fontSize: 13, flex: 1 },

  fieldWrap:  { marginBottom: 18 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6 },
  fieldRow:   { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#FAFAFA" },
  fieldInput: { flex: 1, fontSize: 14, color: "#1A1A1A" },

  ctaBtn: { backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 14, alignItems: "center", marginBottom: 8, elevation: 3 },
  ctaTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

  sep:     { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 20 },
  sepLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  sepTxt:  { fontSize: 13, color: "#aaa" },

  guestBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 10, paddingVertical: 13, marginBottom: 16 },
  guestTxt: { fontSize: 14, fontWeight: "700", color: PRIMARY },

  hint: { fontSize: 11, color: "#aaa", textAlign: "center", lineHeight: 16 },
});
