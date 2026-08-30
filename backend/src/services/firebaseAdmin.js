import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const FIREBASE_BACKEND = "firebase";

export function isFirebaseBackendEnabled() {
  return process.env.DATA_BACKEND?.trim().toLowerCase() === FIREBASE_BACKEND;
}

function getFirebaseApp() {
  if (!isFirebaseBackendEnabled()) {
    throw new Error("Firebase is disabled. Set DATA_BACKEND=firebase to enable it.");
  }

  if (getApps().length > 0) return getApp();

  const options = {};
  if (process.env.FIREBASE_PROJECT_ID) {
    options.projectId = process.env.FIREBASE_PROJECT_ID;
  }
  if (process.env.FIREBASE_STORAGE_BUCKET) {
    options.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  }

  // On Cloud Run, Application Default Credentials are discovered
  // automatically. Locally, GOOGLE_APPLICATION_CREDENTIALS can point to a
  // service-account JSON file that is kept outside the repository.
  return initializeApp(options);
}

export function getFirestoreDb() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorageBucket() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  if (!bucketName) {
    throw new Error("FIREBASE_STORAGE_BUCKET must be set when DATA_BACKEND=firebase");
  }
  return getStorage(getFirebaseApp()).bucket(bucketName);
}
