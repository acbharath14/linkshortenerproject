import "dotenv/config";
import { db } from "../db";
import { shortenedUrls } from "../db/schema";

const userId = "user_39MbqXOhjJPvByED4e3yb9kK4Rc";

const links = [
  {
    id: "url_0001",
    shortCode: "a1b2c3d4e5f6",
    originalUrl: "https://example.com/docs/getting-started",
    userId,
    customAlias: "docs-start",
    description: "Getting started docs",
    clicks: 12,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-01T10:15:00.000Z"),
    updatedAt: new Date("2026-02-01T10:15:00.000Z"),
  },
  {
    id: "url_0002",
    shortCode: "k9m8n7p6q5r4",
    originalUrl: "https://example.com/blog/launch",
    userId,
    customAlias: "launch-blog",
    description: "Product launch blog",
    clicks: 34,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-01T11:00:00.000Z"),
    updatedAt: new Date("2026-02-01T11:05:00.000Z"),
  },
  {
    id: "url_0003",
    shortCode: "x7y6z5a4b3c2",
    originalUrl: "https://example.com/pricing",
    userId,
    customAlias: "pricing",
    description: "Pricing page",
    clicks: 8,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-02T09:20:00.000Z"),
    updatedAt: new Date("2026-02-02T09:20:00.000Z"),
  },
  {
    id: "url_0004",
    shortCode: "d4e5f6g7h8i9",
    originalUrl: "https://example.com/changelog",
    userId,
    customAlias: "changelog",
    description: "Product changelog",
    clicks: 21,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-02T14:10:00.000Z"),
    updatedAt: new Date("2026-02-02T14:12:00.000Z"),
  },
  {
    id: "url_0005",
    shortCode: "m1n2b3v4c5x6",
    originalUrl: "https://example.com/careers",
    userId,
    customAlias: "jobs",
    description: "Careers page",
    clicks: 5,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-03T08:30:00.000Z"),
    updatedAt: new Date("2026-02-03T08:30:00.000Z"),
  },
  {
    id: "url_0006",
    shortCode: "p0o9i8u7y6t5",
    originalUrl: "https://example.com/support",
    userId,
    customAlias: "help",
    description: "Support center",
    clicks: 17,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-03T16:45:00.000Z"),
    updatedAt: new Date("2026-02-03T16:45:00.000Z"),
  },
  {
    id: "url_0007",
    shortCode: "q1w2e3r4t5y6",
    originalUrl: "https://example.com/docs/api",
    userId,
    customAlias: "api-docs",
    description: "API documentation",
    clicks: 44,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-04T09:10:00.000Z"),
    updatedAt: new Date("2026-02-04T09:10:00.000Z"),
  },
  {
    id: "url_0008",
    shortCode: "z9x8c7v6b5n4",
    originalUrl: "https://example.com/roadmap",
    userId,
    customAlias: "roadmap",
    description: "Product roadmap",
    clicks: 9,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-04T12:00:00.000Z"),
    updatedAt: new Date("2026-02-04T12:00:00.000Z"),
  },
  {
    id: "url_0009",
    shortCode: "l6k5j4h3g2f1",
    originalUrl: "https://example.com/newsletter",
    userId,
    customAlias: "newsletter",
    description: "Newsletter signup",
    clicks: 3,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-05T07:55:00.000Z"),
    updatedAt: new Date("2026-02-05T07:55:00.000Z"),
  },
  {
    id: "url_0010",
    shortCode: "u7y6t5r4e3w2",
    originalUrl: "https://example.com/contact",
    userId,
    customAlias: "contact",
    description: "Contact page",
    clicks: 6,
    isActive: true,
    expiresAt: null,
    createdAt: new Date("2026-02-05T18:20:00.000Z"),
    updatedAt: new Date("2026-02-05T18:20:00.000Z"),
  },
];

async function main() {
  await db.insert(shortenedUrls).values(links).onConflictDoNothing();
}

main()
  .then(() => {
    console.log("Inserted example links.");
  })
  .catch((error) => {
    console.error("Failed to insert example links:", error);
    process.exitCode = 1;
  });
