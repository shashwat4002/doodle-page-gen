import express from "express";
import { prisma } from "../db/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, requireRole("ADMIN"));

router.get("/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.get("/analytics", async (_req, res, next) => {
  try {
    const [userCount, projectCount, threadCount] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.discussionThread.count(),
    ]);

    res.json({
      users: userCount,
      projects: projectCount,
      threads: threadCount,
    });
  } catch (error) {
    next(error);
  }
});

export const adminRouter = router;

