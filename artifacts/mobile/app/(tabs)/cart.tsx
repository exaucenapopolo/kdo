import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { BOUTIQUE_CITIES, useCity } from "@/context/CityContext";
import { useUserData } from "@/context/UserDataContext";
import { BOUTIQUES } from "@/data/boutiques";
import { formatPrice } from "@/data/products";

// ─── Constants ────────────────────────────────────────────────────────────────
const BIG_CITIES = ["Yaoundé", "Douala", "Bafoussam"];
const SMALL_FEE  = 1000;
const TAB_H      = Platform.OS === "web" ? 84 : 60;
const DOMAIN     = process.env["EXPO_PUBLIC_DOMAIN"] || "kdo-cameroon-app.replit.app";
const API_NOTIFY = `https://${DOMAIN}/api/payment/confirm`;

const PROMO_CODES: Record<string, { gift: string }> = {
  "KDO10":     { gift: "Une clé USB 16Go offerte" },
  "KDO15":     { gift: "Une souris sans fil offerte" },
  "KDO20":     { gift: "Un sac à dos ordinateur offert" },
  "KDO2000":   { gift: "Un antivirus 1 an offert" },
  "BIENVENUE": { gift: "Un chargeur USB offert" },
  "NOEL25":    { gift: "Clé USB + câble chargeur offerts" },
};

const CITY_TO_BOUTIQUE_ID: Record<string, string> = {
  "Yaoundé":    "yaounde",
  "Douala":     "douala",
  "Bafoussam":  "bafoussam",
  "Bertoua":    "bertoua",
  "Dschang":    "dschang",
  "Maroua":     "maroua",
  "Garoua":     "garoua",
  "Ngaoundéré": "ngaoundere",
};

function getDelivFee(city: string, mode: "domicile" | "boutique"): number {
  if (mode === "boutique") return 0;
  return SMALL_FEE;
}

function getDelivDisplay(city: string, mode: "domicile" | "boutique"): string {
  if (mode === "boutique") return "Gratuit";
  if (BIG_CITIES.includes(city)) return "1 000 – 2 000 FCFA*";
  return "1 000 FCFA";
}

type Step = "cart" | "info" | "delivery" | "confirm" | "success";
interface PromoEntry { code: string; gift: string }

async function downloadBoutiquePhoto(imageUrl: string) {
  if (Platform.OS === "web") {
    Linking.openURL(imageUrl);
    return;
  }
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Autorisez l'accès à la galerie pour télécharger la photo.");
      return;
    }
    const filename    = `KDO_Boutique_${Date.now()}.jpg`;
    const destination = new File(Paths.cache, filename);
    const downloaded  = await File.downloadFileAsync(imageUrl, destination);
    await MediaLibrary.saveToLibraryAsync(downloaded.uri);
    Alert.alert("Téléchargé !", "La photo a été sauvegardée dans votre galerie.");
  } catch {
    Alert.alert("Erreur", "Impossible de télécharger la photo.");
  }
}

// ─── Step progress bar ────────────────────────────────────────────────────────
const STEP_DEFS = [
  { id: "cart",     label: "Panier" },
  { id: "info",     label: "Infos" },
  { id: "delivery", label: "Livraison" },
  { id: "confirm",  label: "Confirmer" },
];

function StepBar({ step }: { step: Step }) {
  if (step === "success") return null;
  const idx = STEP_DEFS.findIndex(s => s.id === step);
  return (
    <View style={sb.row}>
      {STEP_DEFS.map((s, i) => {
        const done    = i < idx;
        const current = i === idx;
        return (
          <React.Fragment key={s.id}>
            <View style={sb.item}>
              <View style={[sb.dot, done && sb.dotDone, current && sb.dotCurrent]}>
                {done
                  ? <Feather name="check" size={10} color="#fff" />
                  : <Text style={[sb.num, (current || done) && sb.numActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[sb.lbl, (done || current) && sb.lblActive]}>{s.label}</Text>
            </View>
            {i < STEP_DEFS.length - 1 && (
              <View style={[sb.line, done && sb.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const sb = StyleSheet.create({
  row:        { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  item:       { alignItems: "center", gap: 4 },
  dot:        { width: 24, height: 24, borderRadius: 12, backgroundColor: "#E0E0E0", alignItems: "center", justifyContent: "center" },
  dotDone:    { backgroundColor: "#28A745" },
  dotCurrent: { backgroundColor: "#FF6B00" },
  num:        { fontSize: 11, fontWeight: "700", color: "#bbb" },
  numActive:  { color: "#fff" },
  lbl:        { fontSize: 10, color: "#bbb", fontWeight: "500" },
  lblActive:  { color: "#333", fontWeight: "700" },
  line:       { flex: 1, height: 2, backgroundColor: "#E0E0E0", marginBottom: 12 },
  lineDone:   { backgroundColor: "#28A745" },
});

// ─── Field helper ─────────────────────────────────────────────────────────────
function Field({ label, icon, value, onChangeText, placeholder, kb, multiline }: {
  label: string; icon: string; value: string;
  onChangeText: (v: string) => void;
  placeholder?: string; kb?: any; multiline?: boolean;
}) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={[s.fieldInput, multiline && { height: 80, alignItems: "flex-start", paddingTop: 10 }]}>
        <Feather name={icon as any} size={15} color="#999" style={{ marginTop: multiline ? 2 : 0 }} />
        <TextInput
          style={[s.fieldTxt, multiline && { flex: 1, textAlignVertical: "top" }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C0C0C0"
          keyboardType={kb ?? "default"}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CartScreen() {
  const router                          = useRouter();
  const insets                          = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { user, register, updateProfile } = useAuth();
  const { selectedCity }                = useCity();
  const { saveOrder, addAddress, usedPromos, markPromoUsed } = useUserData();

  const [step, setStep]         = useState<Step>("cart");
  const scrollRef               = useRef<ScrollView>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promo,      setPromo]      = useState<PromoEntry | null>(null);
  const [promoError, setPromoError] = useState("");

  const [custName,  setCustName]  = useState(user?.name  ?? "");
  const [custPhone, setCustPhone] = useState(user?.phone ?? "");
  const [custEmail, setCustEmail] = useState(user?.email ?? "");

  const [delivCity,    setDelivCity]    = useState(selectedCity ?? "Yaoundé");
  const [delivMode,    setDelivMode]    = useState<"domicile" | "boutique">("domicile");
  const [quartier,     setQuartier]     = useState("");
  const [landmark,     setLandmark]     = useState("");
  const [instructions, setInstructions] = useState("");
  const [showCityDrop, setShowCityDrop] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef,     setOrderRef]     = useState("");
  const [boutiqueZoom, setBoutiqueZoom] = useState(false);

  useEffect(() => {
    if (user) { setCustName(user.name); setCustPhone(user.phone); if (user.email) setCustEmail(user.email); }
  }, [user]);

  useEffect(() => { if (selectedCity) setDelivCity(selectedCity); }, [selectedCity]);
  useEffect(() => { scrollRef.current?.scrollTo({ y: 0, animated: true }); }, [step]);

  // ── Computed ──────────────────────────────────────────────────────────────
  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivFee   = getDelivFee(delivCity, delivMode);
  const total      = subtotal + delivFee;
  const earnPoints = Math.floor(total / 2000); // 2 000 FCFA = 1 point

  // Boutique de la ville sélectionnée
  const boutiqueId = CITY_TO_BOUTIQUE_ID[delivCity];
  const boutique   = BOUTIQUES.find(b => b.id === boutiqueId);

  // ── Promo ─────────────────────────────────────────────────────────────────
  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError("Entrez votre code promo KDO"); return; }
    if (usedPromos.includes(code)) { setPromoError("Ce code a déjà été utilisé"); return; }
    const entry = PROMO_CODES[code];
    if (!entry) { setPromoError("Code invalide. Obtenez votre code en boutique ou chez un agent KDO."); return; }
    setPromo({ code, gift: entry.gift });
    setPromoError("");
    setPromoInput("");
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = () => {
    if (step === "cart") {
      if (items.length === 0) { Alert.alert("Panier vide", "Ajoutez des produits pour commander."); return; }
      setStep(user ? "delivery" : "info");
    } else if (step === "info") {
      if (!custName.trim()) { Alert.alert("Nom requis", "Entrez votre nom complet."); return; }
      const digits = custPhone.replace(/\D/g, "");
      if (digits.length < 8) { Alert.alert("Téléphone invalide", "Ex: 691234567 ou +237691234567"); return; }
      setStep("delivery");
    } else if (step === "delivery") {
      if (delivMode === "domicile" && !quartier.trim()) {
        Alert.alert("Quartier requis", "Indiquez votre quartier pour la livraison à domicile."); return;
      }
      setStep("confirm");
    } else if (step === "confirm") {
      handleConfirm();
    }
  };

  const goBack = () => {
    if (step === "cart")     { router.back(); return; }
    if (step === "info")     { setStep("cart"); return; }
    if (step === "delivery") { setStep(user ? "cart" : "info"); return; }
    if (step === "confirm")  { setStep("delivery"); return; }
  };

  // ── Confirm ───────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setIsSubmitting(true);

    const orderData = {
      date:          new Date().toLocaleString("fr-FR"),
      items:         items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal,
      discount:      0,
      deliveryPrice: delivFee,
      grandTotal:    total,
      promoGift:     promo ? promo.gift : undefined,
      delivery: {
        fullName:     custName.trim(),
        phone:        custPhone.trim(),
        city:         delivCity,
        quartier:     quartier.trim(),
        deliveryMode: delivMode,
        address:      `${quartier.trim()}${landmark.trim() ? " — " + landmark.trim() : ""}`,
        instructions: instructions.trim(),
      },
      whatsappPhone: custPhone.trim(),
      callPhone:     custPhone.trim(),
      userEmail:     custEmail.trim() || undefined,
      paymentMethod: "Paiement à la livraison",
      promoCode:     promo?.code,
      points:        earnPoints,
    };

    try {
      // Sync identité utilisateur si nécessaire
      if (!user && custName.trim() && custPhone.trim()) {
        try { await register({ name: custName.trim(), phone: custPhone.trim(), email: custEmail.trim() || undefined }); } catch {}
      } else if (user && (custName.trim() !== user.name || custPhone.trim() !== user.phone)) {
        try { await updateProfile({ name: custName.trim(), phone: custPhone.trim() }); } catch {}
      }

      // Sauvegarde de la commande (server PostgreSQL → ref assignée par le serveur)
      const savedOrder = await saveOrder(orderData as any);
      const ref = savedOrder.ref;

      // Auto-enregistrement de l'adresse de livraison dans le profil
      if (delivMode === "domicile" && quartier.trim()) {
        try {
          await addAddress({
            label:        `Domicile ${delivCity}`,
            fullName:     custName.trim(),
            phone:        custPhone.trim(),
            city:         delivCity,
            quartier:     quartier.trim(),
            address:      `${quartier.trim()}${landmark.trim() ? " — " + landmark.trim() : ""}`,
            deliveryMode: delivMode,
            instructions: instructions.trim(),
          });
        } catch {}
      }

      if (promo) await markPromoUsed(promo.code);

      fetch(API_NOTIFY, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ order: { ...savedOrder } }),
      }).catch(() => {});

      setOrderRef(ref);
      clearCart();
      setStep("success");
    } catch {
      Alert.alert("Erreur", "Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  EMPTY CART
  // ─────────────────────────────────────────────────────────────────────────
  if (items.length === 0 && step === "cart") {
    return (
      <View style={s.root}>
        <View style={[s.topBar, { paddingTop: Platform.OS === "web" ? 14 : insets.top + 6 }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={s.topTitle}>Mon Panier</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.emptyWrap}>
          <View style={s.emptyIcon}><Feather name="shopping-cart" size={46} color="#FF6B00" /></View>
          <Text style={s.emptyTitle}>Panier vide</Text>
          <Text style={s.emptySub}>Ajoutez des produits pour passer commande</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={() => router.push("/(tabs)/" as any)}>
            <Text style={s.emptyBtnTxt}>Découvrir nos produits</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  SUCCESS
  // ─────────────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <View style={s.root}>
        <ScrollView
          contentContainerStyle={[s.successWrap, { paddingTop: Platform.OS === "web" ? 40 : insets.top + 20, paddingBottom: TAB_H + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.successCheck}><Feather name="check" size={42} color="#fff" /></View>
          <Text style={s.successTitle}>Commande confirmée !</Text>
          <Text style={s.successGreet}>Merci {custName.split(" ")[0]} 🎉</Text>

          <View style={s.successCard}>
            {[
              { icon: "hash",      lbl: "Référence",  val: orderRef },
              { icon: "map-pin",   lbl: "Ville",      val: delivCity },
              { icon: "user",      lbl: "Nom",        val: custName },
              { icon: "phone",     lbl: "Téléphone",  val: custPhone },
            ].map((row, i) => (
              <React.Fragment key={row.lbl}>
                {i > 0 && <View style={s.successDivider} />}
                <View style={s.successRow}>
                  <Feather name={row.icon as any} size={13} color="#999" />
                  <Text style={s.successLbl}>{row.lbl}</Text>
                  <Text style={s.successVal}>{row.val}</Text>
                </View>
              </React.Fragment>
            ))}
            <View style={s.successDivider} />
            <View style={s.successRow}>
              <Feather name="dollar-sign" size={13} color="#FF6B00" />
              <Text style={s.successLbl}>Total à payer</Text>
              <Text style={[s.successVal, { color: "#FF6B00", fontWeight: "800" }]}>{formatPrice(total)}</Text>
            </View>
            {BIG_CITIES.includes(delivCity) && delivMode === "domicile" && (
              <>
                <View style={s.successDivider} />
                <View style={s.successRow}>
                  <Feather name="info" size={13} color="#999" />
                  <Text style={[s.successLbl, { flex: 1 }]}>Livraison</Text>
                  <Text style={[s.successVal, { fontSize: 11, color: "#888" }]}>1 000–2 000 FCFA*</Text>
                </View>
              </>
            )}
          </View>

          {promo && (
            <View style={s.giftBox}>
              <Feather name="gift" size={18} color="#FF6B00" />
              <View style={{ flex: 1 }}>
                <Text style={s.giftTitle}>Cadeau KDO offert 🎁</Text>
                <Text style={s.giftSub}>{promo.gift} · livré avec votre commande</Text>
              </View>
            </View>
          )}

          <View style={[s.padBox, { flexDirection: "row", gap: 12, alignItems: "flex-start" }]}>
            <Feather name="truck" size={20} color="#fff" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={s.padTitle}>Paiement à la livraison</Text>
              <Text style={s.padText}>
                Notre livreur vous contactera sur le <Text style={{ fontWeight: "700" }}>{custPhone}</Text> pour organiser la livraison.{"\n"}
                Vous payez uniquement après avoir vérifié votre commande.
              </Text>
            </View>
          </View>

          {BIG_CITIES.includes(delivCity) && delivMode === "domicile" && (
            <View style={s.noteVariableFee}>
              <Feather name="info" size={12} color="#856404" />
              <Text style={s.noteVariableFeeTxt}>* Frais de livraison entre 1 000 et 2 000 FCFA selon votre quartier à {delivCity}. Notre équipe vous confirmera le montant exact lors du contact.</Text>
            </View>
          )}

          {earnPoints > 0 && (
            <View style={s.pointsEarned}>
              <Feather name="star" size={14} color="#FF6B00" />
              <Text style={s.pointsEarnedTxt}> Vous avez gagné <Text style={{ fontWeight: "800", color: "#FF6B00" }}>{earnPoints} points KDO</Text> !</Text>
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[s.successHomeBtn, { flex: 1, backgroundColor: "#0066CC" }]}
              onPress={() => router.push("/(tabs)/profile" as any)}
            >
              <Feather name="package" size={15} color="#fff" />
              <Text style={s.successHomeTxt}> Mes commandes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.successHomeBtn, { flex: 1 }]}
              onPress={() => router.push("/(tabs)/" as any)}
            >
              <Feather name="home" size={15} color="#fff" />
              <Text style={s.successHomeTxt}> Accueil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  CHECKOUT
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header */}
      <View style={[s.topBar, { paddingTop: Platform.OS === "web" ? 14 : insets.top + 6 }]}>
        <TouchableOpacity style={s.backBtn} onPress={goBack}>
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={s.topTitle}>
          {step === "cart"     ? `Panier (${items.length})`
           : step === "info"     ? "Vos informations"
           : step === "delivery" ? "Livraison"
           : "Récapitulatif"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <StepBar step={step} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: TAB_H + 150 }}
      >
        {/* ── STEP: CART ─────────────────────────────────────────────── */}
        {step === "cart" && (
          <View>
            {items.map(item => (
              <View key={item.id} style={s.cartItem}>
                <Image source={{ uri: item.image }} style={s.cartImg} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={s.cartName} numberOfLines={2}>{item.name}</Text>
                  <Text style={s.cartPrice}>{formatPrice(item.price)}</Text>
                </View>
                <View style={s.qtyRow}>
                  <TouchableOpacity style={s.qtyBtn}
                    onPress={() => item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}>
                    <Feather name={item.quantity <= 1 ? "trash-2" : "minus"} size={13}
                      color={item.quantity <= 1 ? "#FF4D4F" : "#555"} />
                  </TouchableOpacity>
                  <Text style={s.qtyNum}>{item.quantity}</Text>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Feather name="plus" size={13} color="#FF6B00" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Code promo KDO */}
            <View style={s.block}>
              <Text style={s.blockTitle}>Code promo KDO</Text>
              <View style={s.promoHint}>
                <Feather name="tag" size={13} color="#FF6B00" />
                <Text style={s.promoHintTxt}>Obtenez votre code promo en boutique ou auprès d'un agent KDO pour recevoir un cadeau avec votre commande.</Text>
              </View>
              {promo ? (
                <View style={s.promoApplied}>
                  <Feather name="gift" size={15} color="#28A745" />
                  <Text style={s.promoAppliedTxt}>🎁 {promo.gift}</Text>
                  <TouchableOpacity onPress={() => setPromo(null)} style={{ marginLeft: "auto" }}>
                    <Feather name="x" size={15} color="#FF4D4F" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={s.promoRow}>
                  <TextInput
                    style={s.promoInput}
                    placeholder="Votre code promo KDO"
                    placeholderTextColor="#C0C0C0"
                    value={promoInput}
                    onChangeText={v => { setPromoInput(v.toUpperCase()); setPromoError(""); }}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity style={s.promoBtn} onPress={applyPromo}>
                    <Text style={s.promoBtnTxt}>Appliquer</Text>
                  </TouchableOpacity>
                </View>
              )}
              {!!promoError && <Text style={s.promoError}>{promoError}</Text>}
            </View>

            {/* Summary */}
            <View style={s.block}>
              <Text style={s.blockTitle}>Récapitulatif</Text>
              <View style={s.sumRow}>
                <Text style={s.sumLbl}>Sous-total</Text>
                <Text style={s.sumVal}>{formatPrice(subtotal)}</Text>
              </View>
              <View style={s.sumRow}>
                <Text style={s.sumLbl}>Livraison domicile (est.)</Text>
                <Text style={s.sumVal}>{getDelivDisplay(delivCity, "domicile")}</Text>
              </View>
              {BIG_CITIES.includes(delivCity) && (
                <Text style={s.bigCityNote}>* Frais confirmés par notre équipe entre 1 000 et 2 000 FCFA</Text>
              )}
              <View style={[s.sumRow, s.sumTotalRow]}>
                <Text style={s.sumTotalLbl}>Estimé</Text>
                <Text style={s.sumTotalVal}>{formatPrice(subtotal + SMALL_FEE)}</Text>
              </View>
              <Text style={s.delivNote}>💰 Paiement à la livraison · Retrait boutique = livraison gratuite</Text>
            </View>
          </View>
        )}

        {/* ── STEP: INFO ─────────────────────────────────────────────── */}
        {step === "info" && (
          <View style={s.formWrap}>
            <View style={s.heroBox}>
              <Feather name="user" size={20} color="#FF6B00" />
              <View style={{ flex: 1 }}>
                <Text style={s.heroTitle}>Vos coordonnées</Text>
                <Text style={s.heroSub}>Pour vous contacter lors de la livraison</Text>
              </View>
            </View>
            <Field label="Nom complet *" icon="user" value={custName} onChangeText={setCustName} placeholder="Jean Dupont" />
            <Field label="Téléphone WhatsApp / Appel *" icon="phone" value={custPhone} onChangeText={setCustPhone} placeholder="691 234 567" kb="phone-pad" />
            <Field label="Email (optionnel)" icon="mail" value={custEmail} onChangeText={setCustEmail} placeholder="vous@email.com" kb="email-address" />
            {!user && (
              <View style={s.noteBox}>
                <Feather name="info" size={13} color="#2563EB" />
                <Text style={s.noteBoxTxt}>Un compte KDO sera créé automatiquement pour suivre vos commandes.</Text>
              </View>
            )}
          </View>
        )}

        {/* ── STEP: DELIVERY ─────────────────────────────────────────── */}
        {step === "delivery" && (
          <View style={s.formWrap}>
            {/* City */}
            <Text style={s.fieldLabel}>Ville de livraison *</Text>
            <TouchableOpacity style={s.cityPicker} onPress={() => setShowCityDrop(v => !v)}>
              <Feather name="map-pin" size={15} color="#FF6B00" />
              <Text style={s.cityPickerTxt}>{delivCity}</Text>
              <Feather name={showCityDrop ? "chevron-up" : "chevron-down"} size={14} color="#999" />
            </TouchableOpacity>
            {showCityDrop && (
              <View style={s.cityDrop}>
                {BOUTIQUE_CITIES.map(city => (
                  <TouchableOpacity key={city} style={[s.cityOpt, delivCity === city && s.cityOptActive]}
                    onPress={() => { setDelivCity(city); setShowCityDrop(false); }}>
                    <Text style={[s.cityOptTxt, delivCity === city && s.cityOptTxtActive]}>{city}</Text>
                    {delivCity === city && <Feather name="check" size={13} color="#FF6B00" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Mode */}
            <Text style={[s.fieldLabel, { marginTop: 16 }]}>Mode de réception *</Text>
            <View style={s.modeRow}>
              {([
                { id: "domicile" as const, icon: "home",    label: "Livraison domicile", sub: getDelivDisplay(delivCity, "domicile") },
                { id: "boutique" as const, icon: "map-pin", label: "Retrait boutique",   sub: "Gratuit" },
              ]).map(m => (
                <TouchableOpacity key={m.id} style={[s.modeCard, delivMode === m.id && s.modeCardActive]}
                  onPress={() => setDelivMode(m.id)}>
                  <Feather name={m.icon as any} size={20} color={delivMode === m.id ? "#FF6B00" : "#aaa"} />
                  <Text style={[s.modeLabel, delivMode === m.id && s.modeLabelActive]}>{m.label}</Text>
                  <Text style={[s.modeSub, delivMode === m.id && { color: "#FF6B00" }]}>{m.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {BIG_CITIES.includes(delivCity) && delivMode === "domicile" && (
              <View style={s.noteBox}>
                <Feather name="info" size={13} color="#2563EB" />
                <Text style={s.noteBoxTxt}>À {delivCity}, la livraison est entre <Text style={{ fontWeight: "700" }}>1 000 et 2 000 FCFA</Text> selon votre quartier. Notre équipe vous confirmera le montant exact.</Text>
              </View>
            )}

            {delivMode === "domicile" && (
              <>
                <Field label="Quartier *" icon="navigation" value={quartier} onChangeText={setQuartier}
                  placeholder="Ex: Bastos, Melen, Omnisport…" />
                <Field label="Repère (optionnel)" icon="map" value={landmark} onChangeText={setLandmark}
                  placeholder="Ex: Près de la pharmacie, immeuble bleu…" />
                <Field label="Instructions pour le livreur (optionnel)" icon="message-circle"
                  value={instructions} onChangeText={setInstructions}
                  placeholder="Ex: Appeler avant d'arriver · Laisser au gardien…"
                  multiline />
              </>
            )}

            {/* Boutique card */}
            {delivMode === "boutique" && boutique && (
              <>
                <View style={s.boutiqueCard}>
                  {/* Photo cliquable */}
                  <TouchableOpacity activeOpacity={0.88} onPress={() => setBoutiqueZoom(true)}>
                    <View style={s.boutiqueImgWrap}>
                      <Image source={{ uri: boutique.image }} style={s.boutiqueImg} resizeMode="cover" />
                      <View style={s.boutiqueImgHint}>
                        <Feather name="zoom-in" size={13} color="#fff" />
                        <Text style={s.boutiqueImgHintTxt}> Agrandir / Télécharger</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={s.boutiqueBody}>
                    <Text style={s.boutiqueName}>Boutique KDO — {boutique.ville}</Text>
                    <Text style={s.boutiqueDesc}>{boutique.description}</Text>
                    <Text style={s.boutiqueAddr} numberOfLines={4}>{boutique.indication}</Text>
                    <TouchableOpacity
                      style={s.boutiqueMapBtn}
                      onPress={() => Linking.openURL(`https://maps.google.com/?q=KDO+Informatique+${encodeURIComponent(boutique.ville)}+Cameroun`)}>
                      <Feather name="map-pin" size={13} color="#0066CC" />
                      <Text style={s.boutiqueMapTxt}>Voir sur Google Maps</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Modal zoom photo boutique */}
                <Modal visible={boutiqueZoom} transparent animationType="fade" onRequestClose={() => setBoutiqueZoom(false)}>
                  <View style={s.zoomOverlay}>
                    <Image source={{ uri: boutique.image }} style={s.zoomFull} resizeMode="contain" />

                    <TouchableOpacity
                      style={s.zoomDownloadBtn}
                      onPress={() => downloadBoutiquePhoto(boutique.image)}
                    >
                      <Feather name="download" size={15} color="#fff" />
                      <Text style={s.zoomDownloadTxt}> Télécharger la photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.zoomCloseBtn} onPress={() => setBoutiqueZoom(false)}>
                      <Feather name="x" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </Modal>
              </>
            )}
          </View>
        )}

        {/* ── STEP: CONFIRM ──────────────────────────────────────────── */}
        {step === "confirm" && (
          <View style={s.formWrap}>
            <View style={s.confirmSection}>
              <Text style={s.confirmTitle}><Feather name="user" size={12} /> Client</Text>
              <Text style={s.confirmLine}>{custName}</Text>
              <Text style={s.confirmLine}>{custPhone}</Text>
              {!!custEmail && <Text style={s.confirmLine}>{custEmail}</Text>}
            </View>

            <View style={s.confirmSection}>
              <Text style={s.confirmTitle}><Feather name="truck" size={12} /> Livraison</Text>
              <Text style={s.confirmLine}>
                {delivMode === "domicile" ? "À domicile" : "Retrait boutique"} · {delivCity}
              </Text>
              {!!quartier && <Text style={s.confirmLine}>{quartier}{landmark ? ` — ${landmark}` : ""}</Text>}
              {!!instructions && <Text style={[s.confirmLine, { color: "#999", fontStyle: "italic" }]}>"{instructions}"</Text>}
            </View>

            <View style={s.confirmSection}>
              <Text style={s.confirmTitle}><Feather name="shopping-bag" size={12} /> Articles ({items.length})</Text>
              {items.map(item => (
                <View key={item.id} style={s.confirmItemRow}>
                  <Text style={s.confirmItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={s.confirmItemAmt}>×{item.quantity} · {formatPrice(item.price * item.quantity)}</Text>
                </View>
              ))}
            </View>

            {promo && (
              <View style={s.giftBox}>
                <Feather name="gift" size={16} color="#FF6B00" />
                <View style={{ flex: 1 }}>
                  <Text style={s.giftTitle}>Cadeau KDO offert 🎁</Text>
                  <Text style={s.giftSub}>{promo.gift}</Text>
                </View>
              </View>
            )}

            <View style={s.confirmSection}>
              <Text style={s.confirmTitle}><Feather name="dollar-sign" size={12} /> Montants</Text>
              <View style={s.confirmRow}><Text style={s.confirmLbl}>Sous-total</Text><Text style={s.confirmAmt}>{formatPrice(subtotal)}</Text></View>
              <View style={s.confirmRow}>
                <Text style={s.confirmLbl}>Livraison</Text>
                <Text style={s.confirmAmt}>{delivFee === 0 ? "Gratuit" : BIG_CITIES.includes(delivCity) ? "1 000 – 2 000 FCFA*" : formatPrice(delivFee)}</Text>
              </View>
              <View style={[s.confirmRow, s.confirmTotalRow]}>
                <Text style={s.confirmTotalLbl}>TOTAL À PAYER</Text>
                <Text style={s.confirmTotalAmt}>{formatPrice(total)}{BIG_CITIES.includes(delivCity) && delivMode === "domicile" ? "*" : ""}</Text>
              </View>
              {BIG_CITIES.includes(delivCity) && delivMode === "domicile" && (
                <Text style={{ fontSize: 10, color: "#888", marginTop: 4 }}>* Livraison entre 1 000 et 2 000 FCFA confirmée par notre équipe</Text>
              )}
            </View>

            <View style={s.padBox}>
              <Text style={s.padTitle}>💰 Paiement à la livraison</Text>
              <Text style={s.padText}>
                Vous ne payez rien maintenant. Notre livreur arrive avec votre commande. Vous vérifiez, vous acceptez, vous payez en espèces.
              </Text>
            </View>

            {earnPoints > 0 && (
              <View style={s.pointsPrev}>
                <Feather name="star" size={13} color="#FF6B00" />
                <Text style={s.pointsPrevTxt}> Vous gagnerez <Text style={{ fontWeight: "800" }}>{earnPoints} points KDO</Text> après livraison</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer CTA — positionné AU-DESSUS de la barre de navigation */}
      <View style={[s.footer, { bottom: TAB_H }]}>
        {step === "cart" && (
          <View style={s.footerInfo}>
            <Text style={s.footerTotal}>{formatPrice(subtotal)}</Text>
            <Text style={s.footerCount}>{items.length} article{items.length > 1 ? "s" : ""}</Text>
          </View>
        )}
        <TouchableOpacity style={[s.ctaBtn, isSubmitting && { opacity: 0.7 }]} onPress={goNext} disabled={isSubmitting}>
          {isSubmitting
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.ctaTxt}>
                {step === "cart"     ? "Commander maintenant"
                 : step === "info"     ? "Continuer →"
                 : step === "delivery" ? "Voir le récapitulatif →"
                 : "✓ Confirmer — Payer à la livraison"}
              </Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F8FA" },

  topBar:   { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  backBtn:  { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "700", color: "#1A1A1A" },

  emptyWrap:  { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 },
  emptyIcon:  { width: 80, height: 80, borderRadius: 40, backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  emptySub:   { fontSize: 13, color: "#888", textAlign: "center" },
  emptyBtn:   { backgroundColor: "#FF6B00", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 10, marginTop: 6 },
  emptyBtnTxt:{ color: "#fff", fontWeight: "700", fontSize: 14 },

  cartItem:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fff", marginHorizontal: 12, marginTop: 10, borderRadius: 10, padding: 10, elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  cartImg:   { width: 64, height: 64, borderRadius: 8, backgroundColor: "#F5F5F5" },
  cartName:  { fontSize: 12, fontWeight: "600", color: "#1A1A1A", marginBottom: 4 },
  cartPrice: { fontSize: 13, fontWeight: "800", color: "#FF6B00" },
  qtyRow:    { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn:    { width: 30, height: 30, borderRadius: 15, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center" },
  qtyNum:    { fontSize: 14, fontWeight: "700", color: "#1A1A1A", minWidth: 20, textAlign: "center" },

  block:      { backgroundColor: "#fff", margin: 12, borderRadius: 10, padding: 14, elevation: 1, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 3 },
  blockTitle: { fontSize: 11, fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 },

  promoHint:    { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#FFF3E0", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#FFD0A0", marginBottom: 10 },
  promoHintTxt: { flex: 1, fontSize: 12, color: "#7C4A00", lineHeight: 17 },
  promoRow:       { flexDirection: "row", gap: 8 },
  promoInput:     { flex: 1, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: "#1A1A1A", backgroundColor: "#FAFAFA" },
  promoBtn:       { backgroundColor: "#FF6B00", paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8, justifyContent: "center" },
  promoBtnTxt:    { color: "#fff", fontWeight: "700", fontSize: 13 },
  promoApplied:   { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F0FDF4", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#BBF7D0" },
  promoAppliedTxt:{ flex: 1, fontSize: 13, color: "#166534", fontWeight: "600" },
  promoError:     { color: "#FF4D4F", fontSize: 12, marginTop: 6 },

  sumRow:      { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sumLbl:      { fontSize: 13, color: "#666" },
  sumVal:      { fontSize: 13, fontWeight: "600", color: "#333" },
  bigCityNote: { fontSize: 10, color: "#888", marginBottom: 8, fontStyle: "italic" },
  sumTotalRow: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  sumTotalLbl: { fontSize: 15, fontWeight: "800", color: "#1A1A1A" },
  sumTotalVal: { fontSize: 16, fontWeight: "800", color: "#FF6B00" },
  delivNote:   { fontSize: 11, color: "#aaa", marginTop: 10, textAlign: "center", lineHeight: 16 },

  formWrap:  { padding: 14, gap: 2 },
  heroBox:   { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#FFF3E0", borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#FFD0A0" },
  heroTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },
  heroSub:   { fontSize: 12, color: "#888", marginTop: 2 },
  fieldWrap: { marginBottom: 12 },
  fieldLabel:{ fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 6 },
  fieldInput:{ flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#fff" },
  fieldTxt:  { flex: 1, fontSize: 14, color: "#1A1A1A" },
  noteBox:   { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EFF6FF", borderRadius: 10, padding: 12, marginTop: 4, marginBottom: 12, borderWidth: 1, borderColor: "#BFDBFE" },
  noteBoxTxt:{ flex: 1, fontSize: 12, color: "#1D4ED8", lineHeight: 18 },

  cityPicker:    { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, backgroundColor: "#fff", marginBottom: 4 },
  cityPickerTxt: { flex: 1, fontSize: 14, fontWeight: "600", color: "#FF6B00" },
  cityDrop:      { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, backgroundColor: "#fff", overflow: "hidden", marginBottom: 12 },
  cityOpt:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  cityOptActive: { backgroundColor: "#FFF3E0" },
  cityOptTxt:    { fontSize: 14, color: "#333" },
  cityOptTxtActive: { color: "#FF6B00", fontWeight: "700" },

  modeRow:        { flexDirection: "row", gap: 10, marginBottom: 14 },
  modeCard:       { flex: 1, alignItems: "center", gap: 6, padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: "#E0E0E0", backgroundColor: "#fff" },
  modeCardActive: { borderColor: "#FF6B00", backgroundColor: "#FFF3E0" },
  modeLabel:      { fontSize: 12, fontWeight: "600", color: "#888", textAlign: "center" },
  modeLabelActive:{ color: "#FF6B00" },
  modeSub:        { fontSize: 11, color: "#aaa", textAlign: "center" },

  boutiqueCard:       { borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#fff", marginTop: 4, marginBottom: 12 },
  boutiqueImgWrap:    { width: "100%", height: 160, position: "relative" },
  boutiqueImg:        { width: "100%", height: "100%" },
  boutiqueImgHint:    { position: "absolute", bottom: 8, right: 10, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  boutiqueImgHintTxt: { color: "#fff", fontSize: 11, fontWeight: "600" },
  boutiqueBody:       { padding: 14, gap: 6 },
  boutiqueName:       { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  boutiqueDesc:       { fontSize: 11, color: "#FF6B00", fontWeight: "600" },
  boutiqueAddr:       { fontSize: 12, color: "#555", lineHeight: 18 },
  boutiqueMapBtn:     { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  boutiqueMapTxt:     { fontSize: 12, color: "#0066CC", fontWeight: "600", textDecorationLine: "underline" },
  zoomOverlay:        { flex: 1, backgroundColor: "rgba(0,0,0,0.93)", justifyContent: "center", alignItems: "center" },
  zoomFull:           { width: "95%", height: "70%" },
  zoomDownloadBtn:    { flexDirection: "row", alignItems: "center", backgroundColor: "#FF6B00", borderRadius: 10, paddingHorizontal: 22, paddingVertical: 12, marginTop: 18, gap: 6 },
  zoomDownloadTxt:    { color: "#fff", fontSize: 14, fontWeight: "800" },
  zoomCloseBtn:       { position: "absolute", top: Platform.OS === "web" ? 16 : 52, right: 18, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, padding: 9 },

  confirmSection: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, elevation: 1, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 3 },
  confirmTitle:   { fontSize: 11, fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 },
  confirmLine:    { fontSize: 13, color: "#333", marginBottom: 3 },
  confirmItemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  confirmItemName:{ flex: 1, fontSize: 12, color: "#333" },
  confirmItemAmt: { fontSize: 12, fontWeight: "600", color: "#555", marginLeft: 8 },
  confirmRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  confirmLbl:     { fontSize: 13, color: "#666" },
  confirmAmt:     { fontSize: 13, fontWeight: "700", color: "#333" },
  confirmTotalRow:{ marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  confirmTotalLbl:{ fontSize: 14, fontWeight: "800", color: "#1A1A1A" },
  confirmTotalAmt:{ fontSize: 16, fontWeight: "800", color: "#FF6B00" },

  giftBox:   { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#FFF3E0", borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#FFD0A0" },
  giftTitle: { fontSize: 13, fontWeight: "700", color: "#CC5500" },
  giftSub:   { fontSize: 12, color: "#7C4A00", marginTop: 2 },

  padBox:   { backgroundColor: "#0066CC", borderRadius: 12, padding: 16, marginBottom: 10 },
  padTitle: { fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 6 },
  padText:  { fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 20 },

  noteVariableFee:    { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#FFF8E1", borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#FFE082" },
  noteVariableFeeTxt: { flex: 1, fontSize: 11, color: "#856404", lineHeight: 16 },

  pointsPrev:    { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF3E0", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#FFD0A0" },
  pointsPrevTxt: { fontSize: 13, color: "#555" },

  successWrap:   { alignItems: "center", padding: 24, gap: 14 },
  successCheck:  { width: 80, height: 80, borderRadius: 40, backgroundColor: "#28A745", alignItems: "center", justifyContent: "center" },
  successTitle:  { fontSize: 24, fontWeight: "800", color: "#1A1A1A" },
  successGreet:  { fontSize: 14, color: "#888" },
  successCard:   { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6 },
  successRow:    { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  successLbl:    { flex: 1, fontSize: 13, color: "#999" },
  successVal:    { fontSize: 13, fontWeight: "700", color: "#1A1A1A" },
  successDivider:{ height: 1, backgroundColor: "#F5F5F5" },
  pointsEarned:  { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF3E0", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#FFD0A0", width: "100%" },
  pointsEarnedTxt:{ fontSize: 13, color: "#555" },
  successHomeBtn:{ flexDirection: "row", alignItems: "center", backgroundColor: "#FF6B00", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginTop: 6 },
  successHomeTxt:{ color: "#fff", fontWeight: "700", fontSize: 15 },

  footer:     { position: "absolute", left: 0, right: 0, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F0F0F0", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, gap: 4 },
  footerInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  footerTotal:{ fontSize: 17, fontWeight: "800", color: "#FF6B00" },
  footerCount:{ fontSize: 12, color: "#888" },
  ctaBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#FF6B00", borderRadius: 12, paddingVertical: 15 },
  ctaTxt:     { color: "#fff", fontWeight: "700", fontSize: 15, textAlign: "center" },
});
