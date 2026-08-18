import { Router } from "express";

const router = Router();

const submissions = [];

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

router.post("/", (req, res) => {
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

  const submission = {
    id: submissions.length + 1,
    fullName,
    idNumber,
    phone,
    answers,
    details: details || {},
    agreementAccepted,
    submittedAt: new Date().toISOString(),
  };

  submissions.push(submission);

  res.status(201).json({ id: submission.id, submittedAt: submission.submittedAt });
});

export default router;
