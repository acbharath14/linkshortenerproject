import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, incrementClicks } from "@/data/links-db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Find the shortened URL using helper
    const url = await getLinkByCode(shortCode);

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
    await incrementClicks(shortCode);

    // Return the original URL (client will handle redirect or return as data)
    return NextResponse.json(
      {
        success: true,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Redirect API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
