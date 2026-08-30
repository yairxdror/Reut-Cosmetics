import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { FieldValue } from "firebase-admin/firestore";
import { getDownloadURL } from "firebase-admin/storage";
import { getFirebaseStorageBucket, getFirestoreDb, isFirebaseBackendEnabled } from "../services/firebaseAdmin.js";

if (!isFirebaseBackendEnabled()) {
  throw new Error("Set DATA_BACKEND=firebase before running the migration.");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(__dirname, "..", "data");
const db = getFirestoreDb();

function readJson(filename, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDirectory, filename), "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    return fallback;
  }
}

async function migrateContent() {
  const content = readJson("content.json", { text: {}, images: {} });
  const migratedImages = { ...content.images };

  for (const [key, url] of Object.entries(migratedImages)) {
    if (typeof url !== "string" || !url.startsWith("/uploads/")) continue;
    const filename = path.basename(url);
    const localPath = path.join(dataDirectory, "uploads", filename);
    if (!fs.existsSync(localPath)) continue;

    const file = getFirebaseStorageBucket().file(`site-content/${filename}`);
    const downloadToken = crypto.randomUUID();
    await file.save(fs.readFileSync(localPath), {
      resumable: false,
      metadata: {
        contentType: "image/webp",
        cacheControl: "public,max-age=31536000,immutable",
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });
    migratedImages[key] = await getDownloadURL(file);
  }

  await db.doc("site/content").set({
    payload: { ...content, images: migratedImages },
    updatedAt: FieldValue.serverTimestamp(),
  });
  return Object.keys(migratedImages).length;
}

async function writeCollection(collectionName, records) {
  for (let offset = 0; offset < records.length; offset += 500) {
    const batch = db.batch();
    for (const record of records.slice(offset, offset + 500)) {
      batch.set(db.collection(collectionName).doc(String(record.id)), record);
    }
    await batch.commit();
  }
  return records.length;
}

const counts = {
  contentImages: await migrateContent(),
  faq: await writeCollection("faq", readJson("faq.json", [])),
  reviews: await writeCollection("reviews", readJson("reviews.json", [])),
  healthDeclarations: await writeCollection(
    "healthDeclarations",
    readJson("health-declarations.json", [])
  ),
};

console.log("Firebase migration completed:", counts);
