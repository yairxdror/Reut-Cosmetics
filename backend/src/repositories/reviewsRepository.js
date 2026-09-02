import path from "node:path";
import { fileURLToPath } from "node:url";
import { getFirestoreDb, isFirebaseBackendEnabled } from "../services/firebaseAdmin.js";
import { readJsonFile, writeJsonFile } from "../services/jsonFileStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "reviews.json");
const COLLECTION = "reviews";

export async function listReviews() {
  if (!isFirebaseBackendEnabled()) {
    return readJsonFile(DATA_FILE, []);
  }
  const snapshot = await getFirestoreDb().collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getReview(id) {
  if (!isFirebaseBackendEnabled()) {
    return (await readJsonFile(DATA_FILE, [])).find((review) => review.id === id) ?? null;
  }
  const snapshot = await getFirestoreDb().collection(COLLECTION).doc(String(id)).get();
  return snapshot.exists ? snapshot.data() : null;
}

export async function createReview(review) {
  if (!isFirebaseBackendEnabled()) {
    const reviews = await readJsonFile(DATA_FILE, []);
    reviews.push(review);
    await writeJsonFile(DATA_FILE, reviews);
    return;
  }
  await getFirestoreDb().collection(COLLECTION).doc(String(review.id)).create(review);
}

export async function replaceReview(review) {
  if (!isFirebaseBackendEnabled()) {
    const reviews = await readJsonFile(DATA_FILE, []);
    const index = reviews.findIndex((item) => item.id === review.id);
    if (index === -1) return false;
    reviews[index] = review;
    await writeJsonFile(DATA_FILE, reviews);
    return true;
  }
  await getFirestoreDb().collection(COLLECTION).doc(String(review.id)).set(review);
  return true;
}

export async function removeReview(id) {
  if (!isFirebaseBackendEnabled()) {
    const reviews = await readJsonFile(DATA_FILE, []);
    const retained = reviews.filter((review) => review.id !== id);
    if (retained.length === reviews.length) return false;
    await writeJsonFile(DATA_FILE, retained);
    return true;
  }

  const ref = getFirestoreDb().collection(COLLECTION).doc(String(id));
  const snapshot = await ref.get();
  if (!snapshot.exists) return false;
  await ref.delete();
  return true;
}
