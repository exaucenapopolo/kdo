import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kdoOrdersTable = pgTable("kdo_orders", {
  id:            serial("id").primaryKey(),
  ref:           text("ref").unique().notNull(),
  userPhone:     text("user_phone").notNull(),
  data:          jsonb("data").notNull(),
  grandTotal:    integer("grand_total").notNull(),
  city:          text("city"),
  status:        text("status").notNull().default("pending"),
  statusMessage: text("status_message"),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertKdoOrderSchema = createInsertSchema(kdoOrdersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertKdoOrder = z.infer<typeof insertKdoOrderSchema>;
export type KdoOrder = typeof kdoOrdersTable.$inferSelect;
