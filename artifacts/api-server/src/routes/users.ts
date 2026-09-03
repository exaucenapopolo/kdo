import { Router } from "express";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { db, kdoUsersTable, kdoOrdersTable, kdoAddressesTable, kdoCountersTable, kdoProductStatsTable } from "@workspace/db";
import { buildWelcomeEmail, sendEmail } from "../email";

const router = Router();

// ── Auth helper ───────────────────────────────────────────────────────────────
async function getUserByToken(token: string) {
  if (!token) return null;
  const rows = await db.select().from(kdoUsersTable).where(eq(kdoUsersTable.token, token)).limit(1);
  return rows[0] ?? null;
}

function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization as string | undefined;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Token requis" });
  req.userToken = header.slice(7);
  next();
}

function safeUser(u: typeof kdoUsersTable.$inferSelect) {
  const { token, ...rest } = u;
  return { ...rest, photoURL: rest.photoUrl };
}

// ─── POST /users/sync ─────────────────────────────────────────────────────────
// Upsert user by phone. Returns {user, token}. Creates user if not exists.
router.post("/users/sync", async (req, res) => {
  const { phone, name, email, whatsapp, photoUrl } = req.body as {
    phone?: string; name?: string; email?: string; whatsapp?: string; photoUrl?: string;
  };
  if (!phone?.trim()) return res.status(400).json({ error: "phone requis" });

  try {
    const existing = await db.select().from(kdoUsersTable)
      .where(eq(kdoUsersTable.phone, phone.trim())).limit(1);

    if (existing.length > 0) {
      const patch: Record<string, any> = {};
      if (name?.trim())           patch.name     = name.trim();
      if (email !== undefined)    patch.email    = email?.trim() || null;
      if (whatsapp !== undefined) patch.whatsapp = whatsapp?.trim() || null;
      if (photoUrl !== undefined) patch.photoUrl = photoUrl || null;

      let updated = existing[0];
      if (Object.keys(patch).length > 0) {
        const [u] = await db.update(kdoUsersTable).set(patch)
          .where(eq(kdoUsersTable.phone, phone.trim())).returning();
        updated = u;
      }
      return res.json({ user: safeUser(updated), token: updated.token });
    }

    const [created] = await db.insert(kdoUsersTable).values({
      id:       randomUUID(),
      phone:    phone.trim(),
      name:     (name ?? "Client KDO").trim(),
      email:    email?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      photoUrl: photoUrl || null,
      token:    randomUUID(),
      points:   0,
    }).returning();

    // Email de bienvenue si l'utilisateur a fourni une adresse email
    if (created.email) {
      sendEmail({
        to:      created.email,
        subject: "🎉 Bienvenue chez KDO Cameroun !",
        html:    buildWelcomeEmail(created.name, created.phone),
      }).catch(() => {});
    }

    return res.status(201).json({ user: safeUser(created), token: created.token });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /users/me ────────────────────────────────────────────────────────────
router.get("/users/me", authMiddleware, async (req: any, res) => {
  try {
    const user = await getUserByToken(req.userToken);
    if (!user) return res.status(401).json({ error: "Token invalide" });
    return res.json({ user: safeUser(user) });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── PUT /users/me ────────────────────────────────────────────────────────────
router.put("/users/me", authMiddleware, async (req: any, res) => {
  try {
    const user = await getUserByToken(req.userToken);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const { name, phone, email, whatsapp, photoUrl } = req.body;
    const patch: Record<string, any> = {};
    if (name !== undefined)     patch.name     = name?.trim() || user.name;
    if (phone !== undefined)    patch.phone    = phone?.trim() || user.phone;
    if (email !== undefined)    patch.email    = email?.trim() || null;
    if (whatsapp !== undefined) patch.whatsapp = whatsapp?.trim() || null;
    if (photoUrl !== undefined) patch.photoUrl = photoUrl || null;

    const [updated] = await db.update(kdoUsersTable).set(patch)
      .where(eq(kdoUsersTable.id, user.id)).returning();
    return res.json({ user: safeUser(updated) });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /users/next-ref ──────────────────────────────────────────────────────
router.get("/users/next-ref", authMiddleware, async (req: any, res) => {
  try {
    const key = "order_ref";
    const rows = await db.select().from(kdoCountersTable).where(eq(kdoCountersTable.key, key)).limit(1);
    const next = (rows[0]?.value ?? 0) + 1;
    return res.json({ ref: `KDO-${String(next).padStart(4, "0")}` });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── POST /users/orders ───────────────────────────────────────────────────────
router.post("/users/orders", authMiddleware, async (req: any, res) => {
  try {
    const user = await getUserByToken(req.userToken);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const { order } = req.body as { order?: any };
    if (!order) return res.status(400).json({ error: "order requis" });

    // Atomic increment via INSERT … ON CONFLICT DO UPDATE
    const key = "order_ref";
    await db.insert(kdoCountersTable).values({ key, value: 1 })
      .onConflictDoUpdate({
        target: kdoCountersTable.key,
        set: { value: sql`${kdoCountersTable.value} + 1` },
      });
    const [counter] = await db.select().from(kdoCountersTable).where(eq(kdoCountersTable.key, key)).limit(1);
    const ref = `KDO-${String(counter.value).padStart(4, "0")}`;

    const grandTotal   = Math.round(order.grandTotal ?? 0);
    const earnedPoints = Math.floor(grandTotal / 2000); // 2 000 FCFA = 1 point
    const orderWithRef = { ...order, ref, points: earnedPoints, status: "pending" };

    await db.insert(kdoOrdersTable).values({
      ref,
      userPhone:  user.phone,
      data:       orderWithRef,
      grandTotal,
      city:       order.delivery?.city ?? null,
      status:     "pending",
    });

    // Mise à jour des points utilisateur
    const newPoints = user.points + earnedPoints;
    if (earnedPoints > 0) {
      await db.update(kdoUsersTable)
        .set({ points: newPoints })
        .where(eq(kdoUsersTable.id, user.id));
    }

    // Incrément des stats de commande par produit
    const productItems = (order.items ?? []) as Array<{ id: string; quantity?: number }>;
    for (const item of productItems) {
      if (!item.id) continue;
      await db.insert(kdoProductStatsTable)
        .values({ productId: String(item.id), orderCount: 1 })
        .onConflictDoUpdate({
          target: kdoProductStatsTable.productId,
          set:    { orderCount: sql`${kdoProductStatsTable.orderCount} + 1` },
        });
    }

    return res.status(201).json({ ok: true, ref, order: orderWithRef, points: newPoints });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /users/orders ────────────────────────────────────────────────────────
router.get("/users/orders", authMiddleware, async (req: any, res) => {
  try {
    const user = await getUserByToken(req.userToken);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const rows = await db.select().from(kdoOrdersTable)
      .where(eq(kdoOrdersTable.userPhone, user.phone))
      .orderBy(kdoOrdersTable.createdAt);
    // Merge DB status into JSONB data so the client always sees the latest status
    const orders = rows.map(r => ({
      ...(r.data as object ?? {}),
      status:        r.status,
      statusMessage: r.statusMessage ?? undefined,
    })).reverse();
    return res.json({ orders, points: user.points });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── POST /users/addresses ────────────────────────────────────────────────────
router.post("/users/addresses", authMiddleware, async (req: any, res) => {
  try {
    const user = await getUserByToken(req.userToken);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const addr = req.body as {
      id?: string; label?: string; fullName: string; phone: string;
      city: string; quartier?: string; address: string;
      deliveryMode?: string; instructions?: string;
    };
    if (!addr.fullName || !addr.city) return res.status(400).json({ error: "fullName et city requis" });

    const [inserted] = await db.insert(kdoAddressesTable).values({
      id:           addr.id ?? randomUUID(),
      userPhone:    user.phone,
      label:        addr.label ?? null,
      fullName:     addr.fullName,
      phone:        addr.phone,
      city:         addr.city,
      quartier:     addr.quartier ?? null,
      address:      addr.address,
      deliveryMode: addr.deliveryMode ?? null,
      instructions: addr.instructions ?? null,
    }).onConflictDoNothing().returning();

    return res.status(201).json({ address: inserted });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /users/addresses ─────────────────────────────────────────────────────
router.get("/users/addresses", authMiddleware, async (req: any, res) => {
  try {
    const user = await getUserByToken(req.userToken);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const rows = await db.select().from(kdoAddressesTable)
      .where(eq(kdoAddressesTable.userPhone, user.phone))
      .orderBy(kdoAddressesTable.createdAt);
    return res.json({ addresses: rows });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── DELETE /users/addresses/:id ─────────────────────────────────────────────
router.delete("/users/addresses/:id", authMiddleware, async (req: any, res) => {
  try {
    const user = await getUserByToken(req.userToken);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    await db.delete(kdoAddressesTable)
      .where(eq(kdoAddressesTable.id, req.params.id));
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
