import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
} from "firebase/storage";
import { storage } from "./config";

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}

/**
 * Upload a file with progress tracking
 */
export function uploadFileWithProgress(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): UploadTask {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  if (onProgress) {
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    });
  }

  return uploadTask;
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  basePath: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const path = `${basePath}/${Date.now()}-${index}-${file.name}`;
    return uploadFile(file, path);
  });

  return Promise.all(uploadPromises);
}

/**
 * Upload a product image
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const extension = file.name.split(".").pop();
  const fileName = `${Date.now()}.${extension}`;
  const path = `products/${productId}/${fileName}`;
  return uploadFile(file, path);
}

/**
 * Upload multiple product images
 */
export async function uploadProductImages(
  files: File[],
  productId: string
): Promise<string[]> {
  return uploadMultipleFiles(files, `products/${productId}`);
}

/**
 * Upload a category image
 */
export async function uploadCategoryImage(
  file: File,
  categoryId: string
): Promise<string> {
  const extension = file.name.split(".").pop();
  const fileName = `${Date.now()}.${extension}`;
  const path = `categories/${categoryId}/${fileName}`;
  return uploadFile(file, path);
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw new Error("Failed to get file URL");
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}

/**
 * Delete a file by URL
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - file might not exist
  }
}

/**
 * Delete all files in a folder
 */
export async function deleteFolder(folderPath: string): Promise<void> {
  try {
    const folderRef = ref(storage, folderPath);
    const list = await listAll(folderRef);

    const deletePromises = list.items.map((item) => deleteObject(item));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error("Failed to delete folder");
  }
}

/**
 * Generate a unique file name
 */
export function generateFileName(originalName: string): string {
  const extension = originalName.split(".").pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Validate file type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
}

/**
 * Validate file size (default max: 5MB)
 */
export function isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  if (!isValidImageType(file)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPG, PNG, GIF, or WebP images.",
    };
  }

  if (!isValidFileSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}
