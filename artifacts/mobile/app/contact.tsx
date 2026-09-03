import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOUTIQUES, CONTACT_REASONS } from "@/data/boutiques";

type Step = 1 | 2 | 3 | 4;

const STEPS_LABELS = ["Ville", "Motif", "Agent", "Envoi"];

export default function ContactScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { productName } = useLocalSearchParams<{ productName?: string }>();

  const [step, setStep] = useState<Step>(1);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState(productName ? `Bonjour, je suis intéressé par : ${productName}` : "");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const boutique = BOUTIQUES.find(b => b.id === selectedCity);
  const reason = CONTACT_REASONS.find(r => r.id === selectedReason);

  const goStep = (next: Step) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(next), 120);
  };

  const openWhatsApp = (phone: string, agentName: string) => {
    const city = boutique?.ville ?? "";
    const why = reason?.label ?? "";
    const msg = encodeURIComponent(
      `Bonjour ${agentName} (KDO ${city}),\n\n` +
      `📌 Motif : ${why}\n` +
      (customMsg ? `💬 ${customMsg}\n` : "") +
      `\nMerci.`
    );
    Linking.openURL(`https://wa.me/237${phone}?text=${msg}`);
    setStep(4);
  };

  return (
    <View style={styles.root}>
      {/* En-tête orange professionnel */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 14 : insets.top + 8 }]}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerIcon}>
            <Feather name="message-circle" size={22} color="#FF6B00" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Contactez-nous</Text>
            <Text style={styles.headerSub}>KDO Cameroun · Assistance client</Text>
          </View>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Stepper */}
      <View style={styles.stepperBar}>
        {STEPS_LABELS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                (i + 1) <= step && styles.stepCircleActive,
                (i + 1) < step && styles.stepCircleDone,
              ]}>
                {(i + 1) < step
                  ? <Feather name="check" size={10} color="#fff" />
                  : <Text style={[styles.stepNum, (i + 1) <= step && styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, (i + 1) <= step && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < 3 && <View style={[styles.stepLine, (i + 1) < step && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ÉTAPE 1 : Choisir ville */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHero}>
              <View style={styles.stepHeroIcon}>
                <Feather name="map-pin" size={24} color="#FF6B00" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Choisissez votre ville</Text>
                <Text style={styles.stepSub}>Sélectionnez la boutique la plus proche de vous</Text>
              </View>
            </View>

            <View style={styles.citiesGrid}>
              {BOUTIQUES.map(b => (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.cityCard, selectedCity === b.id && styles.cityCardActive]}
                  onPress={() => setSelectedCity(b.id)}
                >
                  <View style={[styles.cityDot, selectedCity === b.id && styles.cityDotActive]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cityName, selectedCity === b.id && styles.cityNameActive]}>{b.ville}</Text>
                    <Text style={styles.cityDesc}>{b.description}</Text>
                  </View>
                  {selectedCity === b.id && (
                    <Feather name="check-circle" size={18} color="#FF6B00" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, !selectedCity && styles.nextBtnDisabled]}
              onPress={() => selectedCity && goStep(2)}
              disabled={!selectedCity}
            >
              <Text style={styles.nextBtnText}>Continuer</Text>
              <Feather name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ÉTAPE 2 : Motif */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHero}>
              <View style={styles.stepHeroIcon}>
                <Feather name="help-circle" size={24} color="#FF6B00" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Raison du contact</Text>
                <Text style={styles.stepSub}>Comment pouvons-nous vous aider ?</Text>
              </View>
            </View>

            <View style={styles.reasonsGrid}>
              {CONTACT_REASONS.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.reasonCard, selectedReason === r.id && styles.reasonCardActive]}
                  onPress={() => setSelectedReason(r.id)}
                >
                  <View style={[styles.reasonIconWrap, selectedReason === r.id && styles.reasonIconWrapActive]}>
                    <Feather name={r.icon as any} size={20} color={selectedReason === r.id ? "#FF6B00" : "#888"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reasonTitle, selectedReason === r.id && styles.reasonTitleActive]}>{r.label}</Text>
                    <Text style={styles.reasonDesc}>{r.desc}</Text>
                  </View>
                  {selectedReason === r.id && (
                    <Feather name="check-circle" size={18} color="#FF6B00" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Message */}
            <View style={styles.msgBox}>
              <Text style={styles.msgLabel}>
                <Feather name="edit-3" size={13} color="#555" /> Message (optionnel)
              </Text>
              <TextInput
                style={styles.msgInput}
                value={customMsg}
                onChangeText={setCustomMsg}
                placeholder="Décrivez votre demande en détail…"
                placeholderTextColor="#bbb"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.rowBtns}>
              <TouchableOpacity style={styles.backBtn} onPress={() => goStep(1)}>
                <Feather name="arrow-left" size={15} color="#FF6B00" />
                <Text style={styles.backBtnText}> Retour</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nextBtn, { flex: 1 }, !selectedReason && styles.nextBtnDisabled]}
                onPress={() => selectedReason && goStep(3)}
                disabled={!selectedReason}
              >
                <Text style={styles.nextBtnText}>Continuer</Text>
                <Feather name="arrow-right" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ÉTAPE 3 : Choisir agent */}
        {step === 3 && boutique && (
          <View style={styles.stepContent}>
            <View style={styles.stepHero}>
              <View style={styles.stepHeroIcon}>
                <Feather name="users" size={24} color="#FF6B00" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Agents à {boutique.ville}</Text>
                <Text style={styles.stepSub}>Choisissez un agent pour démarrer</Text>
              </View>
            </View>

            {/* Résumé */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Feather name="map-pin" size={13} color="#FF6B00" />
                <Text style={styles.summaryText}> Ville : <Text style={styles.summaryValue}>{boutique.ville}</Text></Text>
              </View>
              <View style={styles.summaryRow}>
                <Feather name="tag" size={13} color="#FF6B00" />
                <Text style={styles.summaryText}> Motif : <Text style={styles.summaryValue}>{reason?.label}</Text></Text>
              </View>
              {customMsg.length > 0 && (
                <View style={styles.summaryRow}>
                  <Feather name="message-square" size={13} color="#FF6B00" />
                  <Text style={styles.summaryText} numberOfLines={2}> Message : <Text style={styles.summaryValue}>{customMsg}</Text></Text>
                </View>
              )}
            </View>

            {boutique.agents.map((agent, i) => (
              <AgentCard
                key={i}
                agent={agent}
                onWhatsApp={() => openWhatsApp(agent.phone, agent.name)}
              />
            ))}

            <TouchableOpacity style={styles.backBtn} onPress={() => goStep(2)}>
              <Feather name="arrow-left" size={15} color="#FF6B00" />
              <Text style={styles.backBtnText}> Retour</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ÉTAPE 4 : Confirmation */}
        {step === 4 && (
          <View style={[styles.stepContent, styles.confirmWrap]}>
            <View style={styles.confirmAnim}>
              <View style={styles.confirmRing}>
                <View style={styles.confirmIcon}>
                  <Feather name="check" size={40} color="#fff" />
                </View>
              </View>
            </View>
            <Text style={styles.confirmTitle}>Message envoyé !</Text>
            <Text style={styles.confirmSub}>
              Votre demande a été transmise à l'équipe KDO de {boutique?.ville}.{"\n"}
              Un agent vous répondra très rapidement sur WhatsApp.
            </Text>
            <View style={styles.confirmBadges}>
              {["Réponse rapide", "Service professionnel", "100% gratuit"].map(b => (
                <View key={b} style={styles.confirmBadge}>
                  <Feather name="check" size={11} color="#52C41A" />
                  <Text style={styles.confirmBadgeText}> {b}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => router.back()}>
              <Feather name="home" size={16} color="#fff" />
              <Text style={styles.nextBtnText}> Retour à l'accueil</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

function AgentCard({ agent, onWhatsApp }: { agent: { name: string; phone: string; available: boolean }; onWhatsApp: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 60 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 40 }),
    ]).start();
    onWhatsApp();
  };

  return (
    <Animated.View style={[styles.agentCard, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.agentAvatar}>
        <Feather name="user" size={22} color="#FF6B00" />
      </View>
      <View style={styles.agentInfo}>
        <Text style={styles.agentName}>{agent.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Feather name="phone" size={10} color="#888" />
          <Text style={styles.agentPhone}>+237 {agent.phone}</Text>
        </View>
        <View style={styles.agentStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Disponible maintenant</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.whatsappBtn} onPress={handlePress}>
        <Feather name="message-circle" size={15} color="#fff" />
        <Text style={styles.whatsappText}> WhatsApp</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6FA" },

  header: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerBack: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 11 },

  stepperBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  stepItem: { alignItems: "center", gap: 3 },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: { backgroundColor: "#FF6B00" },
  stepCircleDone: { backgroundColor: "#52C41A" },
  stepNum: { fontSize: 11, fontWeight: "700", color: "#999" },
  stepNumActive: { color: "#fff" },
  stepLabel: { fontSize: 9, color: "#bbb", fontWeight: "600" },
  stepLabelActive: { color: "#FF6B00", fontWeight: "700" },
  stepLine: { flex: 1, height: 2, backgroundColor: "#E8E8E8", marginHorizontal: 4, marginBottom: 14 },
  stepLineDone: { backgroundColor: "#52C41A" },

  scroll: { padding: 16, paddingBottom: Platform.OS === "web" ? 100 : 80, gap: 14 },

  stepContent: { gap: 12 },
  stepHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  stepHeroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: { fontSize: 15, fontWeight: "800", color: "#222" },
  stepSub: { fontSize: 11, color: "#888", marginTop: 2 },

  citiesGrid: { gap: 8 },
  cityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#fff",
  },
  cityCardActive: { borderColor: "#FF6B00", backgroundColor: "#FFF8F2" },
  cityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
  },
  cityDotActive: { backgroundColor: "#FF6B00" },
  cityName: { fontSize: 13, fontWeight: "700", color: "#333" },
  cityNameActive: { color: "#FF6B00" },
  cityDesc: { fontSize: 11, color: "#888", marginTop: 2 },

  reasonsGrid: { gap: 8 },
  reasonCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#fff",
  },
  reasonCardActive: { borderColor: "#FF6B00", backgroundColor: "#FFF8F2" },
  reasonIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  reasonIconWrapActive: { backgroundColor: "#FFF3E8" },
  reasonTitle: { fontSize: 13, fontWeight: "700", color: "#333" },
  reasonTitleActive: { color: "#FF6B00" },
  reasonDesc: { fontSize: 11, color: "#888", marginTop: 2 },

  msgBox: { backgroundColor: "#fff", borderRadius: 10, padding: 14, gap: 8, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  msgLabel: { fontSize: 12, fontWeight: "700", color: "#555" },
  msgInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 11,
    fontSize: 13,
    color: "#333",
    minHeight: 85,
    backgroundColor: "#FAFAFA",
  },

  rowBtns: { flexDirection: "row", gap: 8, alignItems: "center" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFD4AA",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF8F2",
    gap: 4,
  },
  backBtnText: { fontSize: 13, color: "#FF6B00", fontWeight: "700" },
  nextBtn: {
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#FF6B00",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  nextBtnDisabled: { backgroundColor: "#D0D0D0", shadowOpacity: 0 },
  nextBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B00",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  summaryText: { fontSize: 12, color: "#666" },
  summaryValue: { fontWeight: "800", color: "#333" },

  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD4AA",
  },
  agentInfo: { flex: 1 },
  agentName: { fontSize: 14, fontWeight: "800", color: "#222" },
  agentPhone: { fontSize: 11, color: "#888" },
  agentStatus: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#52C41A" },
  statusText: { fontSize: 10, color: "#52C41A", fontWeight: "700" },
  whatsappBtn: {
    backgroundColor: "#25D366",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#25D366",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappText: { color: "#fff", fontSize: 12, fontWeight: "800" },

  confirmWrap: { alignItems: "center", paddingVertical: 30 },
  confirmAnim: { marginBottom: 20 },
  confirmRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(82,196,26,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#52C41A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#52C41A",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmTitle: { fontSize: 24, fontWeight: "900", color: "#222", textAlign: "center" },
  confirmSub: { fontSize: 13, color: "#666", textAlign: "center", lineHeight: 20, maxWidth: 300 },
  confirmBadges: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 8 },
  confirmBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6FFED",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#B7EB8F",
  },
  confirmBadgeText: { fontSize: 11, color: "#52C41A", fontWeight: "700" },
});
