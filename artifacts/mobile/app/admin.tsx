import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { apiDelete, apiGet, apiPost, apiPut } from "@/utils/api";

// ─── Colors ───────────────────────────────────────────────────────────────────
const PRIMARY = "#FF6B00";
const BLUE    = "#0066CC";
const BG      = "#F5F7FA";
const CARD    = "#FFFFFF";
const BORDER  = "#EEEEEE";
const TEXT    = "#1A1A1A";
const MUTED   = "#888888";

type Tab = "orders" | "users" | "admins";

interface Stats {
  totalOrders: number; totalUsers: number; topCity: string;
  topCityCount: number; totalRevenue: number;
  byStatus: Record<string, number>;
}
interface Order {
  id: number; ref: string; userPhone: string; grandTotal: number;
  city: string; status: string; statusMessage?: string;
  createdAt: string; data: any;
}
interface KdoUser {
  id: string; phone: string; name: string; email?: string;
  whatsapp?: string; points: number; createdAt: string;
}
interface Admin {
  id: string; email: string; name: string; role: string;
  addedBy?: string; createdAt?: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending:   "En attente",
  confirmed: "Confirmée",
  shipped:   "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};
const STATUS_COLORS: Record<string, string> = {
  pending:   "#FF9800",
  confirmed: "#0066CC",
  shipped:   "#9C27B0",
  delivered: "#4CAF50",
  cancelled: "#F44336",
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? "#888";
  return (
    <View style={[s.badge, { backgroundColor: c + "20", borderColor: c + "60" }]}>
      <Text style={[s.badgeTxt, { color: c }]}>{STATUS_LABELS[status] ?? status}</Text>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminScreen() {
  const insets     = useSafeAreaInsets();
  const router     = useRouter();
  const { user, isLoading: authLoading } = useAuth() as any;
  const adminEmail = (user?.email ?? "").trim().toLowerCase();

  const [tab,        setTab]        = useState<Tab>("orders");
  const [stats,      setStats]      = useState<Stats | null>(null);
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [users,      setUsers]      = useState<KdoUser[]>([]);
  const [admins,     setAdmins]     = useState<Admin[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError,   setApiError]   = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  // modals
  const [statusModal, setStatusModal] = useState<Order | null>(null);
  const [newStatus,   setNewStatus]   = useState("pending");
  const [statusMsg,   setStatusMsg]   = useState("");
  const [updating,    setUpdating]    = useState(false);
  const [adminModal,      setAdminModal]      = useState(false);
  const [newEmail,        setNewEmail]        = useState("");
  const [newName,         setNewName]         = useState("");
  const [newPermissions,  setNewPermissions]  = useState("");
  const [addingAdmin,     setAddingAdmin]     = useState(false);

  const hasFetched = useRef(false);

  // ── Fetch data — ne tourne qu'une fois que adminEmail est disponible ─────────
  const fetchAll = useCallback(async (silent = false) => {
    if (!adminEmail) return;
    if (!silent) setLoading(true);
    setApiError(null);
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        apiGet("/admin/stats",         adminEmail) as Promise<any>,
        apiGet("/admin/orders?limit=200", adminEmail) as Promise<any>,
        apiGet("/admin/users?limit=200",  adminEmail) as Promise<any>,
      ]);

      if (statsRes?.error)   throw new Error(statsRes.error);
      if (ordersRes?.error)  throw new Error(ordersRes.error);
      if (usersRes?.error)   throw new Error(usersRes.error);

      if (statsRes)          setStats(statsRes);
      if (ordersRes?.orders) setOrders(ordersRes.orders);
      if (usersRes?.users)   setUsers(usersRes.users);

      // admins séparément (super uniquement)
      const adminsRes = await apiGet("/admin/admins", adminEmail) as any;
      if (adminsRes?.admins) setAdmins(adminsRes.admins);
    } catch (e: any) {
      setApiError(e?.message ?? "Erreur de connexion au serveur");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [adminEmail]);

  // Lance le fetch dès que l'email admin est connu
  useEffect(() => {
    if (!adminEmail || hasFetched.current) return;
    hasFetched.current = true;
    fetchAll();
  }, [adminEmail, fetchAll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    hasFetched.current = false;
    await fetchAll(true);
    hasFetched.current = true;
    setRefreshing(false);
  }, [fetchAll]);

  // ── Status update ─────────────────────────────────────────────────────────
  const confirmStatusUpdate = async () => {
    if (!statusModal) return;
    setUpdating(true);
    try {
      const res = await apiPut(
        `/admin/orders/${statusModal.ref}/status`,
        { status: newStatus, statusMessage: statusMsg },
        adminEmail,
      ) as any;
      if (res?.ok) {
        setOrders(prev => prev.map(o =>
          o.ref === statusModal.ref ? { ...o, status: newStatus, statusMessage: statusMsg } : o,
        ));
        setStats(prev => prev ? {
          ...prev,
          byStatus: {
            ...prev.byStatus,
            [statusModal.status]: Math.max(0, (prev.byStatus[statusModal.status] ?? 1) - 1),
            [newStatus]: (prev.byStatus[newStatus] ?? 0) + 1,
          },
        } : prev);
        setStatusModal(null);
      } else {
        Alert.alert("Erreur", res?.error ?? "Mise à jour échouée");
      }
    } catch { Alert.alert("Erreur", "Impossible de mettre à jour"); }
    finally { setUpdating(false); }
  };

  // ── Add admin ─────────────────────────────────────────────────────────────
  const addAdmin = async () => {
    if (!newEmail.trim()) { Alert.alert("Erreur", "L'email est obligatoire"); return; }
    setAddingAdmin(true);
    try {
      const res = await apiPost("/admin/admins", {
        email:       newEmail.trim().toLowerCase(),
        name:        newName.trim() || "Administrateur",
        role:        "manager",
        permissions: { description: newPermissions.trim() || "Aucune restriction particulière définie." },
      }, adminEmail) as any;
      if (res?.admin) {
        setAdmins(prev => [...prev, res.admin]);
        setAdminModal(false);
        setNewEmail(""); setNewName(""); setNewPermissions("");
      } else {
        Alert.alert("Erreur", res?.error ?? "Impossible d'ajouter");
      }
    } catch { Alert.alert("Erreur", "Échec de l'ajout"); }
    finally { setAddingAdmin(false); }
  };

  const removeAdmin = (email: string) => {
    Alert.alert("Supprimer", `Retirer ${email} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        try {
          await apiDelete(`/admin/admins/${encodeURIComponent(email)}`, adminEmail);
          setAdmins(prev => prev.filter(a => a.email !== email));
        } catch { Alert.alert("Erreur", "Impossible de supprimer"); }
      }},
    ]);
  };

  const filteredOrders = filterStatus ? orders.filter(o => o.status === filterStatus) : orders;

  // ── En cours de chargement auth ──────────────────────────────────────────
  if (authLoading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={s.loadTxt}>Vérification des accès…</Text>
      </View>
    );
  }

  if (!adminEmail) {
    return (
      <View style={[s.root, s.center]}>
        <Feather name="shield-off" size={48} color="#ccc" />
        <Text style={s.loadTxt}>Accès administrateur requis</Text>
        <TouchableOpacity style={s.retryBtn} onPress={() => router.back()}>
          <Text style={s.retryTxt}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.root, { paddingTop: Platform.OS === "web" ? 0 : insets.top }]}>

      {/* Barre top */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={TEXT} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.topTitle}>Dashboard Admin</Text>
          <Text style={s.topSub}>KDO Cameroun · {adminEmail}</Text>
        </View>
        <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
          <Feather name="refresh-cw" size={18} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Erreur API */}
      {apiError && (
        <View style={s.errorBanner}>
          <Feather name="alert-circle" size={14} color="#D32F2F" />
          <Text style={s.errorTxt} numberOfLines={2}>{apiError}</Text>
          <TouchableOpacity onPress={() => fetchAll()} style={{ padding: 4 }}>
            <Text style={{ color: "#D32F2F", fontWeight: "700", fontSize: 12 }}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !stats ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={s.loadTxt}>Chargement du tableau de bord…</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} tintColor={PRIMARY} />}
        >
          {/* Stats cards */}
          {stats && (
            <View style={s.statsGrid}>
              <StatCard icon="shopping-bag" label="Commandes"      value={String(stats.totalOrders)}  color={PRIMARY} />
              <StatCard icon="users"        label="Clients"         value={String(stats.totalUsers)}   color={BLUE} />
              <StatCard icon="dollar-sign"  label="Chiffre d'aff."  value={`${Math.round(stats.totalRevenue / 1000)}k FCFA`} color="#4CAF50" />
              <StatCard icon="map-pin"      label="Ville active"    value={stats.topCity ?? "-"}       color="#9C27B0" sub={`${stats.topCityCount} cmd`} />
            </View>
          )}

          {/* Résumé statuts */}
          {stats?.byStatus && Object.keys(stats.byStatus).length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.statusRow}>
              {Object.entries(STATUS_LABELS).map(([k]) => {
                const count = stats.byStatus[k] ?? 0;
                if (!count) return null;
                return (
                  <View key={k} style={[s.statusChip, { backgroundColor: STATUS_COLORS[k] + "15", borderColor: STATUS_COLORS[k] + "60" }]}>
                    <Text style={[s.statusChipTxt, { color: STATUS_COLORS[k] }]}>{STATUS_LABELS[k]}: {count}</Text>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Onglets */}
          <View style={s.tabs}>
            {(["orders", "users", "admins"] as Tab[]).map(t => (
              <TouchableOpacity key={t} style={[s.tabBtn, tab === t && s.tabActive]} onPress={() => setTab(t)}>
                <Text style={[s.tabTxt, tab === t && s.tabTxtActive]}>
                  {t === "orders" ? `Commandes (${orders.length})` : t === "users" ? `Clients (${users.length})` : "Admins"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── COMMANDES ── */}
          {tab === "orders" && (
            <View style={s.section}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                <FilterChip label="Toutes" active={!filterStatus} onPress={() => setFilterStatus("")} />
                {Object.entries(STATUS_LABELS).map(([k, label]) => (
                  <FilterChip key={k} label={label} active={filterStatus === k} color={STATUS_COLORS[k]} onPress={() => setFilterStatus(filterStatus === k ? "" : k)} />
                ))}
              </ScrollView>

              {filteredOrders.length === 0 ? (
                <View style={s.emptyBox}>
                  <Feather name="inbox" size={36} color="#DDD" />
                  <Text style={s.emptyTxt}>{loading ? "Chargement…" : "Aucune commande"}</Text>
                </View>
              ) : (
                filteredOrders.map(order => {
                  const d = order.data ?? {};
                  return (
                    <TouchableOpacity key={order.ref} style={s.orderCard}
                      onPress={() => { setStatusModal(order); setNewStatus(order.status); setStatusMsg(order.statusMessage ?? ""); }}>
                      <View style={s.orderTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.orderRef}>{order.ref}</Text>
                          <Text style={s.orderClient}>{d.delivery?.fullName || order.userPhone}</Text>
                          {d.delivery?.phone ? <Text style={s.orderPhone}>{d.delivery.phone}</Text> : null}
                          <Text style={s.orderDate}>{new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</Text>
                        </View>
                        <View style={{ alignItems: "flex-end", gap: 6 }}>
                          <Text style={s.orderAmt}>{order.grandTotal.toLocaleString("fr-FR")} FCFA</Text>
                          <StatusBadge status={order.status} />
                        </View>
                      </View>
                      {order.statusMessage ? <Text style={s.orderMsg}>💬 {order.statusMessage}</Text> : null}
                      <View style={s.orderMeta}>
                        <Text style={s.orderMetaTxt}>📦 {Array.isArray(d.items) ? d.items.length : 0} article(s)</Text>
                        <Text style={s.orderMetaTxt}>📍 {order.city ?? "-"}</Text>
                        <Text style={s.orderMetaTxt}>💳 {d.paymentMethod ?? "-"}</Text>
                        <Text style={s.orderEdit}>Modifier →</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}

          {/* ── CLIENTS ── */}
          {tab === "users" && (
            <View style={s.section}>
              {users.length === 0 ? (
                <View style={s.emptyBox}>
                  <Feather name="users" size={36} color="#DDD" />
                  <Text style={s.emptyTxt}>{loading ? "Chargement…" : "Aucun client"}</Text>
                </View>
              ) : (
                users.map(u => {
                  const initials = (u.name || "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                  const orderCount = orders.filter(o => o.userPhone === u.phone).length;
                  return (
                    <View key={u.id} style={s.userCard}>
                      <View style={s.userAvatar}>
                        <Text style={s.userAvatarTxt}>{initials}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.userName}>{u.name}</Text>
                        <Text style={s.userPhone2}>{u.phone}</Text>
                        {u.email ? <Text style={s.userEmail}>{u.email}</Text> : null}
                        <Text style={s.userSince}>Inscrit le {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end", gap: 4 }}>
                        <View style={[s.badge, { backgroundColor: PRIMARY + "15", borderColor: PRIMARY + "50" }]}>
                          <Text style={[s.badgeTxt, { color: PRIMARY }]}>{u.points} pts</Text>
                        </View>
                        <Text style={s.userOrders}>{orderCount} cmd</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* ── ADMINS ── */}
          {tab === "admins" && (
            <View style={s.section}>
              <TouchableOpacity style={s.addAdminBtn} onPress={() => setAdminModal(true)}>
                <Feather name="user-plus" size={16} color="#fff" />
                <Text style={s.addAdminBtnTxt}> Ajouter un administrateur</Text>
              </TouchableOpacity>
              {admins.map(a => {
                const desc = (a as any).permissions?.description as string | undefined;
                const isSuper = a.role === "super";
                return (
                  <View key={a.id} style={s.adminCard}>
                    <View style={[s.adminRoleDot, { backgroundColor: isSuper ? PRIMARY : BLUE }]}>
                      <Feather name={isSuper ? "shield" : "user-check"} size={14} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.adminName}>{a.name}</Text>
                      <Text style={s.adminEmail2}>{a.email}</Text>
                      <View style={[s.badge, {
                        backgroundColor: (isSuper ? PRIMARY : BLUE) + "15",
                        borderColor: (isSuper ? PRIMARY : BLUE) + "50",
                        alignSelf: "flex-start", marginTop: 4,
                      }]}>
                        <Text style={[s.badgeTxt, { color: isSuper ? PRIMARY : BLUE }]}>
                          {isSuper ? "Super Admin" : "Administrateur"}
                        </Text>
                      </View>
                      {desc ? (
                        <View style={s.permBox}>
                          <Feather name="file-text" size={11} color={MUTED} />
                          <Text style={s.permTxt}>{desc}</Text>
                        </View>
                      ) : null}
                    </View>
                    {!isSuper && (
                      <TouchableOpacity onPress={() => removeAdmin(a.email)} style={{ padding: 8 }}>
                        <Feather name="trash-2" size={16} color="#F44336" />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ height: insets.bottom + 40 }} />
        </ScrollView>
      )}

      {/* ── Modal statut commande ── */}
      <Modal visible={!!statusModal} transparent animationType="slide" statusBarTranslucent>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Modifier la commande</Text>
            {statusModal && (
              <>
                <Text style={s.modalSub}>{statusModal.ref} · {statusModal.data?.delivery?.fullName ?? statusModal.userPhone}</Text>
                <Text style={s.modalLabel}>Statut</Text>
                <View style={s.statusBtns}>
                  {Object.entries(STATUS_LABELS).map(([k, label]) => (
                    <TouchableOpacity key={k}
                      style={[s.statusBtn, newStatus === k && { backgroundColor: STATUS_COLORS[k], borderColor: STATUS_COLORS[k] }]}
                      onPress={() => setNewStatus(k)}>
                      <Text style={[s.statusBtnTxt, newStatus === k && { color: "#fff" }]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={s.modalLabel}>Message au client (optionnel)</Text>
                <TextInput style={s.modalInput} value={statusMsg} onChangeText={setStatusMsg}
                  placeholder="Ex: Votre livreur est en route…" placeholderTextColor="#AAA" multiline />
                <TouchableOpacity style={[s.modalConfirm, updating && { opacity: 0.6 }]} onPress={confirmStatusUpdate} disabled={updating}>
                  {updating ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.modalConfirmTxt}>Confirmer</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={s.modalCancel} onPress={() => setStatusModal(null)}>
                  <Text style={s.modalCancelTxt}>Annuler</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Modal ajout admin ── */}
      <Modal visible={adminModal} transparent animationType="slide" statusBarTranslucent>
        <View style={s.modalOverlay}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ justifyContent: "flex-end", flexGrow: 1 }}>
            <View style={s.modalSheet}>
              <View style={s.modalHandle} />
              <Text style={s.modalTitle}>Ajouter un administrateur</Text>
              <Text style={s.modalSub}>Définissez ses accès en décrivant librement ce qu'il peut ou ne peut pas faire.</Text>

              <Text style={s.modalLabel}>Email *</Text>
              <TextInput style={s.modalInput} value={newEmail} onChangeText={setNewEmail}
                placeholder="admin@exemple.com" placeholderTextColor="#AAA"
                keyboardType="email-address" autoCapitalize="none" />

              <Text style={s.modalLabel}>Nom complet</Text>
              <TextInput style={s.modalInput} value={newName} onChangeText={setNewName}
                placeholder="Prénom Nom" placeholderTextColor="#AAA" />

              <Text style={s.modalLabel}>Droits et responsabilités</Text>
              <TextInput
                style={[s.modalInput, s.permInput]}
                value={newPermissions}
                onChangeText={setNewPermissions}
                placeholder={"Ex: Peut consulter les commandes et mettre à jour les statuts.\nNe peut pas modifier les prix, supprimer des clients ni gérer les autres administrateurs."}
                placeholderTextColor="#AAA"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <TouchableOpacity style={[s.modalConfirm, addingAdmin && { opacity: 0.6 }]} onPress={addAdmin} disabled={addingAdmin}>
                {addingAdmin ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.modalConfirmTxt}>Ajouter l'administrateur</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={s.modalCancel} onPress={() => { setAdminModal(false); setNewEmail(""); setNewName(""); setNewPermissions(""); }}>
                <Text style={s.modalCancelTxt}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function StatCard({ icon, label, value, color, sub }: { icon: any; label: string; value: string; color: string; sub?: string }) {
  return (
    <View style={[s.statCard, { borderLeftColor: color }]}>
      <View style={[s.statIcon, { backgroundColor: color + "15" }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
      {sub ? <Text style={[s.statLabel, { color, fontSize: 10 }]}>{sub}</Text> : null}
    </View>
  );
}

function FilterChip({ label, active, onPress, color }: { label: string; active: boolean; onPress: () => void; color?: string }) {
  const c = color ?? PRIMARY;
  return (
    <TouchableOpacity
      style={[s.filterChip, active && { backgroundColor: c + "20", borderColor: c }]}
      onPress={onPress}>
      <Text style={[s.filterChipTxt, active && { color: c, fontWeight: "700" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  loadTxt:{ fontSize: 14, color: MUTED, textAlign: "center" },
  retryBtn:{ backgroundColor: PRIMARY, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  retryTxt:{ color: "#fff", fontWeight: "700", fontSize: 14 },

  topBar:     { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: BORDER, gap: 12 },
  backBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  refreshBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: PRIMARY + "15", alignItems: "center", justifyContent: "center" },
  topTitle:   { fontSize: 17, fontWeight: "800", color: TEXT },
  topSub:     { fontSize: 10, color: MUTED, marginTop: 1 },

  errorBanner:{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFEBEE", borderRadius: 8, margin: 12, padding: 10, gap: 8, borderWidth: 1, borderColor: "#FFCDD2" },
  errorTxt:   { flex: 1, fontSize: 12, color: "#D32F2F" },

  statsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 14 },
  statCard:   { flex: 1, minWidth: "44%", backgroundColor: CARD, borderRadius: 12, padding: 14, borderLeftWidth: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statIcon:   { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue:  { fontSize: 22, fontWeight: "900", color: TEXT, marginBottom: 2 },
  statLabel:  { fontSize: 12, color: MUTED },

  statusRow:  { paddingHorizontal: 14, paddingBottom: 10, gap: 8 },
  statusChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusChipTxt: { fontSize: 12, fontWeight: "700" },

  tabs:       { flexDirection: "row", margin: 14, marginBottom: 0, backgroundColor: "#E8E8E8", borderRadius: 12, padding: 3 },
  tabBtn:     { flex: 1, paddingVertical: 9, alignItems: "center", borderRadius: 10 },
  tabActive:  { backgroundColor: CARD, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 3, elevation: 2 },
  tabTxt:     { fontSize: 12, color: MUTED, fontWeight: "600" },
  tabTxtActive: { color: TEXT, fontWeight: "700" },

  section:    { padding: 14, gap: 10 },
  emptyBox:   { alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 40 },
  emptyTxt:   { color: MUTED, fontSize: 14 },

  filterChip:     { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: BORDER, backgroundColor: CARD },
  filterChipTxt:  { fontSize: 12, color: MUTED, fontWeight: "600" },

  orderCard:  { backgroundColor: CARD, borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  orderTop:   { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 6 },
  orderRef:   { fontSize: 15, fontWeight: "800", color: TEXT },
  orderClient:{ fontSize: 13, color: TEXT, fontWeight: "600", marginTop: 2 },
  orderPhone: { fontSize: 12, color: MUTED },
  orderDate:  { fontSize: 11, color: "#AAA", marginTop: 2 },
  orderAmt:   { fontSize: 15, fontWeight: "800", color: PRIMARY },
  orderMsg:   { fontSize: 12, color: BLUE, fontStyle: "italic", marginBottom: 6 },
  orderMeta:  { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 8, borderTopWidth: 1, borderTopColor: BORDER },
  orderMetaTxt:{ fontSize: 11, color: MUTED },
  orderEdit:  { marginLeft: "auto" as any, fontSize: 12, fontWeight: "700", color: BLUE },

  userCard:   { backgroundColor: CARD, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: PRIMARY + "20", alignItems: "center", justifyContent: "center" },
  userAvatarTxt: { fontSize: 18, fontWeight: "900", color: PRIMARY },
  userName:   { fontSize: 15, fontWeight: "700", color: TEXT },
  userPhone2: { fontSize: 13, color: MUTED },
  userEmail:  { fontSize: 11, color: BLUE, marginTop: 1 },
  userSince:  { fontSize: 10, color: "#AAA", marginTop: 2 },
  userOrders: { fontSize: 11, color: MUTED },

  addAdminBtn:    { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: BLUE, borderRadius: 12, paddingVertical: 13 },
  addAdminBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
  adminCard:      { backgroundColor: CARD, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  adminRoleDot:   { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  adminName:      { fontSize: 15, fontWeight: "700", color: TEXT },
  adminEmail2:    { fontSize: 12, color: MUTED },
  permBox:        { flexDirection: "row", alignItems: "flex-start", gap: 5, marginTop: 8, backgroundColor: "#F8F9FA", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: BORDER },
  permTxt:        { flex: 1, fontSize: 11, color: MUTED, lineHeight: 16 },
  permInput:      { minHeight: 110, paddingTop: 12 },

  badge:    { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeTxt: { fontSize: 11, fontWeight: "700" as const },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  modalSheet:   { backgroundColor: CARD, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 44 },
  modalHandle:  { width: 40, height: 4, backgroundColor: "#DDD", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  modalTitle:   { fontSize: 18, fontWeight: "800", color: TEXT, marginBottom: 4 },
  modalSub:     { fontSize: 13, color: MUTED, marginBottom: 16 },
  modalLabel:   { fontSize: 13, fontWeight: "700", color: TEXT, marginBottom: 8, marginTop: 4 },
  modalInput:   { backgroundColor: BG, borderRadius: 10, borderWidth: 1, borderColor: BORDER, padding: 12, fontSize: 14, color: TEXT, marginBottom: 12, minHeight: 44 },
  statusBtns:   { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  statusBtn:    { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: BORDER, backgroundColor: CARD },
  statusBtnTxt: { fontSize: 13, fontWeight: "600", color: TEXT },
  modalConfirm:    { backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 10 },
  modalConfirmTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  modalCancel:     { paddingVertical: 10, alignItems: "center" },
  modalCancelTxt:  { color: MUTED, fontSize: 14 },
});
