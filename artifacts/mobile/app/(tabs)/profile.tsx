import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Appearance,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useUserData } from "@/context/UserDataContext";

const LOGO = "https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/logos.png";
const APP_VERSION = "1.3.0";
const SETTINGS_KEY  = "@kdo_settings";
const CLOUDINARY_CLOUD  = "do83voiqy";
const CLOUDINARY_PRESET = "afrikdigitalo_upload";

type SubScreen = "main" | "edit" | "orders" | "addresses" | "points" | "settings" | "security" | "about" | "addAddress";

interface SavedAddress {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

interface OrderRecord {
  ref: string;
  date: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; image?: string }>;
  grandTotal: number;
  paymentMethod: string;
  delivery: { city: string; deliveryMode: string; fullName: string };
  points?: number;
  status?: string;
  statusMessage?: string;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending:   "En attente",
  confirmed: "Confirmée",
  shipped:   "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};
const ORDER_STATUS_COLORS: Record<string, string> = {
  pending:   "#FF9800",
  confirmed: "#0066CC",
  shipped:   "#9C27B0",
  delivered: "#4CAF50",
  cancelled: "#F44336",
};

const ADMIN_EMAILS = ["exaucenapopolo2@gmail.com", "mcexauofficiel@gmail.com"];

async function uploadToCloudinary(uri: string): Promise<string> {
  const filename = uri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";
  const formData = new FormData();
  formData.append("file", { uri, name: filename, type } as any);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Échec upload");
  return (await res.json()).secure_url as string;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const { items: cartItems } = useCart();
  const {
    addresses,
    orders,
    points,
    addAddress: ctxAddAddress,
    deleteAddress: ctxDeleteAddress,
  } = useUserData();

  const [subScreen, setSubScreen] = useState<SubScreen>("main");
  const [editName,      setEditName]      = useState(user?.name     || "");
  const [editPhone,     setEditPhone]     = useState(user?.phone    || "");
  const [editWhatsApp,  setEditWhatsApp]  = useState((user as any)?.whatsapp || "");
  const [saving, setSaving] = useState(false);

  // Sync fields whenever the user object changes (résout le bug "champs vides")
  useEffect(() => {
    setEditName((user?.name     || ""));
    setEditPhone((user?.phone   || ""));
    setEditWhatsApp(((user as any)?.whatsapp || ""));
  }, [user?.name, user?.phone, (user as any)?.whatsapp]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [notifPromos, setNotifPromos] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifNews, setNotifNews] = useState(false);

  // Formulaire nouvelle adresse
  const [newAddr, setNewAddr] = useState({ label: "", fullName: "", phone: "", city: "", address: "" });

  const loadData = useCallback(async () => {
    try {
      const settingsRaw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsRaw) {
        const s = JSON.parse(settingsRaw);
        setDarkMode(!!s.darkMode);
        setLanguage(s.language ?? "fr");
        setNotifPromos(s.notifPromos ?? true);
        setNotifOrders(s.notifOrders ?? true);
        setNotifNews(s.notifNews ?? false);
      }
    } catch {}
  }, []);

  useEffect(() => { loadData(); }, []);

  const saveSettings = async (patch: Record<string, any>) => {
    try {
      const curr = await AsyncStorage.getItem(SETTINGS_KEY);
      const prev = curr ? JSON.parse(curr) : {};
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...prev, ...patch }));
    } catch {}
  };

  const toggleDarkMode = async (val: boolean) => {
    setDarkMode(val);
    await saveSettings({ darkMode: val });
    try { Appearance.setColorScheme(val ? "dark" : "light"); } catch {}
  };

  const changeLanguage = async (lang: "fr" | "en") => {
    setLanguage(lang);
    await saveSettings({ language: lang });
    Alert.alert(lang === "fr" ? "Langue changée" : "Language changed",
      lang === "fr" ? "L'application est maintenant en français." : "The app is now in English.");
  };

  const totalPoints  = points;
  const rewardCount  = Math.floor(totalPoints / 100);
  const pointsToNext = 100 - (totalPoints % 100);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive", onPress: async () => { await logout(); } },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({
        name:     editName.trim(),
        phone:    editPhone.trim(),
        whatsapp: editWhatsApp.trim() || undefined,
      });
      Alert.alert("Succès", "Profil mis à jour");
      setSubScreen("main");
    }
    catch (e: any) { Alert.alert("Erreur", e.message); }
    finally { setSaving(false); }
  };

  const launchImagePicker = async (source: "library" | "camera") => {
    let result: ImagePicker.ImagePickerResult;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") { Alert.alert("Permission refusée"); return; }
      result = await ImagePicker.launchCameraAsync({ mediaTypes: "images", allowsEditing: true, aspect: [1, 1], quality: 0.75 });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") { Alert.alert("Permission refusée"); return; }
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: "images", allowsEditing: true, aspect: [1, 1], quality: 0.75 });
    }
    if (result.canceled || !result.assets?.[0]?.uri) return;
    setUploadingPhoto(true);
    try { const url = await uploadToCloudinary(result.assets[0].uri); await updateProfile({ photoURL: url }); Alert.alert("Succès", "Photo mise à jour !"); }
    catch { Alert.alert("Erreur", "Impossible d'uploader la photo."); }
    finally { setUploadingPhoto(false); }
  };

  const pickPhoto = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions({ options: ["Annuler", "Galerie", "Caméra"], cancelButtonIndex: 0 },
        idx => { if (idx === 1) launchImagePicker("library"); if (idx === 2) launchImagePicker("camera"); });
    } else {
      Alert.alert("Photo de profil", "Source", [{ text: "Annuler", style: "cancel" }, { text: "Galerie", onPress: () => launchImagePicker("library") }, { text: "Caméra", onPress: () => launchImagePicker("camera") }]);
    }
  };

  const deleteAddress = async (id: string) => {
    await ctxDeleteAddress(id);
  };

  const addAddress = async () => {
    if (!newAddr.fullName.trim() || !newAddr.city.trim()) { Alert.alert("Erreur", "Nom et ville sont obligatoires"); return; }
    await ctxAddAddress(newAddr);
    setNewAddr({ label: "", fullName: "", phone: "", city: "", address: "" });
    Alert.alert("Succès", "Adresse ajoutée !");
    setSubScreen("addresses");
  };

  // ─── Header sous-écrans ──────────────────────────────────────────────────
  const SubHdr = ({ title, right }: { title: string; right?: React.ReactNode }) => (
    <View style={[styles.subHeader, { paddingTop: Platform.OS === "web" ? 14 : insets.top + 6 }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => setSubScreen("main")}>
        <Feather name="arrow-left" size={20} color="#1A1A1A" />
      </TouchableOpacity>
      <Text style={styles.subTitle}>{title}</Text>
      {right ?? <View style={{ width: 36 }} />}
    </View>
  );

  // ─── Avatar ──────────────────────────────────────────────────────────────
  const Avatar = ({ size = 70 }: { size?: number }) => (
    <TouchableOpacity onPress={pickPhoto} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} disabled={uploadingPhoto}>
      {uploadingPhoto ? <ActivityIndicator color="#fff" /> :
        user?.photoURL
          ? <Image source={{ uri: user.photoURL }} style={{ width: size, height: size, borderRadius: size / 2 }} />
          : <Text style={[styles.avatarInitials, { fontSize: size * 0.35 }]}>{initials}</Text>
      }
      <View style={styles.camBadge}><Feather name="camera" size={10} color="#fff" /></View>
    </TouchableOpacity>
  );

  // ─── Sous-écrans ─────────────────────────────────────────────────────────
  if (subScreen === "edit") return (
    <View style={styles.root}>
      <SubHdr title="Informations personnelles"
        right={<TouchableOpacity onPress={handleSaveProfile} disabled={saving}>
          {saving ? <ActivityIndicator size="small" color="#FF6B00" /> : <Text style={styles.saveBtn}>Sauvegarder</Text>}
        </TouchableOpacity>}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ alignItems: "center", paddingVertical: 10, gap: 8 }}>
          <Avatar size={80} />
          <Text style={styles.changePhotoHint}>Appuyez pour changer la photo</Text>
        </View>
        {[
          { label: "Nom complet",    icon: "user",      value: editName,     onChange: setEditName,     placeholder: "Votre nom",         editable: true,  kbType: "default" },
          { label: "Email",          icon: "mail",      value: user?.email || "", onChange: () => {}, placeholder: "",                   editable: false, kbType: "default" },
          { label: "Téléphone",      icon: "phone",     value: editPhone,    onChange: setEditPhone,    placeholder: "+237 6XX XXX XXX",  editable: true,  kbType: "phone-pad" },
          { label: "WhatsApp",       icon: "message-circle", value: editWhatsApp, onChange: setEditWhatsApp, placeholder: "+237 6XX XXX XXX (optionnel)", editable: true, kbType: "phone-pad" },
        ].map(f => (
          <View key={f.label} style={styles.formField}>
            <Text style={styles.formLabel}>{f.label}</Text>
            <View style={[styles.formInput, !f.editable && { backgroundColor: "#F5F5F5" }]}>
              <Feather name={f.icon as any} size={14} color="#888" />
              {f.editable
                ? <TextInput style={styles.formTxt} value={f.value} onChangeText={f.onChange}
                    placeholder={f.placeholder} placeholderTextColor="#aaa" keyboardType={f.kbType as any} />
                : <Text style={[styles.formTxt, { color: "#888" }]}>{f.value}</Text>
              }
            </View>
            {!f.editable && <Text style={styles.formHint}>L'email ne peut pas être modifié</Text>}
          </View>
        ))}
        <TouchableOpacity style={styles.bigSaveBtn} onPress={handleSaveProfile} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : (
            <><Feather name="check" size={16} color="#fff" /><Text style={styles.bigSaveBtnTxt}> Enregistrer les modifications</Text></>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (subScreen === "orders") return (
    <View style={styles.root}>
      <SubHdr title={`Mes commandes (${orders.length})`} />
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}><Feather name="shopping-bag" size={36} color="#FF6B00" /></View>
          <Text style={styles.emptyTitle}>Aucune commande</Text>
          <Text style={styles.emptyText}>Vos commandes apparaîtront ici après votre premier achat.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => { setSubScreen("main"); router.push("/(tabs)/" as any); }}>
            <Text style={styles.emptyBtnTxt}>Découvrir nos produits</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
          {orders.map(order => (
            <View key={order.ref} style={styles.orderCard}>
              <View style={styles.orderCardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderRef}>#{order.ref}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 5 }}>
                  <Text style={styles.orderTotal}>{order.grandTotal?.toLocaleString("fr-FR")} FCFA</Text>
                  {order.status ? (
                    <View style={[styles.orderStatusBadge, { backgroundColor: (ORDER_STATUS_COLORS[order.status] ?? "#888") + "18", borderColor: (ORDER_STATUS_COLORS[order.status] ?? "#888") + "50" }]}>
                      <Text style={[styles.orderStatusTxt, { color: ORDER_STATUS_COLORS[order.status] ?? "#888" }]}>
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {order.statusMessage ? (
                <Text style={styles.orderStatusMsg} numberOfLines={2}>💬 {order.statusMessage}</Text>
              ) : null}
              <View style={styles.orderDivider} />
              {order.items?.slice(0, 2).map((item, i) => (
                <View key={i} style={styles.orderItem}>
                  {item.image
                    ? <Image source={{ uri: item.image }} style={styles.orderItemImg} resizeMode="contain" />
                    : <View style={[styles.orderItemImg, { backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" }]}>
                        <Feather name="package" size={14} color="#888" />
                      </View>
                  }
                  <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.orderItemQty}>×{item.quantity}</Text>
                </View>
              ))}
              {(order.items?.length ?? 0) > 2 && (
                <Text style={styles.orderMore}>+{(order.items?.length ?? 0) - 2} article(s) supplémentaire(s)</Text>
              )}
              <View style={styles.orderFooter}>
                <Text style={styles.orderCity}><Feather name="map-pin" size={10} color="#888" /> {order.delivery?.city}</Text>
                <Text style={styles.orderPayment}>{order.paymentMethod}</Text>
                {(order.points ?? 0) > 0 && <Text style={styles.orderPoints}>+{order.points} pts KDO ⭐</Text>}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  if (subScreen === "addresses") return (
    <View style={styles.root}>
      <SubHdr title="Mes adresses"
        right={<TouchableOpacity style={styles.addBtn} onPress={() => setSubScreen("addAddress")}>
          <Feather name="plus" size={14} color="#FF6B00" />
          <Text style={styles.addBtnTxt}> Ajouter</Text>
        </TouchableOpacity>}
      />
      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}><Feather name="map-pin" size={36} color="#FF6B00" /></View>
          <Text style={styles.emptyTitle}>Aucune adresse</Text>
          <Text style={styles.emptyText}>Ajoutez une adresse lors de votre commande ou ici manuellement.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => setSubScreen("addAddress")}>
            <Text style={styles.emptyBtnTxt}>Ajouter une adresse</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
          {addresses.map(addr => (
            <View key={addr.id} style={styles.addrCard}>
              <View style={styles.addrCardIcon}><Feather name="home" size={16} color="#FF6B00" /></View>
              <View style={{ flex: 1 }}>
                {addr.label ? <Text style={styles.addrLabel}>{addr.label}</Text> : null}
                <Text style={styles.addrName}>{addr.fullName}</Text>
                <Text style={styles.addrCity}><Feather name="map-pin" size={10} color="#888" /> {addr.city}</Text>
                {addr.address ? <Text style={styles.addrDetail}>{addr.address}</Text> : null}
                {addr.phone ? <Text style={styles.addrPhone}><Feather name="phone" size={10} color="#888" /> {addr.phone}</Text> : null}
              </View>
              <TouchableOpacity onPress={() => Alert.alert("Supprimer", "Supprimer cette adresse ?", [
                { text: "Annuler" },
                { text: "Supprimer", style: "destructive", onPress: () => deleteAddress(addr.id) },
              ])}>
                <Feather name="trash-2" size={16} color="#FF4D4F" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  if (subScreen === "addAddress") return (
    <View style={styles.root}>
      <SubHdr title="Ajouter une adresse" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        {[
          { key: "label",    label: "Libellé (ex: Maison, Bureau)", icon: "tag",       placeholder: "Maison, Bureau...", kbType: "default" },
          { key: "fullName", label: "Nom complet *",                icon: "user",      placeholder: "Votre nom",          kbType: "default" },
          { key: "phone",    label: "Téléphone",                    icon: "phone",     placeholder: "+237 6XX XXX XXX",   kbType: "phone-pad" },
          { key: "city",     label: "Ville *",                      icon: "map-pin",   placeholder: "Yaoundé, Douala...", kbType: "default" },
          { key: "address",  label: "Adresse / Quartier",           icon: "navigation",placeholder: "Quartier, rue...",   kbType: "default" },
        ].map(f => (
          <View key={f.key} style={styles.formField}>
            <Text style={styles.formLabel}>{f.label}</Text>
            <View style={styles.formInput}>
              <Feather name={f.icon as any} size={14} color="#888" />
              <TextInput style={styles.formTxt}
                value={(newAddr as any)[f.key]}
                onChangeText={v => setNewAddr(a => ({ ...a, [f.key]: v }))}
                placeholder={f.placeholder}
                placeholderTextColor="#aaa"
                keyboardType={f.kbType as any}
              />
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.bigSaveBtn} onPress={addAddress}>
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.bigSaveBtnTxt}> Ajouter l'adresse</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (subScreen === "points") return (
    <View style={styles.root}>
      <SubHdr title="Points KDO" />
      <ScrollView contentContainerStyle={{ padding: 14, gap: 14 }}>
        <View style={styles.pointsHero}>
          <Image source={{ uri: LOGO }} style={styles.pointsLogo} resizeMode="contain" />
          <Text style={styles.pointsNum}>{totalPoints}</Text>
          <Text style={styles.pointsLbl}>Points KDO accumulés</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(100, (totalPoints % 100))}%` as any }]} />
          </View>
          <Text style={styles.progressTxt}>{totalPoints % 100 === 0 && totalPoints > 0 ? "Récompense disponible !" : `${pointsToNext} pts pour la prochaine récompense`}</Text>
        </View>
        {rewardCount > 0 && (
          <View style={styles.rewardCard}>
            <Feather name="award" size={18} color="#FF6B00" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rewardTitle}>{rewardCount} récompense{rewardCount > 1 ? "s" : ""} disponible{rewardCount > 1 ? "s" : ""} !</Text>
              <Text style={styles.rewardSub}>1 récompense = 1 gadget KDO offert gratuitement !</Text>
            </View>
          </View>
        )}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Comment gagner des points ?</Text>
          <Text style={styles.infoTxt}>
            Chaque achat effectué chez KDO Cameroun vous rapporte automatiquement des points en fonction du montant de votre commande. Plus vous commandez, plus vous cumulez !
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Comment utiliser vos points ?</Text>
          <Text style={styles.infoTxt}>
            {"Dès que vous atteignez "}
            <Text style={{ fontWeight: "800", color: "#FF6B00" }}>100 points</Text>
            {", vous recevez un gadget KDO offert gratuitement avec votre prochaine commande.\n\nMentionnez simplement vos points lors de votre commande en boutique ou en ligne. Notre équipe prend soin du reste !"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  if (subScreen === "settings") return (
    <View style={styles.root}>
      <SubHdr title="Paramètres" />
      <ScrollView contentContainerStyle={{ padding: 14, gap: 14 }}>
        <Text style={styles.settingsCat}>Apparence</Text>
        <View style={styles.settingsRow}>
          <View style={[styles.menuIcon, { backgroundColor: "#EEF7FF" }]}><Feather name="moon" size={15} color="#0066CC" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>Mode sombre</Text>
            <Text style={styles.menuSub}>{darkMode ? "Activé" : "Désactivé"}</Text>
          </View>
          <Switch value={darkMode} onValueChange={toggleDarkMode} trackColor={{ false: "#E0E0E0", true: "#FF6B00" }} thumbColor="#fff" />
        </View>

        <Text style={styles.settingsCat}>Langue</Text>
        {(["fr", "en"] as const).map(lang => (
          <TouchableOpacity key={lang} style={[styles.settingsRow, language === lang && { borderColor: "#FF6B00", borderWidth: 1.5 }]}
            onPress={() => changeLanguage(lang)}>
            <Text style={{ fontSize: 22 }}>{lang === "fr" ? "🇫🇷" : "🇬🇧"}</Text>
            <Text style={[styles.menuLabel, { flex: 1 }]}>{lang === "fr" ? "Français" : "English"}</Text>
            {language === lang && <Feather name="check-circle" size={18} color="#FF6B00" />}
          </TouchableOpacity>
        ))}

        <Text style={styles.settingsCat}>Notifications</Text>
        {[
          { label: "Nouvelles promotions", desc: "Alertes pour les offres exclusives", val: notifPromos, set: (v: boolean) => { setNotifPromos(v); saveSettings({ notifPromos: v }); } },
          { label: "Statut de mes commandes", desc: "Mises à jour sur vos livraisons", val: notifOrders, set: (v: boolean) => { setNotifOrders(v); saveSettings({ notifOrders: v }); } },
          { label: "Newsletter KDO", desc: "Actualités et nouveaux produits", val: notifNews, set: (v: boolean) => { setNotifNews(v); saveSettings({ notifNews: v }); } },
        ].map(n => (
          <View key={n.label} style={styles.settingsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{n.label}</Text>
              <Text style={styles.menuSub}>{n.desc}</Text>
            </View>
            <Switch value={n.val} onValueChange={n.set} trackColor={{ false: "#E0E0E0", true: "#FF6B00" }} thumbColor="#fff" />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  if (subScreen === "security") return (
    <View style={styles.root}>
      <SubHdr title="Sécurité" />
      <ScrollView contentContainerStyle={{ padding: 14, gap: 10 }}>
        {[
          { icon: "lock", label: "Changer le mot de passe", desc: "Modifier votre mot de passe actuel", danger: false,
            onPress: () => Alert.alert("Changer le mot de passe", "Un email de réinitialisation va vous être envoyé.", [{ text: "Annuler" }, { text: "Envoyer", onPress: () => Alert.alert("Email envoyé !", "Vérifiez votre boîte mail.") }]) },
          { icon: "shield", label: "Double authentification", desc: "Sécurisez davantage votre compte", danger: false, onPress: () => Alert.alert("Double authentification", "Cette fonctionnalité sera disponible prochainement.") },
          { icon: "trash-2", label: "Supprimer le compte", desc: "Suppression définitive et irréversible", danger: true,
            onPress: () => Alert.alert("Supprimer le compte", "Cette action est irréversible. Contactez notre support.", [{ text: "OK" }]) },
        ].map(s => (
          <TouchableOpacity key={s.label} style={[styles.menuRow, s.danger && styles.menuRowDanger]} onPress={s.onPress}>
            <View style={[styles.menuIcon, s.danger && { backgroundColor: "#FFF1F0" }]}>
              <Feather name={s.icon as any} size={16} color={s.danger ? "#FF4D4F" : "#0066CC"} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuLabel, s.danger && { color: "#FF4D4F" }]}>{s.label}</Text>
              <Text style={styles.menuSub}>{s.desc}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={s.danger ? "#FF4D4F" : "#ccc"} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (subScreen === "about") return (
    <View style={styles.root}>
      <SubHdr title="À propos" />
      <ScrollView contentContainerStyle={{ padding: 14, gap: 14, paddingBottom: 40 }}>
        <View style={styles.aboutHero}>
          <Image source={{ uri: LOGO }} style={styles.aboutLogo} resizeMode="contain" />
          <Text style={styles.aboutName}>KDO Cameroun</Text>
          <Text style={styles.aboutTag}>Leader de l'informatique au Cameroun</Text>
          <View style={styles.versionPill}><Text style={styles.versionTxt}>Version {APP_VERSION}</Text></View>
        </View>
        {[
          { icon: "award",      title: "Notre Mission", text: "Rendre l'informatique accessible à tous les Camerounais avec des produits de qualité à prix compétitifs." },
          { icon: "shield",     title: "Garantie & SAV", text: "Garantie sur tous nos produits. Service après-vente disponible dans toutes nos boutiques." },
          { icon: "truck",      title: "Livraison Nationale", text: "Livraison dans toutes les villes du Cameroun et expéditions dans 4 pays d'Afrique." },
          { icon: "headphones", title: "Support Client", text: "Notre équipe vous aide 7j/7 via WhatsApp, email ou en boutique." },
        ].map(item => (
          <View key={item.title} style={styles.aboutCard}>
            <View style={styles.aboutCardIcon}><Feather name={item.icon as any} size={18} color="#FF6B00" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aboutCardTitle}>{item.title}</Text>
              <Text style={styles.aboutCardText}>{item.text}</Text>
            </View>
          </View>
        ))}

        {/* Liens légaux */}
        <View style={styles.legalBox}>
          <Text style={styles.legalTitle}>Informations légales</Text>
          <TouchableOpacity style={styles.legalRow} onPress={() => router.push("/privacy" as any)}>
            <Feather name="shield" size={14} color="#0066CC" />
            <Text style={styles.legalTxt}> Politique de confidentialité</Text>
            <Feather name="chevron-right" size={14} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalRow} onPress={() => router.push("/terms" as any)}>
            <Feather name="file-text" size={14} color="#0066CC" />
            <Text style={styles.legalTxt}> Conditions d'utilisation</Text>
            <Feather name="chevron-right" size={14} color="#ccc" />
          </TouchableOpacity>
        </View>
        <Text style={styles.copyright}>KDO Cameroun © 2026 · Tous droits réservés</Text>
      </ScrollView>
    </View>
  );

  // ─── ÉCRAN PRINCIPAL ──────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}>
        {/* Header orange */}
        <View style={[styles.profileHeader, { paddingTop: Platform.OS === "web" ? 20 : insets.top + 10 }]}>
          <Image source={{ uri: LOGO }} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.profileRow}>
            <Avatar size={70} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{user?.name || "Utilisateur"}</Text>
              <Text style={styles.profileEmail}>{user?.email || ""}</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => setSubScreen("edit")}>
                <Feather name="edit-2" size={10} color="#FF6B00" />
                <Text style={styles.editBtnTxt}> Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={() => setSubScreen("orders")}>
              <Text style={styles.statNum}>{orders.length}</Text>
              <Text style={styles.statLbl}>Commandes</Text>
            </TouchableOpacity>
            <View style={styles.statDiv} />
            <TouchableOpacity style={styles.statItem} onPress={() => setSubScreen("points")}>
              <Text style={styles.statNum}>{totalPoints}</Text>
              <Text style={styles.statLbl}>Points KDO</Text>
            </TouchableOpacity>
            <View style={styles.statDiv} />
            <TouchableOpacity style={styles.statItem} onPress={() => setSubScreen("addresses")}>
              <Text style={styles.statNum}>{addresses.length}</Text>
              <Text style={styles.statLbl}>Adresses</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bandeau points */}
        {totalPoints > 0 && (
          <TouchableOpacity style={styles.pointsBanner} onPress={() => setSubScreen("points")}>
            <Feather name="star" size={14} color="#FFD700" />
            <Text style={styles.pointsBannerTxt}>
              <Text style={{ fontWeight: "900" }}>{totalPoints} pts KDO</Text> · {pointsToNext} pts pour la prochaine récompense
            </Text>
            <Feather name="chevron-right" size={14} color="#FF6B00" />
          </TouchableOpacity>
        )}

        {/* Mon compte */}
        <View style={styles.section}>
          <Text style={styles.sectionCat}>Mon compte</Text>
          {[
            { icon: "user",        label: "Informations personnelles", sub: "Nom, téléphone, photo",    screen: "edit",      iconBg: "#FFF3E0" },
            { icon: "shopping-bag",label: "Mes commandes",             sub: `${orders.length} commande${orders.length !== 1 ? "s" : ""}`,  screen: "orders",    iconBg: "#FFF3E0" },
            { icon: "map-pin",     label: "Mes adresses",              sub: `${addresses.length} adresse${addresses.length !== 1 ? "s" : ""}`, screen: "addresses", iconBg: "#FFF3E0" },
            { icon: "star",        label: "Points KDO",                sub: `${totalPoints} pts · ${rewardCount} récompense${rewardCount !== 1 ? "s" : ""}`, screen: "points", iconBg: "#FFF3E0" },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.menuRow} onPress={() => setSubScreen(item.screen as SubScreen)}>
              <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
                <Feather name={item.icon as any} size={16} color="#FF6B00" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={15} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Application */}
        <View style={styles.section}>
          <Text style={styles.sectionCat}>Application</Text>
          {[
            { icon: "settings",  label: "Paramètres",  sub: "Thème, langue, notifications", screen: "settings",  iconBg: "#EEF7FF", iconColor: "#0066CC" },
            { icon: "lock",      label: "Sécurité",    sub: "Mot de passe, authentification", screen: "security", iconBg: "#EEF7FF", iconColor: "#0066CC" },
            { icon: "info",      label: "À propos",    sub: `Version ${APP_VERSION}`,          screen: "about",    iconBg: "#EEF7FF", iconColor: "#0066CC" },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.menuRow} onPress={() => setSubScreen(item.screen as SubScreen)}>
              <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
                <Feather name={item.icon as any} size={16} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={15} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Dashboard admin (visible seulement pour les admins) */}
        {user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
          <View style={styles.section}>
            <Text style={styles.sectionCat}>Administration</Text>
            <TouchableOpacity style={styles.adminDashBtn} onPress={() => router.push("/admin" as any)}>
              <View style={[styles.menuIcon, { backgroundColor: "#1A237E15" }]}>
                <Feather name="shield" size={16} color="#1A237E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuLabel, { color: "#1A237E" }]}>Dashboard Admin KDO</Text>
                <Text style={styles.menuSub}>Commandes, clients, gestion des admins</Text>
              </View>
              <Feather name="chevron-right" size={15} color="#1A237E" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={16} color="#FF4D4F" />
          <Text style={styles.logoutTxt}>Se déconnecter</Text>
        </TouchableOpacity>
        <Text style={styles.footerVer}>KDO Cameroun · v{APP_VERSION}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6FA" },

  // ─── HEADER ───────────────────────────────────────────────────────────────
  profileHeader: { backgroundColor: "#FF6B00", paddingHorizontal: 16, paddingBottom: 18, gap: 12 },
  headerLogo: { width: 96, height: 30, alignSelf: "center" },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileName: { fontSize: 17, fontWeight: "800", color: "#fff" },
  profileEmail: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  editBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start", marginTop: 5,
  },
  editBtnTxt: { fontSize: 11, color: "#FF6B00", fontWeight: "700" },
  avatar: {
    backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.4)",
  },
  avatarInitials: { color: "#fff", fontWeight: "900" },
  camBadge: {
    position: "absolute", bottom: 0, right: 0, backgroundColor: "#1A1A1A",
    borderRadius: 9, width: 18, height: 18, alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "#fff",
  },
  statsRow: {
    flexDirection: "row", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, paddingVertical: 11,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statNum: { fontSize: 20, fontWeight: "900", color: "#fff" },
  statLbl: { fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  statDiv: { width: 1, backgroundColor: "rgba(255,255,255,0.3)" },

  // ─── POINTS BANNER ────────────────────────────────────────────────────────
  pointsBanner: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFF8F0",
    marginHorizontal: 12, marginTop: 12, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: "#FFD6A0", gap: 8,
  },
  pointsBannerTxt: { flex: 1, fontSize: 12, color: "#333" },

  // ─── MENU ─────────────────────────────────────────────────────────────────
  section: { marginHorizontal: 12, marginTop: 14 },
  sectionCat: {
    fontSize: 11, fontWeight: "800", color: "#888",
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 2,
  },
  menuRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 10, padding: 12, gap: 12, marginBottom: 6,
    borderWidth: 1, borderColor: "#EBEBEB",
  },
  menuRowDanger: { borderColor: "#FF4D4F30" },
  adminDashBtn: {
    flexDirection: "row" as const, alignItems: "center" as const, backgroundColor: "#fff",
    borderRadius: 10, padding: 12, gap: 12, marginBottom: 6,
    borderWidth: 1.5, borderColor: "#1A237E30",
  },
  menuIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center",
  },
  menuLabel: { fontSize: 13, fontWeight: "700", color: "#1A1A1A" },
  menuSub: { fontSize: 11, color: "#888", marginTop: 1 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginHorizontal: 12, marginTop: 14, backgroundColor: "#FFF1F0",
    borderRadius: 10, paddingVertical: 13, gap: 8, borderWidth: 1, borderColor: "#FF4D4F30",
  },
  logoutTxt: { fontSize: 14, fontWeight: "700", color: "#FF4D4F" },
  footerVer: { textAlign: "center", fontSize: 11, color: "#ccc", marginTop: 14, marginBottom: 6 },

  // ─── SUB HEADER ───────────────────────────────────────────────────────────
  subHeader: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    paddingHorizontal: 12, paddingBottom: 12, gap: 10,
    borderBottomWidth: 1, borderBottomColor: "#E8E8E8",
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center",
  },
  subTitle: { flex: 1, fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
  saveBtn: { fontSize: 13, color: "#FF6B00", fontWeight: "700" },
  addBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF8F0", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  addBtnTxt: { fontSize: 12, color: "#FF6B00", fontWeight: "700" },

  // ─── EDIT FORM ────────────────────────────────────────────────────────────
  changePhotoHint: { fontSize: 11, color: "#888" },
  formField: { gap: 5 },
  formLabel: { fontSize: 12, fontWeight: "700", color: "#333" },
  formInput: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 10, borderWidth: 1, borderColor: "#E0E0E0",
    paddingHorizontal: 12, paddingVertical: 11, gap: 8,
  },
  formTxt: { flex: 1, fontSize: 13, color: "#333" },
  formHint: { fontSize: 11, color: "#888" },
  bigSaveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#FF6B00", borderRadius: 10, paddingVertical: 14, gap: 6, marginTop: 6,
  },
  bigSaveBtnTxt: { color: "#fff", fontSize: 14, fontWeight: "800" },

  // ─── EMPTY STATE ──────────────────────────────────────────────────────────
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 12 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#333" },
  emptyText: { fontSize: 12, color: "#888", textAlign: "center", lineHeight: 18 },
  emptyBtn: { backgroundColor: "#FF6B00", borderRadius: 10, paddingHorizontal: 22, paddingVertical: 12 },
  emptyBtnTxt: { color: "#fff", fontSize: 13, fontWeight: "700" },

  // ─── ORDERS ───────────────────────────────────────────────────────────────
  orderCard: {
    backgroundColor: "#fff", borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: "#EBEBEB", gap: 8,
  },
  orderCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderRef: { fontSize: 13, fontWeight: "800", color: "#1A1A1A" },
  orderDate: { fontSize: 11, color: "#888", marginTop: 2 },
  orderTotal: { fontSize: 14, fontWeight: "900", color: "#FF6B00" },
  orderDivider: { height: 1, backgroundColor: "#F0F0F0" },
  orderItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderItemImg: { width: 36, height: 36, borderRadius: 6 },
  orderItemName: { flex: 1, fontSize: 12, color: "#333" },
  orderItemQty: { fontSize: 12, color: "#888" },
  orderMore: { fontSize: 11, color: "#888", fontStyle: "italic" },
  orderFooter: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  orderCity: { fontSize: 11, color: "#888" },
  orderPayment: { fontSize: 11, color: "#888" },
  orderPoints: { fontSize: 11, color: "#FF6B00", fontWeight: "700" },
  orderStatusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  orderStatusTxt: { fontSize: 11, fontWeight: "700" as const },
  orderStatusMsg: { fontSize: 12, color: "#0066CC", fontStyle: "italic", marginBottom: 6, paddingHorizontal: 2 },

  // ─── ADDRESSES ────────────────────────────────────────────────────────────
  addrCard: {
    flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff",
    borderRadius: 10, padding: 12, gap: 10, borderWidth: 1, borderColor: "#EBEBEB",
  },
  addrCardIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center",
  },
  addrLabel: { fontSize: 10, fontWeight: "800", color: "#FF6B00", textTransform: "uppercase", marginBottom: 2 },
  addrName: { fontSize: 13, fontWeight: "700", color: "#1A1A1A" },
  addrCity: { fontSize: 11, color: "#888", marginTop: 2 },
  addrDetail: { fontSize: 11, color: "#555", marginTop: 2 },
  addrPhone: { fontSize: 11, color: "#888", marginTop: 2 },

  // ─── POINTS ───────────────────────────────────────────────────────────────
  pointsHero: {
    backgroundColor: "#FF6B00", borderRadius: 14, padding: 20,
    alignItems: "center", gap: 8,
  },
  pointsLogo: { width: 80, height: 26 },
  pointsNum: { fontSize: 50, fontWeight: "900", color: "#fff" },
  pointsLbl: { fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: "600" },
  progressBar: {
    width: "100%", height: 8, backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 4 },
  progressTxt: { fontSize: 11, color: "rgba(255,255,255,0.8)" },
  rewardCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFF8F0",
    borderRadius: 10, padding: 12, gap: 12, borderWidth: 1, borderColor: "#FFD6A0",
  },
  rewardTitle: { fontSize: 13, fontWeight: "800", color: "#FF6B00" },
  rewardSub: { fontSize: 11, color: "#888", marginTop: 2 },

  // ─── INFO BOX ─────────────────────────────────────────────────────────────
  infoBox: {
    backgroundColor: "#fff", borderRadius: 10, padding: 14,
    gap: 10, borderWidth: 1, borderColor: "#EBEBEB",
  },
  infoBoxTitle: { fontSize: 13, fontWeight: "800", color: "#1A1A1A", marginBottom: 2 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center",
  },
  infoTxt: { fontSize: 12, color: "#555", flex: 1, lineHeight: 17 },

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  settingsCat: {
    fontSize: 11, fontWeight: "800", color: "#888",
    textTransform: "uppercase", letterSpacing: 1,
  },
  settingsRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 10, padding: 13, gap: 12, borderWidth: 1, borderColor: "#EBEBEB",
  },

  // ─── ABOUT ────────────────────────────────────────────────────────────────
  aboutHero: {
    backgroundColor: "#FF6B00", borderRadius: 14, padding: 20,
    alignItems: "center", gap: 6,
  },
  aboutLogo: { width: 96, height: 32 },
  aboutName: { fontSize: 18, fontWeight: "900", color: "#fff" },
  aboutTag: { fontSize: 12, color: "rgba(255,255,255,0.85)", textAlign: "center" },
  versionPill: {
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 4,
  },
  versionTxt: { fontSize: 11, color: "#fff", fontWeight: "700" },
  aboutCard: {
    flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff",
    borderRadius: 10, padding: 14, gap: 12, borderWidth: 1, borderColor: "#EBEBEB",
  },
  aboutCardIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center",
  },
  aboutCardTitle: { fontSize: 13, fontWeight: "800", color: "#1A1A1A", marginBottom: 3 },
  aboutCardText: { fontSize: 12, color: "#666", lineHeight: 17 },
  legalBox: {
    backgroundColor: "#fff", borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: "#EBEBEB", gap: 4,
  },
  legalTitle: { fontSize: 13, fontWeight: "800", color: "#1A1A1A", marginBottom: 6 },
  legalRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#F5F5F5" },
  legalTxt: { flex: 1, fontSize: 13, color: "#0066CC" },
  copyright: { textAlign: "center", fontSize: 11, color: "#aaa" },
});
