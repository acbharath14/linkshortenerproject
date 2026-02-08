import { pgTable, text, varchar, integer, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Shortened URLs table
export const shortenedUrls = pgTable(
  "shortened_urls",
  {
    id: text("id").primaryKey(),
    shortCode: varchar("short_code", { length: 12 }).notNull().unique(),
    originalUrl: text("original_url").notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID
    customAlias: varchar("custom_alias", { length: 50 }).unique(),
    description: text("description"),
    clicks: integer("clicks").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_user_id").on(table.userId),
    shortCodeIdx: index("idx_short_code").on(table.shortCode),
    customAliasIdx: index("idx_custom_alias").on(table.customAlias),
    createdAtIdx: index("idx_created_at").on(table.createdAt),
  })
);

// Click analytics table (optional - for detailed analytics)
export const clickAnalytics = pgTable(
  "click_analytics",
  {
    id: text("id").primaryKey(),
    shortenedUrlId: text("shortened_url_id").notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 45 }),
    referer: text("referer"),
    country: varchar("country", { length: 2 }),
    clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  },
  (table) => ({
    urlIdIdx: index("idx_url_id").on(table.shortenedUrlId),
    clickedAtIdx: index("idx_clicked_at").on(table.clickedAt),
  })
);

// Relations
export const shortenedUrlsRelations = relations(shortenedUrls, ({ many }) => ({
  analytics: many(clickAnalytics),
}));

export const clickAnalyticsRelations = relations(clickAnalytics, ({ one }) => ({
  shortenedUrl: one(shortenedUrls, {
    fields: [clickAnalytics.shortenedUrlId],
    references: [shortenedUrls.id],
  }),
}));

// Types
export type ShortenedUrl = typeof shortenedUrls.$inferSelect;
export type NewShortenedUrl = typeof shortenedUrls.$inferInsert;
export type ClickAnalytic = typeof clickAnalytics.$inferSelect;
export type NewClickAnalytic = typeof clickAnalytics.$inferInsert;
