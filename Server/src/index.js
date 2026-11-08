import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";
import teamRoutes from "./routes/teamRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import http from "http";
import { initRealtime } from "./realtime.js";
import { broadcastChanges } from "./middleware/broadcast.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    allowedHeaders: ["Content-Type", "Authorization", "X-Socket-Id"],
  }),
);
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => res.json({ status: "ok", service: "vellum-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/notifications", requireAuth, notificationRoutes);


app.use("/api/team", requireAuth, broadcastChanges, teamRoutes);
app.use("/api/boards", requireAuth, broadcastChanges, boardRoutes);
app.use("/api/lists", requireAuth, broadcastChanges, listRoutes);
app.use("/api/cards", requireAuth, broadcastChanges, cardRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

const server = http.createServer(app);
initRealtime(server, CLIENT_URL);
server.listen(PORT, () => console.log(`🚀 Vellum API running at http://localhost:${PORT}`));