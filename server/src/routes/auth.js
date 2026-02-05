import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { env } from "../config/env.js";
import {
  issueAuthToken,
  setAuthCookie,
  authenticate,
} from "../middleware/auth.js";
import { validateBody } from "../middleware/validateRequest.js";
import { createRateLimiters } from "../middleware/rateLimit.js";
import { sendPasswordResetEmail } from "../services/email.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const { authLimiter } = createRateLimiters();

const googleClient =
  env.GOOGLE_CLIENT_ID && new OAuth2Client(env.GOOGLE_CLIENT_ID);

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  academicLevel: z.string().optional(),
  researchInterests: z.array(z.string()).optional(),
  intendedFieldOfStudy: z.string().optional(),
  skillTags: z.array(z.string()).optional(),
  role: z.enum(["STUDENT_RESEARCHER", "MENTOR"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

const googleAuthSchema = z.object({
  idToken: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

router.post(
  "/register",
  authLimiter,
  validateBody(registrationSchema),
  async (req, res, next) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0cc6c638-6904-40b4-a95c-a29458d9c0af',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'signup-debug-1',
          hypothesisId:'H1',
          location:'server/src/routes/auth.js:/register:entry',
          message:'Entered /auth/register handler',
          data:{},
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion

      const {
        email,
        password,
        fullName,
        academicLevel,
        researchInterests = [],
        intendedFieldOfStudy,
        skillTags = [],
        role,
      } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/0cc6c638-6904-40b4-a95c-a29458d9c0af',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            sessionId:'debug-session',
            runId:'signup-debug-1',
            hypothesisId:'H2',
            location:'server/src/routes/auth.js:/register:existing-user',
            message:'Registration blocked: email already in use',
            data:{},
            timestamp:Date.now()
          })
        }).catch(()=>{});
        // #endregion
        return res.status(409).json({ message: "Email already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          academicLevel,
          researchInterests,
          intendedFieldOfStudy,
          skillTags,
          role: role ?? "STUDENT_RESEARCHER",
        },
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0cc6c638-6904-40b4-a95c-a29458d9c0af',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'signup-debug-1',
          hypothesisId:'H3',
          location:'server/src/routes/auth.js:/register:after-create',
          message:'User created successfully in /auth/register',
          data:{},
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion

      const token = issueAuthToken(user);
      setAuthCookie(res, token);

      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = issueAuthToken(user);
      setAuthCookie(res, token);

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/google",
  authLimiter,
  validateBody(googleAuthSchema),
  async (req, res, next) => {
    try {
      if (!googleClient) {
        return res
          .status(500)
          .json({ message: "Google OAuth not configured on the server." });
      }

      const { idToken } = req.body;

      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload?.sub || !payload?.email) {
        return res.status(400).json({ message: "Invalid Google token payload" });
      }

      const googleId = payload.sub;
      const email = payload.email;
      const fullName = payload.name ?? email;

      let user = await prisma.user.findUnique({
        where: { googleId },
      });

      if (!user) {
        user = await prisma.user.upsert({
          where: { email },
          update: { googleId },
          create: {
            email,
            googleId,
            fullName,
            role: "STUDENT_RESEARCHER",
          },
        });
      }

      const token = issueAuthToken(user);
      setAuthCookie(res, token);

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/forgot-password",
  authLimiter,
  validateBody(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token,
            expiresAt,
          },
        });

        await sendPasswordResetEmail(email, token);
      }

      // Always return success to avoid user enumeration.
      res.json({
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/reset-password",
  authLimiter,
  validateBody(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const { token, password } = req.body;

      const reset = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!reset || reset.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      });

      await prisma.passwordResetToken.deleteMany({
        where: { userId: reset.userId },
      });

      res.json({ message: "Password updated successfully." });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/logout", authenticate, async (_req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(204).send();
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        academicLevel: true,
        intendedFieldOfStudy: true,
        researchInterests: true,
        skillTags: true,
        profilePhotoUrl: true,
        currentJourneyStage: true,
      },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export const authRouter = router;

