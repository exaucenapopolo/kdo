import { Router } from "express";
import { randomUUID } from "node:crypto";
import { eq, desc, sql } from "drizzle-orm";
import {
  db,
  kdoOrdersTable,
  kdoUsersTable,
  kdoAdminsTable,
} from "@workspace/db";
import { sendEmail, buildAdminOrderEmail, ADMIN_EMAILS } from "../email.js";

const router = Router();


// â”€â”€ Super admin (propriÃ©taire, ne peut pas Ãªtre retirÃ©) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SUPER_ADMIN_EMAIL = "exaucenapopolo2@gmail.com";
const LEGACY_ADMIN = [SUPER_ADMIN_EMAIL, 'mcexauofficiel@gmail.com'];

// â”€â”€ Auth admin middleware â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    if (rows.length === 0) return res.status(403).json({ error: "AccÃ¨s rÃ©servÃ© aux administrateurs KDO" });
    req.adminEmail = email;
    req.adminRole  = rows[0].role;
    req.adminPerms = rows[0].permissions as any;
    next();
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function requireSuper(req: any, res: any, next: any) {
  if (req.adminRole !== "super") return res.status(403).json({ error: "RÃ©servÃ© au super-administrateur" });
  next();
}

// â”€â”€â”€ GET /admin/me â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get("/admin/me", requireAdmin, async (req: any, res) => {
  return res.json({ email: req.adminEmail, role: req.adminRole });
});

// â”€â”€â”€ GET /admin/stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ GET /admin/orders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt((req.query as any).limit ?? "50", 10) || 50, 1),
      200
    );

    const offset = Math.max(
      parseInt((req.query as any).offset ?? "0", 10) || 0,
      0
    );

    const status = (req.query as any).status as string | undefined;

    const rows = status
      ? await db
          .select()
          .from(kdoOrdersTable)
          .where(eq(kdoOrdersTable.status, status))
          .orderBy(desc(kdoOrdersTable.createdAt))
          .limit(limit)
          .offset(offset)
      : await db
          .select()
          .from(kdoOrdersTable)
          .orderBy(desc(kdoOrdersTable.createdAt))
          .limit(limit)
          .offset(offset);

    const orders = rows.map((r) => ({
      id: r.id,
      ref: r.ref,
      userPhone: r.userPhone,
      grandTotal: r.grandTotal,
      city: r.city,
      status: r.status,
      statusMessage: r.statusMessage,
      createdAt: r.createdAt,
      data: r.data,
    }));

    return res.json({ orders });
  } catch (e: any) {
    console.error("[admin/orders] erreur:", e);
    return res.status(500).json({
      error: e?.message || "Erreur serveur lors du chargement des commandes",
    });
  }
});

// â”€â”€â”€ PUT /admin/orders/:ref/status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.put("/admin/orders/:ref/status", requireAdmin, async (req: any, res) => {
  const { ref } = req.params;
  const { status, statusMessage } = req.body as {
    status?: string; statusMessage?: string;
  };

  const VALID = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!status || !VALID.includes(status)) {
    return res.status(400).json({ error: `status doit Ãªtre: ${VALID.join(", ")}` });
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

    // Notifier l'utilisateur par email si statut changÃ©
    const orderData = updated.data as any;
    const userEmail = orderData?.userEmail?.trim();
    if (userEmail) {
      const labelMap: Record<string, string> = {
        confirmed:  "âœ… Commande confirmÃ©e",
        shipped:    "ðŸšš Commande en livraison",
        delivered:  "ðŸŽ‰ Commande livrÃ©e",
        cancelled:  "âŒ Commande annulÃ©e",
        pending:    "â³ Commande en attente",
      };
      const label = labelMap[status] ?? status;
      const msgHtml = statusMessage
        ? `<p style="margin:0 0 10px;font-size:15px;color:#444;line-height:1.6;">${statusMessage}</p>`
        : "";
      sendEmail({
        to:      userEmail,
        subject: `${label} â€” RÃ©f. ${ref} â€” KDO Cameroun`,
        html:    `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#F5F7FA;padding:30px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.09);">
                <tr><td style="background:linear-gradient(135deg,#0066CC,#1A8FE3);padding:28px 32px;text-align:center;">
                  <h1 style="margin:0;color:#fff;font-size:22px;">${label}</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,.9);font-size:14px;">RÃ©fÃ©rence : <strong>${ref}</strong></p>
                </td></tr>
                <tr><td style="padding:28px 32px;">
                  <p style="margin:0 0 10px;font-size:16px;color:#1A1A1A;font-weight:600;">Bonjour ${orderData?.delivery?.fullName || "cher client"} ðŸ‘‹</p>
                  ${msgHtml}
                  <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">
                    Pour toute question, notre Ã©quipe reste disponible via WhatsApp ou sur notre site :
                    <a href="https://chezkdo.com" style="color:#FF6B00;font-weight:700;">chezkdo.com</a>
                  </p>
                </td></tr>
                <tr><td style="background:#111;padding:16px 32px;text-align:center;">
                  <p style="margin:0 0 4px;color:rgba(255,255,255,.5);font-size:11px;">
                    PropulsÃ© par <a href="https://socialboosthorizon.com" style="color:rgba(255,255,255,.7);text-decoration:none;font-weight:600;">Social Boost Horizon</a>
                    &nbsp;Â·&nbsp;<em>votre visibilitÃ© notre horizon</em>
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

// â”€â”€â”€ GET /admin/users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ GET /admin/admins â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get("/admin/admins", requireAdmin, requireSuper, async (_req, res) => {
  try {
    const rows = await db.select().from(kdoAdminsTable).orderBy(kdoAdminsTable.createdAt);
    return res.json({
      admins: [
        { id: "super", email: SUPER_ADMIN_EMAIL, name: "Super Admin (propriÃ©taire)", role: "super", permissions: null, addedBy: null },
        ...rows,
      ],
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// â”€â”€â”€ POST /admin/admins â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post("/admin/admins", requireAdmin, requireSuper, async (req: any, res) => {
  const { email, name, role, permissions } = req.body as {
    email?: string; name?: string; role?: string; permissions?: object;
  };
  if (!email?.trim()) return res.status(400).json({ error: "email requis" });
  if (email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(409).json({ error: "Cet email est dÃ©jÃ  super-administrateur" });
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

    if (!inserted) return res.status(409).json({ error: "Cet email est dÃ©jÃ  administrateur" });
    return res.status(201).json({ admin: inserted });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// â”€â”€â”€ DELETE /admin/admins/:email â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Unavailable products (existing logic kept) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface UnavailableEntry {
  productId: string;
  city: string;
}

let unavailableTableReady: Promise<void> | null = null;

function ensureUnavailableTable(): Promise<void> {
  if (!unavailableTableReady) {
    unavailableTableReady = db.execute(sql`
      CREATE TABLE IF NOT EXISTS kdo_unavailable_products (
        product_id text NOT NULL,
        city text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (product_id, city)
      )
    `)
      .then(() => undefined)
      .catch((error) => {
        unavailableTableReady = null;
        throw error;
      });
  }

  return unavailableTableReady;
}

async function loadUnavailable(): Promise<UnavailableEntry[]> {
  await ensureUnavailableTable();

  const result = await db.execute(sql`
    SELECT
      product_id AS "productId",
      city
    FROM kdo_unavailable_products
    ORDER BY created_at ASC
  `);

  return result.rows.map((row: any) => ({
    productId: String(row.productId),
    city: String(row.city),
  }));
}

router.get("/admin/unavailable", async (_req, res) => {
  try {
    const unavailable = await loadUnavailable();
    return res.json({ unavailable });
  } catch (e: any) {
    console.error("[admin/unavailable] GET erreur:", e);
    return res.status(500).json({
      error: e?.message || "Erreur lors du chargement des indisponibilitÃ©s",
    });
  }
});

router.post("/admin/mark-unavailable", async (req, res) => {
  try {
    const {
      productId,
      city,
      adminEmail,
    } = req.body as {
      productId?: string;
      city?: string;
      adminEmail?: string;
    };

    if (!productId) {
      return res.status(400).json({ error: "productId requis" });
    }

    if (!city) {
      return res.status(400).json({ error: "city requis" });
    }

    if (!adminEmail || !LEGACY_ADMIN.includes(adminEmail)) {
      return res.status(403).json({
        error: "AccÃ¨s rÃ©servÃ© aux administrateurs KDO",
      });
    }

    await ensureUnavailableTable();

    await db.execute(sql`
      INSERT INTO kdo_unavailable_products (product_id, city)
      VALUES (${productId}, ${city})
      ON CONFLICT (product_id, city) DO NOTHING
    `);

    const unavailable = await loadUnavailable();

    return res.json({
      ok: true,
      unavailable,
    });
  } catch (e: any) {
    console.error("[admin/mark-unavailable] POST erreur:", e);
    return res.status(500).json({
      error: e?.message || "Erreur lors de l'enregistrement",
    });
  }
});

router.delete("/admin/mark-unavailable/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      adminEmail,
      city,
    } = req.body as {
      adminEmail?: string;
      city?: string;
    };

    if (!adminEmail || !LEGACY_ADMIN.includes(adminEmail)) {
      return res.status(403).json({
        error: "AccÃ¨s rÃ©servÃ© aux administrateurs KDO",
      });
    }

    await ensureUnavailableTable();

    if (city) {
      await db.execute(sql`
        DELETE FROM kdo_unavailable_products
        WHERE product_id = ${productId}
          AND city = ${city}
      `);
    } else {
      await db.execute(sql`
        DELETE FROM kdo_unavailable_products
        WHERE product_id = ${productId}
      `);
    }

    const unavailable = await loadUnavailable();

    return res.json({
      ok: true,
      unavailable,
    });
  } catch (e: any) {
    console.error("[admin/mark-unavailable] DELETE erreur:", e);
    return res.status(500).json({
      error: e?.message || "Erreur lors de la suppression",
    });
  }
});

export default router;
