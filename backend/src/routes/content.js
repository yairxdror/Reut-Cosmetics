import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "content.json");
const UPLOADS_DIR = path.join(__dirname, "..", "data", "uploads");

const MAX_TEXT_LENGTH = 2000;

// Keep in sync with frontend/src/lib/editableContent.ts. A key added on the
// frontend without a matching addition here fails at click-time with a 400
// rather than at compile time, since there's no package shared between the
// two runtimes to enforce it automatically.
const ALLOWED_TEXT_KEYS = [
  "heroTitleMain",
  "heroTitleLine2Prefix",
  "heroTitleHighlight",
  "heroSubtitle",
  "featureDiagnostics",
  "featurePersonalService",
  "featureEquipped",
  "featureMaterials",
  "heroBadgeLine1",
  "heroBadgeLine2",
  "heroBadgeLine3",
  "servicesTitleKicker",
  "servicesTitleMain",
  "service1Title",
  "service1Desc",
  "service2Title",
  "service2Desc",
  "service3Title",
  "service3Desc",
  "service4Title",
  "service4Desc",
  "privateCoursesIntro",
  "pcCourse1Title",
  "pcCourse1Desc",
  "pcCourse1MethodsLabel",
  "pcCourse1Method1",
  "pcCourse1Method2",
  "pcCourse1Method3",
  "pcCourse2Title",
  "pcCourse2Desc",
  "locationTitle",
  "locationAddress",
  "reviewsTitle",
  "footerRights",
  "developedBy",
];

const ALLOWED_IMAGE_KEYS = ["heroProduct", "logo", "servicesCardImage", "coursesCardImage"];

const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function loadContent() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return { text: {}, images: {} };
  }
}

function saveContent(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let content = loadContent();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      cb(null, UPLOADS_DIR);
    },
    // Extension is derived from the verified mimetype, not the client-
    // supplied original filename, so a renamed file can't smuggle a
    // different extension onto disk. Timestamped names mean every
    // replacement gets a fresh URL, so nothing needs cache-busting.
    filename: (req, file, cb) => {
      const ext = MIME_TO_EXT[file.mimetype] || "jpg";
      cb(null, `${req.params.key}-${Date.now()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!MIME_TO_EXT[file.mimetype]) {
      cb(new Error("INVALID_FILE_TYPE"));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", (req, res) => {
  res.json(content);
});

router.put("/text/:key", requireAdmin, (req, res) => {
  const { key } = req.params;
  if (!ALLOWED_TEXT_KEYS.includes(key)) {
    return res.status(400).json({ error: "Unknown content key" });
  }

  const { he, en } = req.body || {};
  const trimmedHe = typeof he === "string" ? he.trim() : "";
  const trimmedEn = typeof en === "string" ? en.trim() : "";

  if (!trimmedHe || !trimmedEn) {
    return res.status(400).json({ error: "Both he and en text are required" });
  }
  if (trimmedHe.length > MAX_TEXT_LENGTH || trimmedEn.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `Text must be under ${MAX_TEXT_LENGTH} characters` });
  }

  content.text[key] = { he: trimmedHe, en: trimmedEn };
  saveContent(content);

  res.json({ key, he: trimmedHe, en: trimmedEn });
});

router.put(
  "/images/:key",
  requireAdmin,
  (req, res, next) => {
    if (!ALLOWED_IMAGE_KEYS.includes(req.params.key)) {
      return res.status(400).json({ error: "Unknown content key" });
    }
    next();
  },
  (req, res, next) => {
    // Wrapping multer's callback form (rather than relying on a downstream
    // 4-arg error handler) keeps its error handling scoped to just this
    // route, instead of a global middleware that every other route's
    // errors would also flow through.
    upload.single("image")(req, res, (err) => {
      if (!err) return next();
      const message =
        err.message === "INVALID_FILE_TYPE"
          ? "Only JPEG, PNG or WebP images are allowed"
          : err.code === "LIMIT_FILE_SIZE"
            ? "Image must be under 5MB"
            : "Upload failed";
      res.status(400).json({ error: message });
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const { key } = req.params;
    const url = `/uploads/${req.file.filename}`;
    content.images[key] = url;
    saveContent(content);

    res.json({ key, url });
  }
);

export default router;
