import { Router } from "express";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import { containsProfanity } from "../utils/profanityFilter.js";
import { createReview, getReview, listReviews, removeReview, replaceReview } from "../repositories/reviewsRepository.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const MAX_NAME_LENGTH = 60;
const MIN_TEXT_LENGTH = 3;
const MAX_TEXT_LENGTH = 500;
const EDIT_WINDOW_MS = 15 * 60 * 1000;
const PRIVACY_NOTICE_VERSION = "2026-09-02";

function toPublicReview(review) {
  const { editToken, publicationConsentAt, privacyNoticeVersion, ...publicFields } = review;
  return publicFields;
}

function validateReviewFields({ name, rating, text }) {
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedText = typeof text === "string" ? text.trim() : "";
  const numericRating = Number(rating);

  if (!trimmedName || trimmedName.length > MAX_NAME_LENGTH) {
    return { error: "A valid name is required" };
  }
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return { error: "Rating must be an integer between 1 and 5" };
  }
  if (!trimmedText || trimmedText.length < MIN_TEXT_LENGTH || trimmedText.length > MAX_TEXT_LENGTH) {
    return { error: `Review text must be between ${MIN_TEXT_LENGTH} and ${MAX_TEXT_LENGTH} characters` };
  }
  if (containsProfanity(trimmedName) || containsProfanity(trimmedText)) {
    return { error: "Review contains inappropriate language" };
  }

  return { name: trimmedName, rating: numericRating, text: trimmedText };
}

const createReviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many reviews submitted. Please try again later." },
});

const editReviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many edit attempts. Please try again later." },
});

router.get("/", asyncHandler(async (req, res) => {
  const sorted = (await listReviews()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted.map(toPublicReview));
}));

router.post("/", createReviewLimiter, asyncHandler(async (req, res) => {
  // Honeypot: a field real users never see or fill in. A bot that blindly
  // fills every input in the form trips it, and gets the same generic
  // validation error as any other bad submission — no distinct signal.
  if (typeof req.body?.website === "string" && req.body.website.trim() !== "") {
    return res.status(400).json({ error: "Invalid submission" });
  }

  if (req.body?.publicationConsent !== true) {
    return res.status(400).json({ error: "Publication consent is required" });
  }

  const fields = validateReviewFields(req.body || {});
  if (fields.error) {
    return res.status(400).json({ error: fields.error });
  }

  const review = {
    id: Date.now(),
    name: fields.name,
    rating: fields.rating,
    text: fields.text,
    createdAt: new Date().toISOString(),
    publicationConsentAt: new Date().toISOString(),
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
    editToken: crypto.randomUUID(),
  };

  await createReview(review);

  res.status(201).json({ ...toPublicReview(review), editToken: review.editToken });
}));

router.put("/:id", editReviewLimiter, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { editToken } = req.body || {};

  const review = await getReview(id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  if (!editToken || editToken !== review.editToken) {
    return res.status(403).json({ error: "You are not allowed to edit this review" });
  }
  if (Date.now() - new Date(review.createdAt).getTime() > EDIT_WINDOW_MS) {
    return res.status(403).json({ error: "The edit window for this review has expired" });
  }

  const fields = validateReviewFields(req.body || {});
  if (fields.error) {
    return res.status(400).json({ error: fields.error });
  }

  review.name = fields.name;
  review.rating = fields.rating;
  review.text = fields.text;
  review.updatedAt = new Date().toISOString();

  await replaceReview(review);

  res.json(toPublicReview(review));
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || !(await removeReview(id))) {
    return res.status(404).json({ error: "Review not found" });
  }

  res.status(204).end();
}));

export default router;
