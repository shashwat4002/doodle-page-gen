import express from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validateRequest.js";
import { notifyUser } from "../services/notifications.js";

const router = express.Router();

const createThreadSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
});

const createPostSchema = z.object({
  content: z.string().min(1),
  parentId: z.string().optional(),
});

router.get("/threads", authenticate, async (_req, res, next) => {
  try {
    const threads = await prisma.discussionThread.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/threads",
  authenticate,
  validateBody(createThreadSchema),
  async (req, res, next) => {
    try {
      const { title, category } = req.body;
      const thread = await prisma.discussionThread.create({
        data: {
          title,
          category,
          createdById: req.user.id,
        },
      });
      res.status(201).json({ thread });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/threads/:threadId", authenticate, async (req, res, next) => {
  try {
    const { threadId } = req.params;

    const thread = await prisma.discussionThread.findUnique({
      where: { id: threadId },
      include: {
        posts: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.json({ thread });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/threads/:threadId/posts",
  authenticate,
  validateBody(createPostSchema),
  async (req, res, next) => {
    try {
      const { threadId } = req.params;
      const { content, parentId } = req.body;

      const post = await prisma.discussionPost.create({
        data: {
          threadId,
          authorId: req.user.id,
          parentId: parentId ?? null,
          content,
        },
      });

      await prisma.discussionThread.update({
        where: { id: threadId },
        data: { updatedAt: new Date() },
      });

      if (parentId) {
        const parentPost = await prisma.discussionPost.findUnique({
          where: { id: parentId },
          include: {
            author: true,
            thread: true,
          },
        });

        if (parentPost && parentPost.authorId !== req.user.id) {
          await notifyUser(
            parentPost.authorId,
            "COMMUNITY_REPLY",
            `${parentPost.thread.title}: someone replied to your post.`,
            {
              threadId,
              postId: post.id,
            },
          );
        }
      }

      res.status(201).json({ post });
    } catch (error) {
      next(error);
    }
  },
);

export const communityRouter = router;

