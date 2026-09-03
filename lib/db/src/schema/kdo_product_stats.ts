import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const kdoProductStatsTable = pgTable("kdo_product_stats", {
  productId:  text("product_id").primaryKey(),
  orderCount: integer("order_count").notNull().default(0),
  updatedAt:  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
