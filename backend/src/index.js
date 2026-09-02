import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import healthDeclarationsRouter, { purgeExpiredHealthDeclarations } from "./routes/health-declarations.js";
import authRouter from "./routes/auth.js";
import reviewsRouter from "./routes/reviews.js";
import contentRouter from "./routes/content.js";
import faqRouter from "./routes/faq.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || CLIENT_ORIGINS.includes(origin));
  },
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "data", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/health-declarations", healthDeclarationsRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/content", contentRouter);
app.use("/api/faq", faqRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error("Unhandled API error:", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Reut Cosmetics API running on http://localhost:${PORT}`);
});

async function runHealthRetentionSweep() {
  try {
    await purgeExpiredHealthDeclarations();
  } catch (error) {
    console.error("Health declaration retention sweep failed:", error);
  }
}

void runHealthRetentionSweep();
const healthRetentionTimer = setInterval(runHealthRetentionSweep, 24 * 60 * 60 * 1000);
healthRetentionTimer.unref();

export default app;
