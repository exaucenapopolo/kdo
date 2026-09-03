import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const kdoCountersTable = pgTable("kdo_counters", {
  key:   text("key").primaryKey(),
  value: integer("value").notNull().default(0),
});
