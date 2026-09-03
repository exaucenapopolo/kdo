import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kdoAddressesTable = pgTable("kdo_addresses", {
  id:           text("id").primaryKey(),
  userPhone:    text("user_phone").notNull(),
  label:        text("label"),
  fullName:     text("full_name").notNull(),
  phone:        text("phone").notNull(),
  city:         text("city").notNull(),
  quartier:     text("quartier"),
  address:      text("address").notNull(),
  deliveryMode: text("delivery_mode"),
  instructions: text("instructions"),
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertKdoAddressSchema = createInsertSchema(kdoAddressesTable).omit({ createdAt: true });
export type InsertKdoAddress = z.infer<typeof insertKdoAddressSchema>;
export type KdoAddress = typeof kdoAddressesTable.$inferSelect;
