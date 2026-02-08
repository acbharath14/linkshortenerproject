import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLinkById, getLinkByIdAndUserId, deactivateLinkById } from "@/data/links-db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the URL to verify ownership
    const url = await getLinkById(id);

    if (!url) {
      return NextResponse.json(
        { error: "Shortened URL not found" },
        { status: 404 }
      );
    }

    // Verify the URL belongs to the current user
    if (url.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden - this URL does not belong to you" },
        { status: 403 }
      );
    }

    // Soft delete by marking as inactive using helper
    await deactivateLinkById(id, userId);

    return NextResponse.json(
      { success: true, message: "URL deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the specific URL using helper with ownership check
    const url = await getLinkByIdAndUserId(id, userId);

    if (!url) {
      return NextResponse.json(
        { error: "Shortened URL not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get URL details API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
