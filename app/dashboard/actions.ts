"use server";

import { auth } from "@clerk/nextjs/server";
import { deactivateLinkById } from "@/data/links-db";
import { z } from "zod";

const DeleteLinkSchema = z.object({
  id: z.string().min(1, "Link ID is required"),
});

export type DeleteLinkResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function deleteLinkAction(
  id: string
): Promise<DeleteLinkResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized - please log in",
      };
    }

    // Validate input
    const validatedData = DeleteLinkSchema.parse({ id });

    // Deactivate the link
    await deactivateLinkById(validatedData.id, userId);

    return {
      success: true,
      message: "Link deleted successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid link ID",
      };
    }

    console.error("Delete link action error:", error);
    return {
      success: false,
      error: "Failed to delete link",
    };
  }
}
