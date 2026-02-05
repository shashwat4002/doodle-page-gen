import express from "express";
import { prisma } from "../db/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Basic interest / skill based matching
router.get("/suggested", authenticate, async (req, res, next) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    const candidates = await prisma.user.findMany({
      where: {
        id: { not: me.id },
      },
      take: 50,
    });

    const scoreUser = (other) => {
      const sharedInterests = (other.researchInterests ?? []).filter((x) =>
        (me.researchInterests ?? []).includes(x),
      ).length;
      const sharedSkills = (other.skillTags ?? []).filter((x) =>
        (me.skillTags ?? []).includes(x),
      ).length;

      let levelScore = 0;
      if (
        me.academicLevel &&
        other.academicLevel &&
        me.academicLevel === other.academicLevel
      ) {
        levelScore = 1;
      }

      return sharedInterests * 3 + sharedSkills * 2 + levelScore;
    };

    const matches = candidates
      .map((c) => ({ user: c, score: scoreUser(c) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((m) => ({
        id: m.user.id,
        fullName: m.user.fullName,
        academicLevel: m.user.academicLevel,
        researchInterests: m.user.researchInterests,
        skillTags: m.user.skillTags,
        role: m.user.role,
        score: m.score,
      }));

    res.json({ matches });
  } catch (error) {
    next(error);
  }
});

export const matchingRouter = router;

