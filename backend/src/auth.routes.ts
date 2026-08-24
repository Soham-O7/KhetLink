import "dotenv/config";
import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const JWT_SECRET = process.env["JWT_SECRET"] ?? "fallback_secret";
const IS_PROD = process.env["NODE_ENV"] === "production";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const signupSchema = z
  .object({
    username: z
      .string({ error: "Username is required" })
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),

    email: z
      .string({ error: "Email is required" })
      .email("Please enter a valid email address")
      .toLowerCase(),

    phone: z
      .string({ error: "Phone number is required" })
      .regex(/^\d{7,15}$/, "Phone must be 7–15 digits with no spaces or symbols"),

    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long")                               // bcrypt limit
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z
      .string({ error: "Please confirm your password" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const loginSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .min(1, "Username is required")
    .trim(),

  email: z
    .string({ error: "Email is required" })
    .email("Please enter a valid email address")
    .toLowerCase(),

  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

// ── POST /api/auth/signup ─────────────────────────────────────────────────────

router.post("/signup", async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const { username, email, phone, password } = parsed.data;


  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    const field = existing.email === email ? "Email" : "Username";
    res.status(409).json({ error: `${field} already in use` });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { username, email, phone, password: hashed },
    select: { id: true, username: true, email: true },
  });

  const token = jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, COOKIE_OPTS);
  res.status(201).json({ message: "Account created", user });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────

router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const { username, email, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, COOKIE_OPTS);
  res.status(200).json({
    message: "Login successful",
    user: { id: user.id, username: user.username, email: user.email },
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out" });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

router.get("/me", async (req: Request, res: Response) => {
  const token = req.cookies?.["token"] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, phone: true },
    });

    if (!user) {
      res.clearCookie("token", { path: "/" });
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch {
    res.clearCookie("token", { path: "/" });
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
