import express from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validateRequest.js";
import { notifyUser } from "../services/notifications.js";

const router = express.Router();

const createResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  subject: z.string().optional(),
  difficulty: z.string().optional(),
});

router.get("/", authenticate, async (_req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json({ resources });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validateBody(createResourceSchema),
  async (req, res, next) => {
    try {
      const resource = await prisma.resource.create({
        data: req.body,
      });

       const users = await prisma.user.findMany({
         select: { id: true },
       });

       await Promise.all(
         users.map((u) =>
           notifyUser(
             u.id,
             "RESOURCE_RECOMMENDATION",
             `New resource published: ${resource.title}`,
             { resourceId: resource.id },
           ),
         ),
       );

      res.status(201).json({ resource });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/:id/bookmark", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookmark = await prisma.resourceBookmark.upsert({
      where: {
        resourceId_userId: {
          resourceId: id,
          userId: req.user.id,
        },
      },
      update: {},
      create: {
        resourceId: id,
        userId: req.user.id,
      },
    });
    res.json({ bookmark });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/view", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.resourceView.create({
      data: {
        resourceId: id,
        userId: req.user.id,
      },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const resourcesRouter = router;

