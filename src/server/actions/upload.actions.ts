"use server";

import { requireAdmin } from "@/lib/auth/current-user";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  isCloudinaryConfigured,
} from "@/lib/cloudinary/cloudinary";

export type UploadImageResult =
  | { success: true; url: string; publicId: string }
  | { success: false; message: string };

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Accepts a base64 data URL from the browser (read via FileReader on the
 * client) and uploads it to Cloudinary. Used by every admin image field:
 * product thumbnail/gallery, banner image, store logo.
 */
export async function uploadImageAction(
  dataUrl: string,
  folder: "products" | "banners" | "branding" | "categories",
): Promise<UploadImageResult> {
  await requireAdmin();

  if (!isCloudinaryConfigured()) {
    return {
      success: false,
      message:
        "Image uploads aren't configured yet. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment.",
    };
  }

  if (!dataUrl.startsWith("data:image/")) {
    return { success: false, message: "Please choose an image file." };
  }

  // Rough size check on the base64 payload (base64 is ~33% larger than raw bytes).
  const approxBytes = (dataUrl.length * 3) / 4;
  if (approxBytes > MAX_UPLOAD_BYTES) {
    return { success: false, message: "Image is too large — please use a file under 8MB." };
  }

  try {
    const result = await uploadImageToCloudinary(dataUrl, folder);
    return { success: true, url: result.url, publicId: result.publicId };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return { success: false, message: "Upload failed. Please try again." };
  }
}

export async function deleteCloudinaryImageAction(publicId: string) {
  await requireAdmin();
  await deleteImageFromCloudinary(publicId);
  return { success: true } as const;
}
