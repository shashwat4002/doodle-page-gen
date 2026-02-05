import express from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validateRequest.js";
import { notifyUser } from "../services/notifications.js";

const router = express.Router();

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  field: z.string().optional(),
  objective: z.string().optional(),
  proposalUrl: z.string().url().optional(),
});

const updateStageSchema = z.object({
  stage: z.enum([
    "EXPLORATION",
    "TOPIC_DISCOVERY",
    "LITERATURE_REVIEW",
    "METHODOLOGY",
    "EXECUTION",
    "DOCUMENTATION",
    "PUBLICATION",
  ]),
  completion: z.number().min(0).max(100),
  milestoneTitle: z.string().optional(),
  milestoneDueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

router.post(
  "/",
  authenticate,
  validateBody(createProjectSchema),
  async (req, res, next) => {
    try {
      const { title, description, field, objective, proposalUrl } = req.body;

      const project = await prisma.project.create({
        data: {
          title,
          description,
          field,
          objective,
          ownerId: req.user.id,
          // Auto Pipeline Generation
          stages: {
            create: [
              { stage: "EXPLORATION", completion: 0 },
              { stage: "TOPIC_DISCOVERY", completion: 0 },
              { stage: "LITERATURE_REVIEW", completion: 0 },
              { stage: "METHODOLOGY", completion: 0 },
              { stage: "EXECUTION", completion: 0 },
              { stage: "DOCUMENTATION", completion: 0 },
              { stage: "PUBLICATION", completion: 0 },
            ],
          },
          ...(proposalUrl && {
            documents: {
              create: {
                name: "Research Proposal",
                url: proposalUrl,
                fileType: "PDF",
              },
            },
          }),
        },
        include: {
          stages: true,
        },
      });

      res.status(201).json({ project });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/", authenticate, async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.id },
      include: {
        stages: true,
      },
    });
    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:projectId/stages",
  authenticate,
  validateBody(updateStageSchema),
  async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const { stage, completion, milestoneTitle, milestoneDueDate, notes } =
        req.body;

      const project = await prisma.project.findFirst({
        where: { id: projectId, ownerId: req.user.id },
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const stageProgress = await prisma.researchStageProgress.upsert({
        where: {
          projectId_stage: {
            projectId,
            stage,
          },
        },
        update: {
          completion,
          milestoneTitle,
          milestoneDueDate: milestoneDueDate
            ? new Date(milestoneDueDate)
            : null,
          notes,
        },
        create: {
          projectId,
          stage,
          completion,
          milestoneTitle,
          milestoneDueDate: milestoneDueDate
            ? new Date(milestoneDueDate)
            : null,
          notes,
        },
      });

      await prisma.project.update({
        where: { id: projectId },
        data: { currentStage: stage },
      });

      if (completion === 100) {
        await notifyUser(
          project.ownerId,
          "MILESTONE_COMPLETED",
          `You completed the "${stage}" stage for "${project.title}".`,
          {
            projectId,
            stage,
          },
        );
      }

      res.json({ stage: stageProgress });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/:projectId", authenticate, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId: req.user.id },
      include: {
        stages: true,
        updates: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        documents: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

export const projectsRouter = router;

