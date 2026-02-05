import express from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validateRequest.js";

const router = express.Router();

const updateProfileSchema = z.object({
  fullName: z.string().min(1).optional(),
  academicLevel: z.string().optional(),
  intendedFieldOfStudy: z.string().optional(),
  researchInterests: z.array(z.string()).optional(),
  skillTags: z.array(z.string()).optional(),
  profilePhotoUrl: z.string().url().optional(),
  currentJourneyStage: z
    .enum([
      "EXPLORATION",
      "TOPIC_DISCOVERY",
      "LITERATURE_REVIEW",
      "METHODOLOGY",
      "EXECUTION",
      "DOCUMENTATION",
      "PUBLICATION",
    ])
    .optional(),
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        academicLevel: true,
        intendedFieldOfStudy: true,
        researchInterests: true,
        skillTags: true,
        profilePhotoUrl: true,
        currentJourneyStage: true,
        role: true,
      },
    });
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/me",
  authenticate,
  validateBody(updateProfileSchema),
  async (req, res, next) => {
    try {
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: req.body,
      });
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
);

export const usersRouter = router;

