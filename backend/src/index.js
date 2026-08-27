import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import healthDeclarationsRouter from "./routes/health-declarations.js";
import authRouter from "./routes/auth.js";
import reviewsRouter from "./routes/reviews.js";
import contentRouter from "./routes/content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "data", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/health-declarations", healthDeclarationsRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/content", contentRouter);

app.listen(PORT, () => {
  console.log(`Reut Cosmetics API running on http://localhost:${PORT}`);
});
