import { Router } from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "health-declarations.json");

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

function loadSubmissions() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveSubmissions(submissions) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
}

let submissions = loadSubmissions();

router.post("/", submitLimiter, (req, res) => {
  const { fullName, idNumber, phone, answers, details, agreementAccepted } = req.body || {};

  if (!fullName || !idNumber || !phone) {
    return res.status(400).json({ error: "fullName, idNumber and phone are required" });
  }

  if (!answers || YES_NO_QUESTION_IDS.some((id) => answers[id] !== "yes" && answers[id] !== "no")) {
    return res.status(400).json({ error: "All health questions must be answered" });
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
    agreementAccepted,
  });

  const record = {
    id: submissions.length + 1,
    submittedAt,
    ...encrypted,
  };

  submissions.push(record);
  saveSubmissions(submissions);

  res.status(201).json({ id: record.id, submittedAt });
});

export default router;
