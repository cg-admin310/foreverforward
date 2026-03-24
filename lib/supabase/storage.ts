"use server";

import { createAdminClient } from "./admin";
import { v4 as uuidv4 } from "uuid";

// ============================================================================
// TYPES
// ============================================================================

export type BucketName = "event-images" | "documents" | "client-assets" | "participant-files";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

// ============================================================================
// UPLOAD FILE
// ============================================================================

export async function uploadFile(
  bucket: BucketName,
  file: File,
  folder?: string
): Promise<UploadResult> {
  try {
    const adminClient = createAdminClient();

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const uniqueName = `${uuidv4()}.${ext}`;
    const path = folder ? `${folder}/${uniqueName}` : uniqueName;

    // Convert File to ArrayBuffer for server-side upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await adminClient.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL for public buckets
    const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(path);

    return {
      success: true,
      url: urlData.publicUrl,
      path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

// ============================================================================
// UPLOAD FROM BASE64
// ============================================================================

export async function uploadFromBase64(
  bucket: BucketName,
  base64Data: string,
  filename: string,
  contentType: string,
  folder?: string
): Promise<UploadResult> {
  try {
    const adminClient = createAdminClient();

    // Generate unique filename
    const ext = filename.split(".").pop()?.toLowerCase() || "bin";
    const uniqueName = `${uuidv4()}.${ext}`;
    const path = folder ? `${folder}/${uniqueName}` : uniqueName;

    // Convert base64 to buffer
    const base64Content = base64Data.includes(",")
      ? base64Data.split(",")[1]
      : base64Data;
    const buffer = Buffer.from(base64Content, "base64");

    const { error } = await adminClient.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(path);

    return {
      success: true,
      url: urlData.publicUrl,
      path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

// ============================================================================
// DELETE FILE
// ============================================================================

export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();

    const { error } = await adminClient.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Storage delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Failed to delete file" };
  }
}

// ============================================================================
// GET SIGNED URL (for private files)
// ============================================================================

export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Signed URL error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error("Signed URL error:", error);
    return { success: false, error: "Failed to get signed URL" };
  }
}
