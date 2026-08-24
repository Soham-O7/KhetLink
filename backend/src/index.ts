import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./auth.routes.js";

const app = express();
const PORT = Number(process.env["PORT"] ?? 4000);

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: "http://localhost:3000",  // Next.js dev server
  credentials: true,                // Allow cookies cross-origin
}));

app.use(express.json());
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌾 KhetLink backend running → http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
