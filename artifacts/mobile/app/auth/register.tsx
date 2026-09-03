import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const LOGO = "https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/logos.png";
const PRIMARY = "#FF6B00";
const SUCCESS = "#52C41A";
const GRAY_BG = "#F5F5F5";
const BORDER = "#E0E0E0";
const TEXT_DARK = "#333333";
const TEXT_GRAY = "#666666";

const STEPS = [
  { label: "Informations\npersonnelles" },
  { label: "Coordonnées\n& téléphone" },
  { label: "Type de\ncompte" },
  { label: "Confirmation\nfinale" },
];

type AccountType = "acheteur" | "revendeur";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [accountType, setAccountType] = useState<AccountType>("acheteur");
  const [businessName, setBusinessName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [confirmInfo, setConfirmInfo] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const clearError = (key: string) => setErrors(e => { const c = { ...e }; delete c[key]; return c; });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!firstName.trim()) newErrors.firstName = "Ce champ est requis";
      if (!lastName.trim()) newErrors.lastName = "Ce champ est requis";
      if (!email.trim() || !email.includes("@")) newErrors.email = "Veuillez entrer un email valide";
      if (!password || password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
      if (password !== confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    if (step === 2) {
      if (!phone.trim()) newErrors.phone = "Veuillez entrer un numéro de téléphone valide";
      if (!city.trim()) newErrors.city = "Veuillez entrer votre ville";
    }
    if (step === 3) {
      if (!termsAccepted) newErrors.terms = "Vous devez accepter les conditions";
    }
    if (step === 4) {
      if (!confirmInfo) newErrors.confirmInfo = "Vous devez confirmer vos informations";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep(s => s + 1); };
  const prevStep = () => { setCurrentStep(s => s - 1); setErrors({}); };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setLoading(true);
    try {
      await register({ name: `${firstName.trim()} ${lastName.trim()}`, phone: phone.trim(), email: email.trim() || undefined });
      setDone(true);
      setTimeout(() => router.replace("/(tabs)"), 2500);
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Inscription échouée");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep - 1) / 4) * 100;

  if (done) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCard}>
          <Feather name="check-circle" size={80} color={SUCCESS} />
          <Text style={styles.successTitle}>Compte créé avec succès !</Text>
          <Text style={styles.successText}>
            Félicitations ! Votre compte professionnel a été créé avec succès.{"\n"}
            Vous allez être redirigé vers votre tableau de bord.
          </Text>
          <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Platform.OS === "web" ? 0 : insets.top }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Image source={{ uri: LOGO }} style={styles.logo} resizeMode="contain" />
              <Text style={styles.subtitle}>Créez votre compte professionnel en 4 étapes simples</Text>
            </View>

            <View style={styles.stepsContainer}>
              <View style={styles.steps}>
                <View style={styles.stepsLine}>
                  <View style={[styles.stepsProgress, { width: `${progress}%` as any }]} />
                </View>
                {STEPS.map((step, i) => {
                  const n = i + 1;
                  const isActive = currentStep === n;
                  const isCompleted = currentStep > n;
                  return (
                    <View key={n} style={styles.step}>
                      <View style={[styles.stepNumber, isActive && styles.stepNumberActive, isCompleted && styles.stepNumberCompleted]}>
                        {isCompleted
                          ? <Feather name="check" size={16} color="#fff" />
                          : <Text style={[styles.stepNumberText, (isActive || isCompleted) && { color: "#fff" }]}>{n}</Text>
                        }
                      </View>
                      <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{step.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.stepContent}>
              {currentStep === 1 && (
                <View>
                  <Text style={styles.stepTitle}>Informations personnelles</Text>
                  <Text style={styles.stepDesc}>Veuillez fournir vos informations de base pour créer votre compte.</Text>

                  <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.formLabel}>Prénom *</Text>
                      <TextInput style={[styles.formControl, errors.firstName && styles.inputError]} placeholder="Votre prénom" value={firstName} onChangeText={v => { setFirstName(v); clearError("firstName"); }} />
                      {errors.firstName ? <Text style={styles.errorMsg}>{errors.firstName}</Text> : null}
                    </View>
                    <View style={{ width: 12 }} />
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.formLabel}>Nom de famille *</Text>
                      <TextInput style={[styles.formControl, errors.lastName && styles.inputError]} placeholder="Votre nom" value={lastName} onChangeText={v => { setLastName(v); clearError("lastName"); }} />
                      {errors.lastName ? <Text style={styles.errorMsg}>{errors.lastName}</Text> : null}
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Email professionnel *</Text>
                    <TextInput style={[styles.formControl, errors.email && styles.inputError]} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={v => { setEmail(v); clearError("email"); }} />
                    {errors.email ? <Text style={styles.errorMsg}>{errors.email}</Text> : null}
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.formLabel}>Mot de passe *</Text>
                      <View style={[styles.formControl, styles.pwdWrap, errors.password && styles.inputError]}>
                        <TextInput style={styles.pwdInput} placeholder="Min. 8 caractères" secureTextEntry={!showPwd} value={password} onChangeText={v => { setPassword(v); clearError("password"); }} />
                        <TouchableOpacity onPress={() => setShowPwd(v => !v)}><Feather name={showPwd ? "eye-off" : "eye"} size={18} color={TEXT_GRAY} /></TouchableOpacity>
                      </View>
                      {errors.password ? <Text style={styles.errorMsg}>{errors.password}</Text> : null}
                    </View>
                    <View style={{ width: 12 }} />
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.formLabel}>Confirmer le mot de passe *</Text>
                      <View style={[styles.formControl, styles.pwdWrap, errors.confirmPassword && styles.inputError]}>
                        <TextInput style={styles.pwdInput} placeholder="Répétez le mot de passe" secureTextEntry={!showConfirmPwd} value={confirmPassword} onChangeText={v => { setConfirmPassword(v); clearError("confirmPassword"); }} />
                        <TouchableOpacity onPress={() => setShowConfirmPwd(v => !v)}><Feather name={showConfirmPwd ? "eye-off" : "eye"} size={18} color={TEXT_GRAY} /></TouchableOpacity>
                      </View>
                      {errors.confirmPassword ? <Text style={styles.errorMsg}>{errors.confirmPassword}</Text> : null}
                    </View>
                  </View>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Ou inscrivez-vous avec</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity style={styles.googleBtn}>
                    <Image source={{ uri: "https://www.google.com/favicon.ico" }} style={styles.googleIcon} />
                    <Text style={styles.googleBtnText}>S'inscrire avec Google</Text>
                  </TouchableOpacity>

                  <View style={styles.loginLink}>
                    <Text style={styles.loginLinkText}>Déjà un compte ? </Text>
                    <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                      <Text style={styles.loginLinkAnchor}>Connectez-vous ici</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.stepActions}>
                    <View />
                    <TouchableOpacity style={styles.btnNext} onPress={nextStep}>
                      <Text style={styles.btnNextText}>Suivant</Text>
                      <Feather name="arrow-right" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {currentStep === 2 && (
                <View>
                  <Text style={styles.stepTitle}>Coordonnées & téléphone</Text>
                  <Text style={styles.stepDesc}>Où pouvons-nous vous contacter ?</Text>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Numéro de téléphone *</Text>
                    <TextInput style={[styles.formControl, errors.phone && styles.inputError]} placeholder="Ex: +237 6 81 14 46 38" keyboardType="phone-pad" value={phone} onChangeText={v => { setPhone(v); clearError("phone"); }} />
                    {errors.phone ? <Text style={styles.errorMsg}>{errors.phone}</Text> : null}
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Pays *</Text>
                    <TextInput style={[styles.formControl, styles.readOnly]} value="Cameroun" editable={false} />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Ville *</Text>
                    <TextInput style={[styles.formControl, errors.city && styles.inputError]} placeholder="Votre ville" value={city} onChangeText={v => { setCity(v); clearError("city"); }} />
                    {errors.city ? <Text style={styles.errorMsg}>{errors.city}</Text> : null}
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Adresse complète</Text>
                    <TextInput style={[styles.formControl, styles.textarea]} placeholder="Votre adresse complète" multiline numberOfLines={3} value={address} onChangeText={setAddress} />
                  </View>

                  <View style={styles.stepActions}>
                    <TouchableOpacity style={styles.btnPrev} onPress={prevStep}>
                      <Feather name="arrow-left" size={16} color={PRIMARY} />
                      <Text style={styles.btnPrevText}>Précédent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnNext} onPress={nextStep}>
                      <Text style={styles.btnNextText}>Suivant</Text>
                      <Feather name="arrow-right" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {currentStep === 3 && (
                <View>
                  <Text style={styles.stepTitle}>Type de compte</Text>
                  <Text style={styles.stepDesc}>Sélectionnez le type de compte qui correspond à votre activité.</Text>

                  <View style={styles.row}>
                    <TouchableOpacity style={[styles.typeCard, accountType === "acheteur" && styles.typeCardSelected]} onPress={() => setAccountType("acheteur")}>
                      <Feather name="shopping-cart" size={36} color="#0066CC" />
                      <Text style={styles.typeCardTitle}>Acheteur</Text>
                      <Text style={styles.typeCardDesc}>Je souhaite acheter pour mon usage personnel</Text>
                      <View style={styles.typeRadio}>
                        <View style={[styles.radioOuter, accountType === "acheteur" && styles.radioOuterActive]}>
                          {accountType === "acheteur" && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.typeRadioLabel}>Sélectionner</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: 12 }} />
                    <TouchableOpacity style={[styles.typeCard, accountType === "revendeur" && styles.typeCardSelected]} onPress={() => setAccountType("revendeur")}>
                      <Feather name="shopping-bag" size={36} color="#0066CC" />
                      <Text style={styles.typeCardTitle}>Revendeur</Text>
                      <Text style={styles.typeCardDesc}>Je souhaite acheter en gros pour revendre dans ma boutique</Text>
                      <View style={styles.typeRadio}>
                        <View style={[styles.radioOuter, accountType === "revendeur" && styles.radioOuterActive]}>
                          {accountType === "revendeur" && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.typeRadioLabel}>Sélectionner</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.formGroup, { marginTop: 16 }]}>
                    <Text style={styles.formLabel}>Nom de votre entreprise / boutique</Text>
                    <TextInput style={styles.formControl} placeholder="Si applicable" value={businessName} onChangeText={setBusinessName} />
                  </View>

                  <TouchableOpacity style={styles.checkRow} onPress={() => { setTermsAccepted(v => !v); clearError("terms"); }}>
                    <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                      {termsAccepted && <Feather name="check" size={12} color="#fff" />}
                    </View>
                    <Text style={styles.checkLabel}>
                      J'accepte les <Text style={{ color: PRIMARY }}>Conditions Générales d'Utilisation</Text> et la <Text style={{ color: PRIMARY }}>Politique de Confidentialité</Text> *
                    </Text>
                  </TouchableOpacity>
                  {errors.terms ? <Text style={styles.errorMsg}>{errors.terms}</Text> : null}

                  <View style={styles.stepActions}>
                    <TouchableOpacity style={styles.btnPrev} onPress={prevStep}>
                      <Feather name="arrow-left" size={16} color={PRIMARY} />
                      <Text style={styles.btnPrevText}>Précédent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnNext} onPress={nextStep}>
                      <Text style={styles.btnNextText}>Suivant</Text>
                      <Feather name="arrow-right" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {currentStep === 4 && (
                <View>
                  <Text style={styles.stepTitle}>Confirmation finale</Text>
                  <Text style={styles.stepDesc}>Vérifiez vos informations avant de finaliser l'inscription.</Text>

                  <View style={styles.summary}>
                    {[
                      { label: "Nom complet:", value: `${firstName} ${lastName}` },
                      { label: "Email:", value: email },
                      { label: "Téléphone:", value: phone },
                      { label: "Pays:", value: "Cameroun" },
                      { label: "Ville:", value: city },
                      { label: "Type de compte:", value: accountType === "acheteur" ? "Acheteur" : "Revendeur" },
                      { label: "Entreprise:", value: businessName || "Non spécifié" },
                    ].map((item, i, arr) => (
                      <View key={item.label} style={[styles.summaryItem, i < arr.length - 1 && styles.summaryItemBorder]}>
                        <Text style={styles.summaryLabel}>{item.label}</Text>
                        <Text style={styles.summaryValue}>{item.value}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={[styles.checkRow, { marginBottom: 4 }]} onPress={() => { setConfirmInfo(v => !v); clearError("confirmInfo"); }}>
                    <View style={[styles.checkbox, confirmInfo && styles.checkboxChecked]}>
                      {confirmInfo && <Feather name="check" size={12} color="#fff" />}
                    </View>
                    <Text style={styles.checkLabel}>Je confirme que toutes les informations ci-dessus sont correctes</Text>
                  </TouchableOpacity>
                  {errors.confirmInfo ? <Text style={styles.errorMsg}>{errors.confirmInfo}</Text> : null}

                  <View style={styles.stepActions}>
                    <TouchableOpacity style={styles.btnPrev} onPress={prevStep}>
                      <Feather name="arrow-left" size={16} color={PRIMARY} />
                      <Text style={styles.btnPrevText}>Précédent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnSubmit, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
                      {loading ? <ActivityIndicator color="#fff" size="small" /> : (
                        <>
                          <Feather name="check" size={16} color="#fff" />
                          <Text style={styles.btnSubmitText}>Créer mon compte</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PRIMARY },
  scroll: { flexGrow: 1, padding: 16, paddingBottom: 48 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  header: { backgroundColor: PRIMARY, padding: 24, alignItems: "center" },
  logo: { width: 180, height: 72, marginBottom: 10 },
  subtitle: { color: "rgba(255,255,255,0.9)", fontSize: 15, textAlign: "center", fontFamily: "Inter_400Regular" },
  stepsContainer: { padding: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: BORDER },
  steps: { flexDirection: "row", justifyContent: "space-between", position: "relative" },
  stepsLine: { position: "absolute", top: 18, left: 20, right: 20, height: 4, backgroundColor: BORDER, zIndex: 1 },
  stepsProgress: { height: "100%", backgroundColor: PRIMARY },
  step: { flex: 1, alignItems: "center", zIndex: 2 },
  stepNumber: { width: 40, height: 40, borderRadius: 20, backgroundColor: BORDER, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  stepNumberActive: { backgroundColor: PRIMARY, transform: [{ scale: 1.1 }] },
  stepNumberCompleted: { backgroundColor: SUCCESS },
  stepNumberText: { color: TEXT_GRAY, fontSize: 17, fontFamily: "Inter_700Bold" },
  stepLabel: { fontSize: 10, color: TEXT_GRAY, fontFamily: "Inter_600SemiBold", textAlign: "center", lineHeight: 14 },
  stepLabelActive: { color: PRIMARY },
  stepContent: { padding: 24, minHeight: 400 },
  stepTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: TEXT_DARK, marginBottom: 8 },
  stepDesc: { color: TEXT_GRAY, marginBottom: 24, fontFamily: "Inter_400Regular" },
  row: { flexDirection: "row", alignItems: "flex-start" },
  formGroup: { marginBottom: 20 },
  formLabel: { fontFamily: "Inter_600SemiBold", color: TEXT_DARK, marginBottom: 8, fontSize: 14 },
  formControl: { borderWidth: 2, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "Inter_400Regular", color: TEXT_DARK, backgroundColor: "#fff" },
  inputError: { borderColor: "#dc3545" },
  readOnly: { backgroundColor: "#f8f9fa", color: TEXT_GRAY },
  textarea: { height: 90, textAlignVertical: "top" },
  pwdWrap: { flexDirection: "row", alignItems: "center", paddingVertical: 0 },
  pwdInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: TEXT_DARK, paddingVertical: 12 },
  errorMsg: { color: "#dc3545", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { marginHorizontal: 14, color: "#999", fontSize: 13, fontFamily: "Inter_400Regular" },
  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#fff", borderWidth: 2, borderColor: BORDER, borderRadius: 10, paddingVertical: 13, marginBottom: 20 },
  googleIcon: { width: 20, height: 20 },
  googleBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: TEXT_DARK },
  loginLink: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  loginLinkText: { fontSize: 14, color: TEXT_GRAY, fontFamily: "Inter_400Regular" },
  loginLinkAnchor: { fontSize: 14, color: PRIMARY, fontFamily: "Inter_600SemiBold" },
  stepActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 24, marginTop: 24 },
  btnPrev: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "transparent", borderWidth: 2, borderColor: PRIMARY, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 },
  btnPrevText: { color: PRIMARY, fontSize: 15, fontFamily: "Inter_600SemiBold" },
  btnNext: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 },
  btnNextText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  btnSubmit: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, minWidth: 150, justifyContent: "center" },
  btnSubmitText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  typeCard: { flex: 1, borderWidth: 2, borderColor: BORDER, borderRadius: 12, padding: 16, alignItems: "center", gap: 8 },
  typeCardSelected: { borderColor: PRIMARY },
  typeCardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: TEXT_DARK },
  typeCardDesc: { fontSize: 12, fontFamily: "Inter_400Regular", color: TEXT_GRAY, textAlign: "center" },
  typeRadio: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: BORDER, alignItems: "center", justifyContent: "center" },
  radioOuterActive: { borderColor: PRIMARY },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: PRIMARY },
  typeRadioLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: TEXT_GRAY },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: BORDER, alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 },
  checkboxChecked: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  checkLabel: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: TEXT_DARK, lineHeight: 20 },
  summary: { backgroundColor: GRAY_BG, borderRadius: 10, padding: 20, marginBottom: 20 },
  summaryItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  summaryItemBorder: { borderBottomWidth: 1, borderBottomColor: "#D0D0D0" },
  summaryLabel: { fontFamily: "Inter_600SemiBold", color: TEXT_DARK, fontSize: 13 },
  summaryValue: { color: TEXT_GRAY, fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, textAlign: "right", marginLeft: 8 },
  successRoot: { flex: 1, backgroundColor: PRIMARY, alignItems: "center", justifyContent: "center", padding: 24 },
  successCard: { backgroundColor: "#fff", borderRadius: 20, padding: 40, alignItems: "center", gap: 16, width: "100%" },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: SUCCESS, textAlign: "center" },
  successText: { fontSize: 15, fontFamily: "Inter_400Regular", color: TEXT_GRAY, textAlign: "center", lineHeight: 22 },
});
