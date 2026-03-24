"use server";

import { uploadFromBase64, deleteFile, type BucketName } from "@/lib/supabase/storage";

// ============================================================================
// UPLOAD EVENT IMAGE
// ============================================================================

export async function uploadEventImage(
  base64Data: string,
  filename: string,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const result = await uploadFromBase64(
      "event-images",
      base64Data,
      filename,
      contentType,
      "events" // folder
    );

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, url: result.url };
  } catch (error) {
    console.error("Error uploading event image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

// ============================================================================
// UPLOAD CLIENT LOGO
// ============================================================================

export async function uploadClientLogo(
  base64Data: string,
  filename: string,
  contentType: string,
  clientId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const result = await uploadFromBase64(
      "client-assets",
      base64Data,
      filename,
      contentType,
      `logos/${clientId}`
    );

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, url: result.url };
  } catch (error) {
    console.error("Error uploading client logo:", error);
    return { success: false, error: "Failed to upload logo" };
  }
}

// ============================================================================
// UPLOAD DOCUMENT
// ============================================================================

export async function uploadDocument(
  base64Data: string,
  filename: string,
  contentType: string,
  folder: string // e.g., "proposals", "contracts", "certificates"
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  try {
    const result = await uploadFromBase64(
      "documents",
      base64Data,
      filename,
      contentType,
      folder
    );

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, url: result.url, path: result.path };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { success: false, error: "Failed to upload document" };
  }
}

// ============================================================================
// DELETE FILE
// ============================================================================

export async function deleteUploadedFile(
  bucket: BucketName,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await deleteFile(bucket, path);
    return result;
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
}
