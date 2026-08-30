import path from "node:path";
import { fileURLToPath } from "node:url";
import { getFirestoreDb, isFirebaseBackendEnabled } from "../services/firebaseAdmin.js";
import { readJsonFile, writeJsonFile } from "../services/jsonFileStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "faq.json");
const COLLECTION = "faq";

export async function listFaqs(seedFaqs) {
  if (!isFirebaseBackendEnabled()) {
    return readJsonFile(DATA_FILE, seedFaqs);
  }

  const collection = getFirestoreDb().collection(COLLECTION);
  const snapshot = await collection.orderBy("id", "asc").get();
  if (!snapshot.empty) return snapshot.docs.map((doc) => doc.data());

  const batch = getFirestoreDb().batch();
  for (const faq of seedFaqs) {
    batch.set(collection.doc(String(faq.id)), faq);
  }
  await batch.commit();
  return structuredClone(seedFaqs);
}

export async function createFaq(faq, seedFaqs) {
  if (!isFirebaseBackendEnabled()) {
    const faqs = await readJsonFile(DATA_FILE, seedFaqs);
    faqs.push(faq);
    await writeJsonFile(DATA_FILE, faqs);
    return;
  }
  await getFirestoreDb().collection(COLLECTION).doc(String(faq.id)).create(faq);
}

export async function replaceFaq(faq, seedFaqs) {
  if (!isFirebaseBackendEnabled()) {
    const faqs = await readJsonFile(DATA_FILE, seedFaqs);
    const index = faqs.findIndex((item) => item.id === faq.id);
    if (index === -1) return false;
    faqs[index] = faq;
    await writeJsonFile(DATA_FILE, faqs);
    return true;
  }

  const reference = getFirestoreDb().collection(COLLECTION).doc(String(faq.id));
  if (!(await reference.get()).exists) return false;
  await reference.set(faq);
  return true;
}

export async function removeFaq(id, seedFaqs) {
  if (!isFirebaseBackendEnabled()) {
    const faqs = await readJsonFile(DATA_FILE, seedFaqs);
    const filtered = faqs.filter((item) => item.id !== id);
    if (filtered.length === faqs.length) return false;
    await writeJsonFile(DATA_FILE, filtered);
    return true;
  }

  const reference = getFirestoreDb().collection(COLLECTION).doc(String(id));
  if (!(await reference.get()).exists) return false;
  await reference.delete();
  return true;
}
