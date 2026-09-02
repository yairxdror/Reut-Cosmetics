import path from "node:path";
import { fileURLToPath } from "node:url";
import { Timestamp } from "firebase-admin/firestore";
import { getFirestoreDb, isFirebaseBackendEnabled } from "../services/firebaseAdmin.js";
import { readJsonFile, writeJsonFile } from "../services/jsonFileStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "health-declarations.json");
const COLLECTION = "healthDeclarations";

export async function listHealthDeclarations() {
  if (!isFirebaseBackendEnabled()) {
    return readJsonFile(DATA_FILE, []);
  }
  const snapshot = await getFirestoreDb().collection(COLLECTION).orderBy("submittedAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function addHealthDeclaration(record) {
  if (!isFirebaseBackendEnabled()) {
    const records = await readJsonFile(DATA_FILE, []);
    records.push(record);
    await writeJsonFile(DATA_FILE, records);
    return;
  }
  const firestoreRecord = {
    ...record,
    expiresAt: Timestamp.fromDate(new Date(record.expiresAt)),
  };
  await getFirestoreDb().collection(COLLECTION).doc(String(record.id)).create(firestoreRecord);
}

export async function purgeHealthDeclarationsBefore(cutoffIso) {
  if (!isFirebaseBackendEnabled()) {
    const records = await readJsonFile(DATA_FILE, []);
    const retained = records.filter((record) => record.submittedAt > cutoffIso);
    if (retained.length !== records.length) await writeJsonFile(DATA_FILE, retained);
    return;
  }

  const collection = getFirestoreDb().collection(COLLECTION);
  while (true) {
    const snapshot = await collection.where("submittedAt", "<=", cutoffIso).limit(500).get();
    if (snapshot.empty) return;
    const batch = getFirestoreDb().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    if (snapshot.size < 500) return;
  }
}
