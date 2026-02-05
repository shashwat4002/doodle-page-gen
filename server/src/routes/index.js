import express from "express";
import { authRouter } from "./auth.js";
import { usersRouter } from "./users.js";
import { projectsRouter } from "./projects.js";
import { communityRouter } from "./community.js";
import { resourcesRouter } from "./resources.js";
import { matchingRouter } from "./matching.js";
import { notificationsRouter } from "./notifications.js";
import { adminRouter } from "./admin.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/projects", projectsRouter);
router.use("/community", communityRouter);
router.use("/resources", resourcesRouter);
router.use("/matching", matchingRouter);
router.use("/notifications", notificationsRouter);
router.use("/admin", adminRouter);

export const apiRouter = router;

