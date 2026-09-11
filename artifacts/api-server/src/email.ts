import { Resend } from "resend";

const RESEND_KEY = process.env["RESEND_API_KEY"] || "";

export const EMAIL_FROM   = "KDO Cameroun <commandes@trixhub.site>";
export const ADMIN_EMAILS = ["exaucenapopolo2@gmail.com", "mcexau0@gmail.com"];
export const SITE_URL     = "https://chezkdo.com";
export const SBH_URL      = "https://socialboosthorizon.com";

// ── Shared footer ─────────────────────────────────────────────────────────────
function emailFooter(forUser = false) {
  return `
  <tr><td style="background:#111;padding:20px 32px 24px;text-align:center;">
    ${forUser ? `
    <p style="margin:0 0 6px;">
      <a href="${SITE_URL}" style="color:#FF6B00;font-size:14px;font-weight:700;text-decoration:none;">🌐 ${SITE_URL}</a>
    </p>
    ` : ""}
    <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:11px;">
      Propulsé par
      <a href="${SBH_URL}" style="color:rgba(255,255,255,0.7);text-decoration:none;font-weight:600;">Social Boost Horizon</a>
      &nbsp;·&nbsp;<em>votre visibilité notre horizon</em>
    </p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.3);font-size:10px;">
      KDO Cameroun · Cet email est automatique · Ne pas répondre
    </p>
  </td></tr>`;
}

// ── Wrapper HTML ──────────────────────────────────────────────────────────────
function wrap(inner: string, forUser = false) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.09);">
        ${inner}
        ${emailFooter(forUser)}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ─── Template : Email admin — nouvelle commande ───────────────────────────────
export function buildAdminOrderEmail(order: any): string {
  const items = (order.items || []) as Array<{
    name: string;
    quantity: number;
    price: number;
  }>;

  const mode = order.delivery?.deliveryMode || "livraison";
  const isBoutique = mode === "boutique";
  const isExpedition = mode === "expedition";

  const receptionLabel = isBoutique
    ? "Retrait en boutique"
    : isExpedition
      ? "Expédition"
      : "Livraison à domicile";

  const itemsHtml = items.map((i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #F0F0F0;font-size:14px;color:#333;">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #F0F0F0;text-align:center;font-size:14px;color:#555;">×${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #F0F0F0;text-align:right;font-weight:700;color:#FF6B00;font-size:14px;">
        ${Number(i.price * i.quantity).toLocaleString("fr-FR")} FCFA
      </td>
    </tr>`).join("");

  const receptionAmount = isBoutique
    ? 0
    : Number(order.deliveryPrice || 0);

  return wrap(`
  <tr><td style="background:linear-gradient(135deg,#FF6B00,#FF8C00);padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:1px;">🛒 NOUVELLE COMMANDE KDO</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">Référence : <strong>${order.ref || "-"}</strong></p>
  </td></tr>

  <tr><td style="padding:24px 32px 0;">
    <h2 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">👤 Client</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:5px 0;font-size:14px;color:#333;"><strong>Nom :</strong> ${order.delivery?.fullName || "-"}</td></tr>
      <tr><td style="padding:5px 0;font-size:14px;color:#333;"><strong>Téléphone :</strong> ${order.whatsappPhone || order.callPhone || "-"}</td></tr>
      <tr><td style="padding:5px 0;font-size:14px;color:#333;"><strong>Email :</strong> ${order.userEmail || "-"}</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:20px 32px 0;">
    <h2 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">📍 ${receptionLabel}</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:5px 0;font-size:14px;color:#333;"><strong>Ville :</strong> ${order.delivery?.city || "-"}</td></tr>
      <tr><td style="padding:5px 0;font-size:14px;color:#333;"><strong>Mode :</strong> ${receptionLabel}</td></tr>
      ${!isBoutique ? `<tr><td style="padding:5px 0;font-size:14px;color:#333;"><strong>Adresse :</strong> ${order.delivery?.address || "-"}</td></tr>` : ""}
      ${order.delivery?.instructions ? `<tr><td style="padding:5px 0;font-size:14px;color:#333;"><strong>Consignes :</strong> ${order.delivery.instructions}</td></tr>` : ""}
    </table>
  </td></tr>

  <tr><td style="padding:20px 32px 0;">
    <h2 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">🛍️ Articles (${items.length})</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F0F0F0;border-radius:8px;overflow:hidden;">
      <tr style="background:#F8F8F8;">
        <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:700;">Produit</th>
        <th style="padding:10px 12px;text-align:center;font-size:12px;color:#888;font-weight:700;">Qté</th>
        <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;font-weight:700;">Montant</th>
      </tr>
      ${itemsHtml}
    </table>
  </td></tr>

  <tr><td style="padding:20px 32px 0;">
    <h2 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">💰 Récapitulatif</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:4px 0;font-size:14px;color:#555;">Sous-total</td>
          <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">${Number(order.subtotal || 0).toLocaleString("fr-FR")} FCFA</td></tr>
      ${order.promoCode ? `<tr><td style="padding:4px 0;font-size:14px;color:#555;">Code promo</td><td style="padding:4px 0;font-size:14px;color:#FF6B00;text-align:right;">${order.promoCode}</td></tr>` : ""}
      <tr><td style="padding:4px 0;font-size:14px;color:#555;">${isBoutique ? "Retrait en boutique" : isExpedition ? "Expédition" : "Livraison"}</td>
          <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">+${receptionAmount.toLocaleString("fr-FR")} FCFA</td></tr>
      <tr><td colspan="2" style="padding:8px 0;border-top:2px solid #FF6B00;"></td></tr>
      <tr><td style="padding:4px 0;font-size:18px;font-weight:800;color:#1A1A1A;">TOTAL</td>
          <td style="padding:4px 0;font-size:18px;font-weight:800;color:#FF6B00;text-align:right;">${Number(order.grandTotal || 0).toLocaleString("fr-FR")} FCFA</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:20px 32px 28px;">
    <div style="background:#FFF8F0;border-left:4px solid #FF6B00;border-radius:6px;padding:14px 18px;">
      <p style="margin:0;font-size:14px;color:#333;"><strong>💳 Paiement :</strong> ${order.paymentMethod || (isBoutique ? "Paiement en boutique" : "À confirmer")}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#888;">Date : ${order.date || new Date().toLocaleString("fr-FR")}</p>
    </div>
  </td></tr>`);
}

export function buildUserOrderEmail(order: any): string {
  const items = (order.items || []) as Array<{
    name: string;
    quantity: number;
    price: number;
  }>;

  const phone =
    order.whatsappPhone ||
    order.callPhone ||
    order.delivery?.phone ||
    "-";

  const mode = order.delivery?.deliveryMode || "livraison";
  const isBoutique = mode === "boutique";
  const isExpedition = mode === "expedition";

  const city = order.delivery?.city || "-";

  const contactMessage = isBoutique
    ? `Notre équipe va vous contacter très bientôt pour confirmer la date et l'heure de votre retrait en boutique à <strong>${city}</strong>.`
    : isExpedition
      ? `Notre équipe va vous contacter très bientôt au numéro <strong style="color:#FF6B00;">${phone}</strong> pour organiser l'expédition de votre commande.`
      : `Notre équipe va vous contacter très bientôt au numéro <strong style="color:#FF6B00;">${phone}</strong> pour organiser votre livraison à <strong>${city}</strong>.`;

  const paymentLabel =
    order.paymentMethod ||
    (isBoutique
      ? "Paiement en boutique"
      : isExpedition
        ? "À confirmer avec notre équipe"
        : "Paiement à la livraison");

  const paymentMessage = isBoutique
    ? "Vous paierez directement en boutique au moment du retrait. Aucun frais de livraison ne sera facturé."
    : isExpedition
      ? "Notre équipe vous précisera les modalités de paiement lors de la confirmation de l'expédition."
      : "Vous paierez au moment de la livraison. Pas de paiement en avance.";

  const itemsHtml = items.map((i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #F0F0F0;font-size:14px;color:#333;">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #F0F0F0;text-align:center;font-size:14px;color:#555;">×${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #F0F0F0;text-align:right;font-weight:700;color:#FF6B00;font-size:14px;">
        ${Number(i.price * i.quantity).toLocaleString("fr-FR")} FCFA
      </td>
    </tr>`).join("");

  const handlingLabel = isBoutique
    ? "Retrait en boutique"
    : isExpedition
      ? "Expédition"
      : "Livraison";

  const handlingAmount = isBoutique
    ? 0
    : Number(order.deliveryPrice || 0);

  return wrap(`
  <tr><td style="background:linear-gradient(135deg,#0066CC,#1A8FE3);padding:32px 32px 24px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;">✅ Commande confirmée !</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">Réf. <strong>${order.ref || "-"}</strong></p>
  </td></tr>

  <tr><td style="padding:28px 32px 0;">
    <p style="margin:0 0 10px;font-size:16px;color:#1A1A1A;font-weight:600;">
      Bonjour ${order.delivery?.fullName || "cher(e) client(e)"} 👋
    </p>

    <p style="margin:0 0 14px;font-size:15px;color:#444;line-height:1.6;">
      Nous avons bien reçu votre commande et nous vous en remercions.
      ${contactMessage}
    </p>

    <div style="background:#F0F8FF;border-left:4px solid #0066CC;border-radius:6px;padding:14px 18px;margin-bottom:4px;">
      <p style="margin:0;font-size:14px;color:#0066CC;font-weight:600;">
        💳 Mode de paiement : ${paymentLabel}
      </p>
      <p style="margin:6px 0 0;font-size:13px;color:#555;">
        ${paymentMessage}
      </p>
    </div>
  </td></tr>

  <tr><td style="padding:20px 32px 0;">
    <h2 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">🛍️ Votre commande</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F0F0F0;border-radius:8px;overflow:hidden;">
      <tr style="background:#F8F8F8;">
        <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:700;">Produit</th>
        <th style="padding:10px 12px;text-align:center;font-size:12px;color:#888;font-weight:700;">Qté</th>
        <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;font-weight:700;">Montant</th>
      </tr>
      ${itemsHtml}
    </table>
  </td></tr>

  <tr><td style="padding:16px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:4px 0;font-size:14px;color:#555;">Sous-total</td>
          <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">${Number(order.subtotal || 0).toLocaleString("fr-FR")} FCFA</td></tr>
      <tr><td style="padding:4px 0;font-size:14px;color:#555;">${handlingLabel}</td>
          <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">+${handlingAmount.toLocaleString("fr-FR")} FCFA</td></tr>
      <tr><td colspan="2" style="padding:6px 0;border-top:2px solid #0066CC;"></td></tr>
      <tr><td style="font-size:17px;font-weight:800;color:#1A1A1A;">Total à payer</td>
          <td style="font-size:17px;font-weight:800;color:#FF6B00;text-align:right;">${Number(order.grandTotal || 0).toLocaleString("fr-FR")} FCFA</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 32px 28px;text-align:center;">
    <p style="margin:0 0 16px;font-size:14px;color:#555;">
      Consultez notre catalogue complet et suivez vos commandes sur notre site.
    </p>
    <a href="${SITE_URL}"
       style="display:inline-block;background:linear-gradient(135deg,#FF6B00,#FF8C00);color:#fff;text-decoration:none;
              padding:13px 32px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
      Visiter chezkdo.com →
    </a>
  </td></tr>`, true);
}

export function buildWelcomeEmail(name: string, phone: string): string {
  return wrap(`
  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#FF6B00,#FF8C00);padding:36px 32px 28px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;">🎉 Bienvenue chez KDO Cameroun !</h1>
    <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">Votre compte a été créé avec succès</p>
  </td></tr>

  <!-- Message -->
  <tr><td style="padding:32px 32px 0;">
    <p style="margin:0 0 14px;font-size:17px;color:#1A1A1A;font-weight:600;">Bonjour ${name} 👋</p>
    <p style="margin:0 0 14px;font-size:15px;color:#444;line-height:1.7;">
      Merci de rejoindre la famille KDO Cameroun ! Vous pouvez dès maintenant parcourir 
      notre catalogue, ajouter des produits à votre panier et passer commande facilement 
      depuis l'application.
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#444;line-height:1.7;">
      Votre numéro de contact enregistré : <strong style="color:#FF6B00;">${phone}</strong><br>
      Nos équipes utiliseront ce numéro pour vous livrer.
    </p>
  </td></tr>

  <!-- Points forts -->
  <tr><td style="padding:0 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FB;border-radius:10px;overflow:hidden;">
      <tr>
        <td style="padding:16px 20px;font-size:14px;color:#333;border-bottom:1px solid #EBEBEB;">
          🛍️ <strong>+165 produits</strong> disponibles — électronique, maison, mode et plus
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;font-size:14px;color:#333;border-bottom:1px solid #EBEBEB;">
          🚚 <strong>Livraison dans 8 villes</strong> du Cameroun
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;font-size:14px;color:#333;border-bottom:1px solid #EBEBEB;">
          💳 <strong>Paiement à la livraison</strong> — vous payez seulement à la réception
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;font-size:14px;color:#333;">
          🎁 <strong>Codes promo & offres spéciales</strong> régulièrement disponibles
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:28px 32px 28px;text-align:center;">
    <a href="${SITE_URL}"
       style="display:inline-block;background:linear-gradient(135deg,#FF6B00,#FF8C00);color:#fff;text-decoration:none;
              padding:14px 36px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
      Découvrir notre boutique →
    </a>
  </td></tr>`, true);
}

// ─── Resend sender utility ────────────────────────────────────────────────────
export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!RESEND_KEY) return { sent: false, error: "RESEND_API_KEY non configurée" };
  try {
    const resend = new Resend(RESEND_KEY);
    const { error } = await resend.emails.send({
      from:    EMAIL_FROM,
      to:      opts.to,
      subject: opts.subject,
      html:    opts.html,
    });
    if (error) return { sent: false, error: JSON.stringify(error) };
    return { sent: true };
  } catch (e: any) {
    return { sent: false, error: e?.message };
  }
}
