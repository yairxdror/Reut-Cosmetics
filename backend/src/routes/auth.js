import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !adminPasswordHash || !jwtSecret) {
    console.error("Admin login is not configured: missing ADMIN_EMAIL, ADMIN_PASSWORD_HASH or JWT_SECRET");
    return res.status(500).json({ error: "Login is not configured" });
  }

  const emailMatches = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ role: "admin", email: adminEmail }, jwtSecret, { expiresIn: "8h" });

  res.json({ token });
});

export default router;
