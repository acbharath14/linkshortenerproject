import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, incrementClicks } from "@/data/links-db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  try {
    const { shortcode } = await params;
    const normalizedShortCode = shortcode.toLowerCase();
    console.log(`[REDIRECT] Processing shortcode: ${normalizedShortCode}`);

    // Find the shortened URL using helper
    const url = await getLinkByCode(normalizedShortCode);
    console.log(`[REDIRECT] Found URL:`, url);

    if (!url) {
      return NextResponse.json(
        { error: "Shortened URL not found" },
        { status: 404 }
      );
    }

    // Check if URL is active
    if (!url.isActive) {
      return NextResponse.json(
        { error: "This link has been disabled" },
        { status: 410 }
      );
    }

    // Check if URL has expired
    if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 }
      );
    }

    // Increment click count using helper
    console.log(`[REDIRECT] Incrementing clicks for: ${normalizedShortCode}`);
    const clickIncremented = await incrementClicks(normalizedShortCode);
    if (!clickIncremented) {
      console.warn(`[REDIRECT] Failed to increment clicks - shortCode might not exist: ${normalizedShortCode}`);
    } else {
      console.log(`[REDIRECT] Clicks incremented successfully`);
    }

    // Validate URL protocol before redirecting
    try {
      const urlToRedirect = new URL(url.originalUrl);
      if (urlToRedirect.protocol !== 'http:' && urlToRedirect.protocol !== 'https:') {
        return NextResponse.json(
          { error: "Invalid redirect URL" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid redirect URL" },
        { status: 400 }
      );
    }

    // Redirect to the original URL with 307 (temporary) to prevent browser caching
    // This ensures each click hits our server so we can track the count
    return NextResponse.redirect(url.originalUrl, { status: 307 });
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
