import { Router } from "express";
import { randomUUID } from "node:crypto";
import fs from "fs";
import path from "path";
import { eq, desc, sql } from "drizzle-orm";
import {
  db,
  kdoOrdersTable,
  kdoUsersTable,
  kdoAdminsTable,
} from "@workspace/db";
import { sendEmail, buildAdminOrderEmail, ADMIN_EMAILS } from "../email";

const router = Router();

const UNAVAILABLE_FILE = path.join(process.cwd(), "unavailable.json");

// ── Super admin (propriétaire, ne peut pas être retiré) ───────────────────────
const SUPER_ADMIN_EMAIL = "exaucenapopolo2@gmail.com";

// ── Auth admin middleware ─────────────────────────────────────────────────────
async function requireAdmin(req: any, res: any, next: any) {
  // Accept x-admin-email header OR Authorization: Bearer <email>
  const headerEmail  = req.headers["x-admin-email"] as string | undefined;
  const bearerHeader = req.headers.authorization as string | undefined;
  const bearerEmail  = bearerHeader?.startsWith("Bearer ") ? bearerHeader.slice(7) : undefined;
  const email = ((headerEmail || bearerEmail) ?? "").trim().toLowerCase();
  if (!email) return res.status(401).json({ error: "Email administrateur requis" });
  if (email === SUPER_ADMIN_EMAIL.toLowerCase()) { req.adminEmail = email; req.adminRole = "super"; return next(); }
  try {
    const rows = await db.select().from(kdoAdminsTable)
      .where(eq(kdoAdminsTable.email, email)).limit(1);
    if (rows.length === 0) return res.status(403).json({ error: "Accès réservé aux administrateurs KDO" });
    req.adminEmail = email;
    req.adminRole  = rows[0].role;
    req.adminPerms = rows[0].permissions as any;
    next();
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function requireSuper(req: any, res: any, next: any) {
  if (req.adminRole !== "super") return res.status(403).json({ error: "Réservé au super-administrateur" });
  next();
}

// ─── GET /admin/me ────────────────────────────────────────────────────────────
router.get("/admin/me", requireAdmin, async (req: any, res) => {
  return res.json({ email: req.adminEmail, role: req.adminRole });
});

// ─── GET /admin/stats ─────────────────────────────────────────────────────────
router.get("/admin/stats", requireAdmin, async (_req, res) => {
  try {
    const [totalOrders, totalUsers, cityRows] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(kdoOrdersTable),
      db.select({ count: sql<number>`count(*)::int` }).from(kdoUsersTable),
      db.select({
        city:  kdoOrdersTable.city,
        count: sql<number>`count(*)::int`,
      }).from(kdoOrdersTable)
        .groupBy(kdoOrdersTable.city)
        .orderBy(desc(sql`count(*)`))
        .limit(1),
    ]);

    const revenueRows = await db.select({
      total: sql<number>`coalesce(sum(grand_total),0)::int`,
    }).from(kdoOrdersTable);

    const statusRows = await db.select({
      status: kdoOrdersTable.status,
      count:  sql<number>`count(*)::int`,
    }).from(kdoOrdersTable).groupBy(kdoOrdersTable.status);

    const statusMap: Record<string, number> = {};
    for (const r of statusRows) statusMap[r.status] = r.count;

    return res.json({
      totalOrders:  totalOrders[0]?.count ?? 0,
      totalUsers:   totalUsers[0]?.count  ?? 0,
      topCity:      cityRows[0]?.city     ?? "-",
      topCityCount: cityRows[0]?.count    ?? 0,
      totalRevenue: revenueRows[0]?.total ?? 0,
      byStatus:     statusMap,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /admin/orders ────────────────────────────────────────────────────────
router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const limit  = Math.min(parseInt((req.query as any).limit  ?? "50"),  200);
    const offset = parseInt((req.query as any).offset ?? "0");
    const status = (req.query as any).status as string | undefined;

    let query = db.select().from(kdoOrdersTable);
    if (status) (query as any).where(eq(kdoOrdersTable.status, status));

    const rows = await db.select().from(kdoOrdersTable)
      .where(status ? eq(kdoOrdersTable.status, status) : undefined)
      .orderBy(desc(kdoOrdersTable.createdAt))
      .limit(limit)
      .offset(offset);

    const orders = rows.map(r => ({
      id:            r.id,
      ref:           r.ref,
      userPhone:     r.userPhone,
      grandTotal:    r.grandTotal,
      city:          r.city,
      status:        r.status,
      statusMessage: r.statusMessage,
      createdAt:     r.createdAt,
      data:          r.data,
    }));
    return res.json({ orders });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── PUT /admin/orders/:ref/status ───────────────────────────────────────────
router.put("/admin/orders/:ref/status", requireAdmin, async (req: any, res) => {
  const { ref } = req.params;
  const { status, statusMessage } = req.body as {
    status?: string; statusMessage?: string;
  };

  const VALID = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!status || !VALID.includes(status)) {
    return res.status(400).json({ error: `status doit être: ${VALID.join(", ")}` });
  }

  try {
    // Fetch current data first to merge status into JSONB
    const [current] = await db.select().from(kdoOrdersTable).where(eq(kdoOrdersTable.ref, ref)).limit(1);
    if (!current) return res.status(404).json({ error: "Commande introuvable" });
    const mergedData = { ...(current.data as object ?? {}), status, statusMessage: statusMessage?.trim() || null };

    const [updated] = await db.update(kdoOrdersTable)
      .set({
        status,
        statusMessage: statusMessage?.trim() || null,
        data:          mergedData,
      })
      .where(eq(kdoOrdersTable.ref, ref))
      .returning();

    if (!updated) return res.status(404).json({ error: "Commande introuvable" });

    // Notifier l'utilisateur par email si statut changé
    const orderData = updated.data as any;
    const userEmail = orderData?.userEmail?.trim();
    if (userEmail) {
      const labelMap: Record<string, string> = {
        confirmed:  "✅ Commande confirmée",
        shipped:    "🚚 Commande en livraison",
        delivered:  "🎉 Commande livrée",
        cancelled:  "❌ Commande annulée",
        pending:    "⏳ Commande en attente",
      };
      const label = labelMap[status] ?? status;
      const msgHtml = statusMessage
        ? `<p style="margin:0 0 10px;font-size:15px;color:#444;line-height:1.6;">${statusMessage}</p>`
        : "";
      sendEmail({
        to:      userEmail,
        subject: `${label} — Réf. ${ref} — KDO Cameroun`,
        html:    `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#F5F7FA;padding:30px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.09);">
                <tr><td style="background:linear-gradient(135deg,#0066CC,#1A8FE3);padding:28px 32px;text-align:center;">
                  <h1 style="margin:0;color:#fff;font-size:22px;">${label}</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,.9);font-size:14px;">Référence : <strong>${ref}</strong></p>
                </td></tr>
                <tr><td style="padding:28px 32px;">
                  <p style="margin:0 0 10px;font-size:16px;color:#1A1A1A;font-weight:600;">Bonjour ${orderData?.delivery?.fullName || "cher client"} 👋</p>
                  ${msgHtml}
                  <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">
                    Pour toute question, notre équipe reste disponible via WhatsApp ou sur notre site :
                    <a href="https://chezkdo.com" style="color:#FF6B00;font-weight:700;">chezkdo.com</a>
                  </p>
                </td></tr>
                <tr><td style="background:#111;padding:16px 32px;text-align:center;">
                  <p style="margin:0 0 4px;color:rgba(255,255,255,.5);font-size:11px;">
                    Propulsé par <a href="https://socialboosthorizon.com" style="color:rgba(255,255,255,.7);text-decoration:none;font-weight:600;">Social Boost Horizon</a>
                    &nbsp;·&nbsp;<em>votre visibilité notre horizon</em>
                  </p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>`,
      }).catch(() => {});
    }

    return res.json({ ok: true, order: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /admin/users ─────────────────────────────────────────────────────────
router.get("/admin/users", requireAdmin, async (req, res) => {
  try {
    const limit  = Math.min(parseInt((req.query as any).limit  ?? "50"),  200);
    const offset = parseInt((req.query as any).offset ?? "0");
    const rows   = await db.select({
      id:        kdoUsersTable.id,
      phone:     kdoUsersTable.phone,
      name:      kdoUsersTable.name,
      email:     kdoUsersTable.email,
      whatsapp:  kdoUsersTable.whatsapp,
      points:    kdoUsersTable.points,
      createdAt: kdoUsersTable.createdAt,
    }).from(kdoUsersTable)
      .orderBy(desc(kdoUsersTable.createdAt))
      .limit(limit)
      .offset(offset);
    return res.json({ users: rows });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /admin/admins ────────────────────────────────────────────────────────
router.get("/admin/admins", requireAdmin, requireSuper, async (_req, res) => {
  try {
    const rows = await db.select().from(kdoAdminsTable).orderBy(kdoAdminsTable.createdAt);
    return res.json({
      admins: [
        { id: "super", email: SUPER_ADMIN_EMAIL, name: "Super Admin (propriétaire)", role: "super", permissions: null, addedBy: null },
        ...rows,
      ],
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── POST /admin/admins ───────────────────────────────────────────────────────
router.post("/admin/admins", requireAdmin, requireSuper, async (req: any, res) => {
  const { email, name, role, permissions } = req.body as {
    email?: string; name?: string; role?: string; permissions?: object;
  };
  if (!email?.trim()) return res.status(400).json({ error: "email requis" });
  if (email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(409).json({ error: "Cet email est déjà super-administrateur" });
  }
  const VALID_ROLES = ["manager", "viewer"];
  const safeRole = VALID_ROLES.includes(role ?? "") ? role! : "manager";

  try {
    const [inserted] = await db.insert(kdoAdminsTable).values({
      id:          randomUUID(),
      email:       email.trim().toLowerCase(),
      name:        (name ?? "Administrateur").trim(),
      role:        safeRole,
      permissions: permissions ?? null,
      addedBy:     req.adminEmail,
    }).onConflictDoNothing().returning();

    if (!inserted) return res.status(409).json({ error: "Cet email est déjà administrateur" });
    return res.status(201).json({ admin: inserted });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── DELETE /admin/admins/:email ──────────────────────────────────────────────
router.delete("/admin/admins/:email", requireAdmin, requireSuper, async (req: any, res) => {
  const target = req.params.email.toLowerCase();
  if (target === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({ error: "Impossible de supprimer le super-administrateur" });
  }
  try {
    await db.delete(kdoAdminsTable).where(eq(kdoAdminsTable.email, target));
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── Unavailable products (existing logic kept) ───────────────────────────────
interface UnavailableEntry { productId: string; city: string; }
function loadUnavailable(): UnavailableEntry[] {
  try {
    if (fs.existsSync(UNAVAILABLE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(UNAVAILABLE_FILE, "utf-8"));
      if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
        return (raw as string[]).map(id => ({ productId: id, city: "*" }));
      }
      return raw as UnavailableEntry[];
    }
  } catch {}
  return [];
}
function saveUnavailable(e: UnavailableEntry[]) {
  fs.writeFileSync(UNAVAILABLE_FILE, JSON.stringify(e, null, 2), "utf-8");
}

const LEGACY_ADMIN = [SUPER_ADMIN_EMAIL, "mcexauofficiel@gmail.com"];

router.get("/admin/unavailable", (_req, res) => {
  res.json({ unavailable: loadUnavailable() });
});

router.post("/admin/mark-unavailable", (req, res) => {
  const { productId, city, adminEmail } = req.body as { productId?: string; city?: string; adminEmail?: string };
  if (!productId) return res.status(400).json({ error: "productId requis" });
  if (!city)      return res.status(400).json({ error: "city requis" });
  if (!adminEmail || !LEGACY_ADMIN.includes(adminEmail)) {
    return res.status(403).json({ error: "Accès réservé aux administrateurs KDO" });
  }
  const entries = loadUnavailable();
  if (!entries.some(e => e.productId === productId && e.city === city)) {
    entries.push({ productId, city });
    saveUnavailable(entries);
  }
  return res.json({ ok: true, unavailable: entries });
});

router.delete("/admin/mark-unavailable/:productId", (req, res) => {
  const { productId } = req.params;
  const { adminEmail, city } = req.body as { adminEmail?: string; city?: string };
  if (!adminEmail || !LEGACY_ADMIN.includes(adminEmail)) {
    return res.status(403).json({ error: "Accès réservé aux administrateurs KDO" });
  }
  let entries = loadUnavailable();
  entries = city
    ? entries.filter(e => !(e.productId === productId && e.city === city))
    : entries.filter(e => e.productId !== productId);
  saveUnavailable(entries);
  return res.json({ ok: true, unavailable: entries });
});

export default router;
