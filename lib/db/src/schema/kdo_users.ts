import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kdoUsersTable = pgTable("kdo_users", {
  id:        text("id").primaryKey(),
  phone:     text("phone").unique().notNull(),
  name:      text("name").notNull(),
  email:     text("email"),
  whatsapp:  text("whatsapp"),
  photoUrl:  text("photo_url"),
  token:     text("token").unique().notNull(),
  points:    integer("points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertKdoUserSchema = createInsertSchema(kdoUsersTable).omit({ createdAt: true, updatedAt: true });
export type InsertKdoUser = z.infer<typeof insertKdoUserSchema>;
export type KdoUser = typeof kdoUsersTable.$inferSelect;
