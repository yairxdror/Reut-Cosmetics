import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getContent, saveContent } from "../repositories/contentRepository.js";
import { deleteImage, saveImage } from "../services/imageStorage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const MAX_TEXT_LENGTH = 2000;
const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1920;
const TARGET_IMAGE_SIZE_BYTES = 850 * 1024;

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
  "instagramHandle",
  "facebookName",
  "phoneDisplayNumber",
  "whatsappCta",
  "whatsappCtaCore",
  "whatsappCtaSuffix",
  "detailsLink",
  "wazeCta",
  "addReviewButton",
  "instagramCta",
  "phoneCta",
  "consultationSubmit",
  "reviewSubmit",
  "reviewUpdate",
  "loginSubmit",
  "adminLoadMore",
  "faq",
  "privateCourses",
  "careIntroGreeting",
  "careIntroLine1",
  "careIntroLine2",
  "careWarningBold",
  "careWarningNote",
  "careDailyTitle",
  "careDaily1",
  "careDaily2",
  "careDaily3",
  "careDaily4",
  "careDaily5",
  "careImportantTitle",
  "careRule1",
  "careRule2",
  "careRule3",
  "careRule4",
  "careRule5",
  "careRule6",
  "careRule7",
  "careRule8",
  "careHealingTitle",
  "careHealing1",
  "careHealing2",
  "careHealing3",
  "careHealing4",
  "careHealing5",
  "careHealingImageAlt",
  "careContactIntro",
  "carePhoneNumber",
  "careSignoff",
  "careSignoffName",
  "legalPhoneLabel",
  "legalContactLabel",
  "ppGeneralTitle",
  "ppGeneralText",
  "ppDataCollectedTitle",
  "ppDataItem1",
  "ppDataItem2",
  "ppDataItem3",
  "ppDataItem4",
  "ppDataItem5",
  "ppSensitiveTitle",
  "ppSensitiveIntro",
  "ppSensitiveItem1",
  "ppSensitiveItem2",
  "ppSensitiveItem3",
  "ppSensitiveItem4",
  "ppUsageTitle",
  "ppUsageText",
  "ppSharingTitle",
  "ppSharingText",
  "ppSecurityTitle",
  "ppSecurityText",
  "ppCookiesTitle",
  "ppCookiesText",
  "ppRightsTitle",
  "ppRightsText",
  "ppContactTitle",
  "ppContactIntro",
  "ppUpdatesTitle",
  "ppUpdatesText",
  "ppLastUpdated",
  "touGeneralTitle",
  "touGeneralText",
  "touServicesTitle",
  "touServicesText",
  "touHealthTitle",
  "touHealthText",
  "touPaymentTitle",
  "touPayment1",
  "touPayment2",
  "touPayment3",
  "touPayment4",
  "touPayment5",
  "touPayment6",
  "touReviewsTitle",
  "touReviewsText",
  "touIpTitle",
  "touIpText",
  "touLiabilityTitle",
  "touLiabilityText",
  "touChangesTitle",
  "touChangesText",
  "touJurisdictionTitle",
  "touJurisdictionText",
  "touContactTitle",
  "touContactIntro",
  "touLastUpdated",
  "asCommitmentTitle",
  "asCommitmentText",
  "asMeasuresTitle",
  "asMeasure1",
  "asMeasure2",
  "asMeasure3",
  "asMeasure4",
  "asMeasure5",
  "asLevelTitle",
  "asLevelText",
  "asLimitationsTitle",
  "asLimitationsText",
  "asContactTitle",
  "asContactIntro",
  "asEmailLabel",
  "asCoordinatorEmail",
  "asComplaintsTitle",
  "asComplaintsText",
  "asLastUpdated",
  "hdPersonalTitle",
  "hdFullNameLabel",
  "hdIdNumberLabel",
  "hdPhoneLabel",
  "hdQuestionnaireTitle",
  "hdQ1",
  "hdQ2",
  "hdQ3",
  "hdQ4",
  "hdQ5",
  "hdQ6",
  "hdQ7",
  "hdQ8",
  "hdQ9",
  "hdQ10",
  "healthFormYes",
  "healthFormNo",
  "hdDetailLabel",
  "hdConfirmationText",
  "hdAgreementTitle",
  "hdAgreementIntro",
  "hdAgreement1",
  "hdAgreement2",
  "hdAgreement3",
  "hdAgreement4",
  "hdAgreement5",
  "hdAgreement6",
  "hdAgreement7",
  "hdAgreement8",
  "hdAgreement9",
  "hdAgreement10",
  "hdAgreementCheckboxText",
  "hdSubmit",
  "hdSuccessTitle",
  "hdSuccessText",
  "brandNameMain",
  "brandNameSub",
  "contactSectionTitle",
  "service1Detail",
  "service2Detail",
  "service4Detail",
];

const ALLOWED_IMAGE_KEYS = [
  "heroProduct",
  "logo",
  "servicesCardImage",
  "pcCourse1Image",
  "pcCourse2Image",
  "careTimelineImage",
];

const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function optimizeImage(buffer) {
  const sizes = [MAX_IMAGE_DIMENSION, 1600, 1400];
  const qualities = [84, 78, 72];
  let optimized;

  for (const size of sizes) {
    for (const quality of qualities) {
      optimized = await sharp(buffer, {
        failOn: "error",
        limitInputPixels: 40_000_000,
      })
        .rotate()
        .resize({
          width: size,
          height: size,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 4, smartSubsample: true })
        .toBuffer();

      if (optimized.length <= TARGET_IMAGE_SIZE_BYTES) {
        return optimized;
      }
    }
  }

  return optimized;
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!MIME_TO_EXT[file.mimetype]) {
      cb(new Error("INVALID_FILE_TYPE"));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
});

router.get("/", asyncHandler(async (req, res) => {
  res.json(await getContent());
}));

router.put("/text/:key", requireAdmin, asyncHandler(async (req, res) => {
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

  const content = await getContent();
  content.text ||= {};
  content.text[key] = { he: trimmedHe, en: trimmedEn };
  await saveContent(content);

  res.json({ key, he: trimmedHe, en: trimmedEn });
}));

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
            ? "Image must be under 15MB"
            : "Upload failed";
      res.status(400).json({ error: message });
    });
  },
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const { key } = req.params;
    let optimized;

    try {
      optimized = await optimizeImage(req.file.buffer);
    } catch {
      return res.status(400).json({ error: "Image could not be processed" });
    }

    const content = await getContent();
    content.images ||= {};
    const previousUrl = content.images[key];
    let url;

    try {
      url = await saveImage(key, optimized);
      content.images[key] = url;
      await saveContent(content);
    } catch (error) {
      if (url) await deleteImage(url).catch(() => {});
      console.error("Failed to save optimized image:", error);
      return res.status(500).json({ error: "Upload failed" });
    }

    await deleteImage(previousUrl).catch((error) => {
      console.warn("Failed to remove replaced image:", error);
    });

    res.json({ key, url });
  })
);

export default router;
