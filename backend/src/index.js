import "dotenv/config";
import express from "express";
import cors from "cors";
import healthDeclarationsRouter from "./routes/health-declarations.js";
import authRouter from "./routes/auth.js";
import reviewsRouter from "./routes/reviews.js";

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/health-declarations", healthDeclarationsRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewsRouter);

app.listen(PORT, () => {
  console.log(`Reut Cosmetics API running on http://localhost:${PORT}`);
});
