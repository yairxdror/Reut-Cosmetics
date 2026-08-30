import { Router } from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  addHealthDeclaration,
  listHealthDeclarations,
  purgeHealthDeclarationsBefore,
} from "../repositories/healthDeclarationsRepository.js";
import { isValidIsraeliId, isValidIsraeliPhone } from "../utils/israeliValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

const ENCRYPTION_KEY_HEX = process.env.HEALTH_DATA_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY_HEX || Buffer.from(ENCRYPTION_KEY_HEX, "hex").length !== 32) {
  throw new Error(
    "HEALTH_DATA_ENCRYPTION_KEY must be set to a 32-byte hex string (64 hex characters). " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  );
}
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, "hex");

const YES_NO_QUESTION_IDS = [
  "allergies",
  "skinConditionAtSite",
  "slowHealing",
  "pregnant",
  "regularMedication",
  "underInfluence",
  "g6pdDeficiency",
  "seborrheaPsoriasis",
  "roaccutane",
  "hormoneTherapy",
];

function encryptPayload(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return {
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

export function decryptSubmission(record) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, Buffer.from(record.iv, "base64"));
  decipher.setAuthTag(Buffer.from(record.authTag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(record.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
  return { id: record.id, submittedAt: record.submittedAt, ...JSON.parse(plaintext) };
}

const RETENTION_YEARS = 7;

// Health declarations are kept for RETENTION_YEARS from submission and then
// deleted automatically — no manual cleanup step needed. Swept on every
// request rather than on a timer, since this route only runs inside a
// long-lived Node process and a per-request check is cheap at this scale.
async function purgeExpiredSubmissions() {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - RETENTION_YEARS);
  await purgeHealthDeclarationsBefore(cutoff.toISOString());
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

router.get("/", requireAdmin, asyncHandler(async (req, res) => {
  await purgeExpiredSubmissions();

  const submissions = await listHealthDeclarations();
  const sorted = [...submissions].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const decrypted = sorted.map(decryptSubmission);

  // Names are only ever available in plaintext after decryption, so the
  // search necessarily happens post-decrypt rather than against the stored
  // (encrypted) records directly.
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
  const filtered = search ? decrypted.filter((s) => s.fullName.toLowerCase().includes(search)) : decrypted;

  const offset = Math.max(0, Number(req.query.offset) || 0);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_SIZE));
  const page = filtered.slice(offset, offset + limit);

  res.json({
    items: page,
    total: filtered.length,
    hasMore: offset + page.length < filtered.length,
  });
}));

router.post("/", submitLimiter, asyncHandler(async (req, res) => {
  await purgeExpiredSubmissions();
  const {
    fullName,
    idNumber,
    phone,
    answers,
    details,
    healthDeclarationConfirmed,
    agreementAccepted,
  } = req.body || {};

  if (!fullName || !idNumber || !phone) {
    return res.status(400).json({ error: "fullName, idNumber and phone are required" });
  }

  if (!isValidIsraeliId(idNumber)) {
    return res.status(400).json({ error: "Invalid Israeli ID number" });
  }

  if (!isValidIsraeliPhone(phone)) {
    return res.status(400).json({ error: "Invalid Israeli phone number" });
  }

  if (!answers || YES_NO_QUESTION_IDS.some((id) => answers[id] !== "yes" && answers[id] !== "no")) {
    return res.status(400).json({ error: "All health questions must be answered" });
  }

  if (healthDeclarationConfirmed !== true) {
    return res.status(400).json({ error: "Health declaration must be confirmed" });
  }

  if (agreementAccepted !== true) {
    return res.status(400).json({ error: "Agreement must be accepted" });
  }

  const submittedAt = new Date().toISOString();
  const encrypted = encryptPayload({
    fullName,
    idNumber,
    phone,
    answers,
    details: details || {},
    healthDeclarationConfirmed,
    agreementAccepted,
  });

  const record = {
    id: Date.now(),
    submittedAt,
    ...encrypted,
  };

  await addHealthDeclaration(record);

  res.status(201).json({ id: record.id, submittedAt });
}));

export default router;
