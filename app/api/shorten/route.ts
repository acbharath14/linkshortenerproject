import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserLinks, createLink, checkCustomAliasExists, checkShortCodeExists } from "@/data/links-db";
import { z } from 'zod';
import { rateLimiter } from "@/lib/rate-limit";

const CreateLinkSchema = z.object({
  originalUrl: z.string().url("Invalid URL format"),
  customAlias: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/, "Custom alias can only contain letters, numbers, hyphens, and underscores")
    .min(3, "Custom alias must be at least 3 characters")
    .max(30, "Custom alias must be at most 30 characters")
    .optional(),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  expiresAt: z.string().datetime().optional(),
});

// Generate a random short code
function generateShortCode(length: number = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate URL format and protocol
// Note: In production, consider enforcing HTTPS-only URLs for enhanced security
// by modifying this function to return false for http:// URLs
function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get("x-forwarded-for") ?? 
                request.headers.get("x-real-ip") ?? 
                "127.0.0.1";
    const { success } = await rateLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    const validation = CreateLinkSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const { originalUrl, customAlias, description, expiresAt } = validation.data;

    // Normalize custom alias to lowercase for consistency
    const normalizedAlias = customAlias?.toLowerCase();

    // Check if custom alias already exists
    if (normalizedAlias) {
      const aliasExists = await checkCustomAliasExists(normalizedAlias);

      if (aliasExists) {
        return NextResponse.json(
          { error: "Custom alias already in use" },
          { status: 409 }
        );
      }
    }

    // Generate short code
    let shortCode = (normalizedAlias || generateShortCode()).toLowerCase();

    // Ensure short code is unique if randomly generated
    if (!normalizedAlias) {
      let codeExists = true;
      while (codeExists) {
        codeExists = await checkShortCodeExists(shortCode);

        if (codeExists) {
          shortCode = generateShortCode().toLowerCase();
        }
      }
    }

    // Create the shortened URL record using helper
    const newUrl = await createLink(
      userId,
      originalUrl,
      shortCode,
      normalizedAlias,
      description
    );

    return NextResponse.json(
      {
        success: true,
        data: newUrl,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/l/${shortCode}`,
      },
      { status: 201 }
    );
  } catch (error) {
    // Log detailed error server-side only
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all URLs for the current user using helper
    const urls = await getUserLinks(userId);

    return NextResponse.json({ success: true, data: urls }, { status: 200 });
  } catch (error) {
    // Log detailed error server-side only
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
