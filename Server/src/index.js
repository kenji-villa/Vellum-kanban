import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";
import { broadcastChanges } from "./middleware/broadcast.js";
import { initRealtime } from "./realtime.js";

const isProd = process.env.NODE_ENV === "production";

// Stop early, with a clear message, if something important is missing
const missing = ["DATABASE_URL", "JWT_SECRET", "CLIENT_URL"].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}
if (isProd && process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET is too short. Use a long random value.");
  process.exit(1);
}
if (isProd && !process.env.CLOUDINARY_URL) {
  console.warn("⚠️  CLOUDINARY_URL is not set: avatar and banner uploads will fail.");
}
if (isProd && !process.env.GOOGLE_CLIENT_ID) {
  console.warn("⚠️  GOOGLE_CLIENT_ID is not set: Google sign-in will fail.");
}

const app = express();
const PORT = process.env.PORT || 4000;

// CLIENT_URL can hold several addresses, separated by commas
const ORIGINS = process.env.CLIENT_URL.split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.set("trust proxy", 1); // Render sits behind a proxy
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: ORIGINS,
    allowedHeaders: ["Content-Type", "Authorization", "X-Socket-Id"],
  }),
);
app.use(express.json());

// Slow down password guessing: only sign-in, sign-up and Google sign-in are limited
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => req.method === "GET",
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

app.get("/", (req, res) => res.json({ status: "ok", service: "vellum-api" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/notifications", requireAuth, notificationRoutes);

// Each router is mounted exactly once, with live-sync broadcasting
app.use("/api/team", requireAuth, broadcastChanges, teamRoutes);
app.use("/api/boards", requireAuth, broadcastChanges, boardRoutes);
app.use("/api/lists", requireAuth, broadcastChanges, listRoutes);
app.use("/api/cards", requireAuth, broadcastChanges, cardRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: isProd ? "Internal server error" : err.message });
});

process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));

const server = http.createServer(app);
initRealtime(server, ORIGINS);
server.listen(PORT, () => console.log(`🚀 Vellum API running on port ${PORT}`));