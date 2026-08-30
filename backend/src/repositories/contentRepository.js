import path from "node:path";
import { fileURLToPath } from "node:url";
import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDb, isFirebaseBackendEnabled } from "../services/firebaseAdmin.js";
import { readJsonFile, writeJsonFile } from "../services/jsonFileStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "content.json");
const FIRESTORE_DOCUMENT = "site/content";
const EMPTY_CONTENT = { text: {}, images: {} };

export async function getContent() {
  if (!isFirebaseBackendEnabled()) {
    return readJsonFile(DATA_FILE, EMPTY_CONTENT);
  }

  const snapshot = await getFirestoreDb().doc(FIRESTORE_DOCUMENT).get();
  return snapshot.exists ? snapshot.data().payload : structuredClone(EMPTY_CONTENT);
}

export async function saveContent(content) {
  if (!isFirebaseBackendEnabled()) {
    await writeJsonFile(DATA_FILE, content);
    return;
  }

  await getFirestoreDb().doc(FIRESTORE_DOCUMENT).set({
    payload: content,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
