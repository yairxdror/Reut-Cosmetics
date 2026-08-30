import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { getDownloadURL } from "firebase-admin/storage";
import { getFirebaseStorageBucket, isFirebaseBackendEnabled } from "./firebaseAdmin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LOCAL_UPLOADS_DIR = path.join(__dirname, "..", "data", "uploads");
const FIREBASE_IMAGE_PREFIX = "site-content/";

export async function saveImage(key, buffer) {
  const filename = `${key}-${Date.now()}.webp`;

  if (!isFirebaseBackendEnabled()) {
    await fs.promises.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
    await fs.promises.writeFile(path.join(LOCAL_UPLOADS_DIR, filename), buffer);
    return `/uploads/${filename}`;
  }

  const file = getFirebaseStorageBucket().file(`${FIREBASE_IMAGE_PREFIX}${filename}`);
  const downloadToken = crypto.randomUUID();
  await file.save(buffer, {
    resumable: false,
    metadata: {
      contentType: "image/webp",
      cacheControl: "public,max-age=31536000,immutable",
      metadata: { firebaseStorageDownloadTokens: downloadToken },
    },
  });
  return getDownloadURL(file);
}

export async function deleteImage(url) {
  if (typeof url !== "string") return;

  if (!isFirebaseBackendEnabled()) {
    if (!url.startsWith("/uploads/")) return;
    const filename = path.basename(url);
    if (!filename || filename !== url.slice("/uploads/".length)) return;
    await fs.promises.unlink(path.join(LOCAL_UPLOADS_DIR, filename)).catch((error) => {
      if (error?.code !== "ENOENT") throw error;
    });
    return;
  }

  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/o\/([^/]+)$/);
    if (!match) return;
    const objectName = decodeURIComponent(match[1]);
    if (!objectName.startsWith(FIREBASE_IMAGE_PREFIX)) return;
    await getFirebaseStorageBucket().file(objectName).delete({ ignoreNotFound: true });
  } catch (error) {
    if (error instanceof TypeError) return;
    throw error;
  }
}
