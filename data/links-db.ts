import { db } from "@/db";
import { shortenedUrls } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export type ShortenedUrl = {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  customAlias: string | null;
  description: string | null;
  clicks: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getUserLinks(userId: string): Promise<ShortenedUrl[]> {
  const links = await db
    .select()
    .from(shortenedUrls)
    .where(and(eq(shortenedUrls.userId, userId), eq(shortenedUrls.isActive, true)));

  return links as ShortenedUrl[];
}

export async function createLink(
  userId: string,
  originalUrl: string,
  shortCode: string,
  customAlias?: string,
  description?: string
): Promise<ShortenedUrl> {
  const [link] = await db
    .insert(shortenedUrls)
    .values({
      id: nanoid(),
      userId,
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      description: description || null,
      clicks: 0,
      isActive: true,
    })
    .returning();

  return link as ShortenedUrl;
}

export async function getLinkByCode(shortCode: string): Promise<ShortenedUrl | null> {
  const [link] = await db
    .select()
    .from(shortenedUrls)
    .where(eq(shortenedUrls.shortCode, shortCode.toLowerCase()))
    .limit(1);

  return (link as ShortenedUrl) || null;
}

export async function getLinkById(id: string): Promise<ShortenedUrl | null> {
  const [link] = await db
    .select()
    .from(shortenedUrls)
    .where(eq(shortenedUrls.id, id))
    .limit(1);

  return (link as ShortenedUrl) || null;
}

export async function getLinkByIdAndUserId(id: string, userId: string): Promise<ShortenedUrl | null> {
  const [link] = await db
    .select()
    .from(shortenedUrls)
    .where(and(eq(shortenedUrls.id, id), eq(shortenedUrls.userId, userId)))
    .limit(1);

  return (link as ShortenedUrl) || null;
}

export async function incrementClicks(shortCode: string): Promise<boolean> {
  console.log(`[DB] Incrementing clicks for shortCode: ${shortCode}`);
  const result = await db
    .update(shortenedUrls)
    .set({ clicks: sql`${shortenedUrls.clicks} + 1` })
    .where(eq(shortenedUrls.shortCode, shortCode.toLowerCase()));
  console.log(`[DB] Update result:`, result);
  const success = result.rowsAffected > 0;
  console.log(`[DB] Rows affected: ${result.rowsAffected}, Success: ${success}`);
  return success;
}

export async function deleteLinkById(id: string, userId: string): Promise<void> {
  await db
    .delete(shortenedUrls)
    .where(and(eq(shortenedUrls.id, id), eq(shortenedUrls.userId, userId)));
}

export async function deactivateLinkById(id: string, userId: string): Promise<boolean> {
  const result = await db
    .update(shortenedUrls)
    .set({ isActive: false })
    .where(and(eq(shortenedUrls.id, id), eq(shortenedUrls.userId, userId)));

  return result.rowsAffected > 0;
}

export async function checkCustomAliasExists(customAlias: string): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(shortenedUrls)
    .where(eq(shortenedUrls.customAlias, customAlias.toLowerCase()))
    .limit(1);

  return !!existing;
}

export async function checkShortCodeExists(shortCode: string): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(shortenedUrls)
    .where(eq(shortenedUrls.shortCode, shortCode.toLowerCase()))
    .limit(1);

  return !!existing;
}
