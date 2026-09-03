import { Router } from "express";
import axios, { type AxiosError } from "axios";
import twilio from "twilio";
import {
  ADMIN_EMAILS,
  buildAdminOrderEmail,
  buildUserOrderEmail,
  sendEmail,
} from "../email";

const router = Router();

const FAPSHI_BASE = "https://live.fapshi.com";
const FAPSHI_USER = process.env["FAPSHI_API_USER"] || "";
const FAPSHI_KEY  = process.env["FAPSHI_API_KEY"]  || "";

const TWILIO_SID   = process.env["TWILIO_ACCOUNT_SID"]  || "";
const TWILIO_TOKEN = process.env["TWILIO_AUTH_TOKEN"]    || "";
const WA_FROM      = process.env["TWILIO_WHATSAPP_FROM"] || "";
const WA_TO        = process.env["TWILIO_WHATSAPP_TO"]   || "";

// ntfy.sh — notification push instantanée
const NTFY_TOPIC = "kdo-admin-cameroun-9x7k2m";

async function sendNtfyNotification(order: any): Promise<{ sent: boolean; error?: string }> {
  try {
    const items = (order.items || [])
      .map((i: any) => `${i.name} ×${i.quantity}`)
      .join(", ");

    const body = [
      `👤 ${order.delivery?.fullName || "?"}`,
      `📍 ${order.delivery?.city || "?"} — ${order.delivery?.deliveryMode === "boutique" ? "Retrait boutique" : order.delivery?.deliveryMode === "expedition" ? "Expédition" : "Livraison domicile"}`,
      `📦 ${items}`,
      order.promoCode ? `🏷️ Code: ${order.promoCode}` : null,
      `💰 Total: ${Number(order.grandTotal || 0).toLocaleString("fr-FR")} FCFA`,
      `💳 ${order.paymentMethod || "?"}`,
      `📞 WhatsApp: ${order.whatsappPhone || "-"} | Tél: ${order.callPhone || "-"}`,
      `🔑 Réf: ${order.ref}`,
    ].filter(Boolean).join("\n");

    await axios.post(`https://ntfy.sh/${NTFY_TOPIC}`, body, {
      headers: {
        "Title":        `Commande KDO - ${Number(order.grandTotal || 0)} FCFA`,
        "Priority":     "high",
        "Tags":         "shopping,money_with_wings",
        "Content-Type": "text/plain; charset=utf-8",
      },
      timeout: 8000,
    });
    return { sent: true };
  } catch (e: any) {
    return { sent: false, error: e?.message };
  }
}

function formatOrderNotification(order: any): string {
  const items = (order.items || [])
    .map((i: any) => `  • ${i.name} × ${i.quantity} = ${Number(i.price * i.quantity).toLocaleString("fr-FR")} FCFA`)
    .join("\n");

  return [
    `🛒 *NOUVELLE COMMANDE KDO Cameroun*`,
    `📋 Réf: *${order.ref}*`,
    ``,
    `👤 *CLIENT*`,
    `  Nom:          ${order.delivery?.fullName || "-"}`,
    `  WhatsApp:     ${order.whatsappPhone || "-"}`,
    `  Tél:          ${order.callPhone || "-"}`,
    `  Email:        ${order.userEmail || "-"}`,
    ``,
    `📍 *LIVRAISON*`,
    `  Ville:    ${order.delivery?.city || "-"}`,
    `  Mode:     ${order.delivery?.deliveryMode === "boutique" ? "Retrait boutique" : order.delivery?.deliveryMode === "expedition" ? "Expédition" : "Livraison domicile"}`,
    `  Adresse:  ${order.delivery?.address || "-"}`,
    `  Consignes: ${order.delivery?.instructions || "Aucune"}`,
    ``,
    `🛍️ *ARTICLES (${(order.items || []).length})*`,
    items,
    ``,
    `💰 *TOTAL: ${Number(order.grandTotal || 0).toLocaleString("fr-FR")} FCFA*`,
    `💳 ${order.paymentMethod || "-"}`,
    `📅 ${order.date || new Date().toLocaleString("fr-FR")}`,
  ].join("\n");
}

const fapshiHeaders = {
  "apiuser":          FAPSHI_USER,
  "apikey":           FAPSHI_KEY,
  "Content-Type":     "application/json",
  "X-Requested-With": "XMLHttpRequest",
};

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("237") && digits.length >= 12) return digits.slice(3);
  return digits;
}

// ─── POST /payment/direct ────────────────────────────────────────────────────
router.post("/payment/direct", async (req, res) => {
  const { amount, phone, name, orderRef, externalId, medium, email } = req.body;
  if (!amount || !phone) return res.status(400).json({ error: "amount et phone sont requis" });

  const localPhone = normalizePhone(String(phone));
  const amountInt  = Math.round(Number(amount));

  try {
    const payload = {
      amount:     amountInt,
      phone:      localPhone,
      medium:     medium || "mobile money",
      name:       name || "Client KDO",
      externalId: externalId || orderRef || undefined,
      message:    `Paiement KDO Cameroun - ${orderRef || "Commande"}`,
    };
    const resp = await axios.post(`${FAPSHI_BASE}/direct-pay`, payload, {
      headers: fapshiHeaders,
      timeout: 30000,
    });
    return res.json({ ...resp.data, mode: "direct" });
  } catch (err) {
    const axErr = err as AxiosError<any>;
    const status = axErr?.response?.status;
    const message: string = axErr?.response?.data?.message || axErr?.message || "";
    if (status !== 403 && !message.toLowerCase().includes("forbidden")) {
      const msg = axErr?.response?.data?.message || axErr?.message || "Erreur Fapshi";
      return res.status(status || 502).json({ error: msg, details: axErr?.response?.data });
    }
  }

  try {
    const baseUrl = process.env["EXPO_PUBLIC_API_URL"]
      ? process.env["EXPO_PUBLIC_API_URL"].replace("/api", "")
      : "https://fapshi.com";
    const payload: Record<string, unknown> = {
      amount:      amountInt,
      email:       email || "client@kdocameroun.com",
      redirectUrl: `${baseUrl}/payment-done`,
      message:     `Paiement KDO Cameroun - ${orderRef || "Commande"}`,
    };
    if (externalId || orderRef) payload["externalId"] = externalId || orderRef;
    const resp = await axios.post(`${FAPSHI_BASE}/initiate-pay`, payload, {
      headers: fapshiHeaders,
      timeout: 30000,
    });
    return res.json({ ...resp.data, mode: "link" });
  } catch (err2) {
    const axErr2 = err2 as AxiosError<any>;
    const msg = axErr2?.response?.data?.message || axErr2?.message || "Erreur Fapshi initiate-pay";
    return res.status(axErr2?.response?.status || 502).json({ error: msg, details: axErr2?.response?.data });
  }
});

// ─── GET /payment/status/:transId ────────────────────────────────────────────
router.get("/payment/status/:transId", async (req, res) => {
  const { transId } = req.params;
  if (!transId) return res.status(400).json({ error: "transId requis" });
  try {
    const resp = await axios.get(`${FAPSHI_BASE}/payment-status/${transId}`, {
      headers: fapshiHeaders,
      timeout: 15000,
    });
    return res.json(resp.data);
  } catch (err) {
    const axErr = err as AxiosError<any>;
    return res.status(axErr?.response?.status || 502).json({ error: axErr?.message });
  }
});

// ─── POST /payment/expire/:transId ───────────────────────────────────────────
router.post("/payment/expire/:transId", async (req, res) => {
  const { transId } = req.params;
  try {
    const resp = await axios.post(`${FAPSHI_BASE}/expire-pay/${transId}`, {}, {
      headers: fapshiHeaders,
      timeout: 10000,
    });
    return res.json(resp.data);
  } catch (err) {
    const axErr = err as AxiosError<any>;
    return res.status(axErr?.response?.status || 502).json({ error: axErr?.message });
  }
});

// ─── POST /payment/confirm ────────────────────────────────────────────────────
// Déclenché après validation de la commande — envoie :
//   • WhatsApp admin (Twilio)
//   • Push admin (ntfy)
//   • Email admin (Resend → ADMIN_EMAILS)
//   • Email utilisateur (Resend → order.userEmail si fourni)
router.post("/payment/confirm", async (req, res) => {
  const { order } = req.body;
  if (!order) return res.status(400).json({ error: "order est requis" });

  const userEmail: string | undefined = order.userEmail?.trim() || undefined;

  const tasks: Promise<any>[] = [
    // 1. WhatsApp admin (Twilio)
    (async () => {
      const client = twilio(TWILIO_SID, TWILIO_TOKEN);
      const message = formatOrderNotification(order);
      const cleanFrom = WA_FROM.replace(/^whatsapp:/i, "").trim();
      const cleanTo   = WA_TO.replace(/^whatsapp:/i, "").trim();
      const msg = await client.messages.create({
        from: `whatsapp:${cleanFrom}`,
        to:   `whatsapp:${cleanTo}`,
        body: message,
      });
      return { sid: msg.sid, status: msg.status };
    })(),

    // 2. ntfy push admin
    sendNtfyNotification(order),

    // 3. Email admin (toutes les commandes → ADMIN_EMAILS)
    sendEmail({
      to:      ADMIN_EMAILS,
      subject: `🛒 Commande ${order.ref || "?"} — ${Number(order.grandTotal || 0).toLocaleString("fr-FR")} FCFA — ${order.delivery?.city || "?"}`,
      html:    buildAdminOrderEmail(order),
    }),

    // 4. Email utilisateur (confirmation de réception) — si email fourni
    userEmail
      ? sendEmail({
          to:      userEmail,
          subject: `✅ Votre commande ${order.ref || ""} a bien été reçue — KDO Cameroun`,
          html:    buildUserOrderEmail(order),
        })
      : Promise.resolve({ sent: false, error: "Pas d'email utilisateur" }),
  ];

  const [waResult, ntfyResult, adminEmailResult, userEmailResult] = await Promise.allSettled(tasks);

  const waOk         = waResult.status === "fulfilled";
  const ntfyOk       = ntfyResult.status === "fulfilled" && (ntfyResult.value as any).sent;
  const adminEmailOk = adminEmailResult.status === "fulfilled" && (adminEmailResult.value as any).sent;
  const userEmailOk  = userEmailResult.status === "fulfilled" && (userEmailResult.value as any).sent;

  return res.json({
    ok:          true,
    whatsapp:    waOk,
    ntfy:        ntfyOk,
    adminEmail:  adminEmailOk,
    userEmail:   userEmailOk,
    waError:         waOk         ? undefined : (waResult as PromiseRejectedResult).reason?.message,
    adminEmailError: adminEmailOk ? undefined : (adminEmailResult.status === "rejected"
      ? (adminEmailResult as PromiseRejectedResult).reason?.message
      : (adminEmailResult.value as any).error),
    userEmailError:  userEmailOk  ? undefined : (userEmailResult.status === "rejected"
      ? (userEmailResult as PromiseRejectedResult).reason?.message
      : (userEmailResult.value as any).error),
  });
});

// ─── GET /payment/whatsapp-test ──────────────────────────────────────────────
router.get("/payment/whatsapp-test", async (req, res) => {
  try {
    const client = twilio(TWILIO_SID, TWILIO_TOKEN);
    const cleanFrom = WA_FROM.replace(/^whatsapp:/i, "").trim();
    const cleanTo   = WA_TO.replace(/^whatsapp:/i, "").trim();
    const msg = await client.messages.create({
      from:             `whatsapp:${cleanFrom}`,
      to:               `whatsapp:${cleanTo}`,
      contentSid:       "HXb5b62575e6e4ff6129ad7c8efe1f983e",
      contentVariables: JSON.stringify({ "1": "commande KDO", "2": "maintenant" }),
    });
    await new Promise(r => setTimeout(r, 4000));
    const fetched = await client.messages(msg.sid).fetch();
    return res.json({
      accountSid:   TWILIO_SID ? `${TWILIO_SID.slice(0, 6)}...${TWILIO_SID.slice(-4)}` : "NON DÉFINI",
      envFrom:      WA_FROM,
      envTo:        WA_TO,
      sentFrom:     `whatsapp:${cleanFrom}`,
      sentTo:       `whatsapp:${cleanTo}`,
      sid:          msg.sid,
      sentStatus:   msg.status,
      finalStatus:  fetched.status,
      errorCode:    fetched.errorCode,
      errorMessage: fetched.errorMessage,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, code: err?.code });
  }
});

export default router;
