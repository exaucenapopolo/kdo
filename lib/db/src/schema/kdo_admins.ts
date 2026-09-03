import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const kdoAdminsTable = pgTable("kdo_admins", {
  id:          text("id").primaryKey(),
  email:       text("email").unique().notNull(),
  name:        text("name").notNull().default("Administrateur"),
  role:        text("role").notNull().default("manager"), // "super" | "manager" | "viewer"
  permissions: jsonb("permissions"), // { canUpdateOrders, canViewUsers, canManageAdmins, canManageProducts }
  addedBy:     text("added_by"),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type KdoAdmin = typeof kdoAdminsTable.$inferSelect;
