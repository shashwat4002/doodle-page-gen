import express from "express";
import { prisma } from "../db/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/read", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const notificationsRouter = router;

