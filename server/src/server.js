import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { createRateLimiters } from "./middleware/rateLimit.js";
import { setIO } from "./realtime/socket.js";

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
});

setIO(io);

// Basic security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
const { generalLimiter } = createRateLimiters();
app.use(generalLimiter);

// API routes
app.use("/api", apiRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

// Simple socket.io auth via JWT stored in access_token cookie
import jwt from "jsonwebtoken";

io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, v] = c.trim().split("=");
        return [k, decodeURIComponent(v || "")];
      }),
    );

    const token = cookies.access_token;
    if (!token) return next(new Error("Authentication token missing"));

    const payload = jwt.verify(token, env.JWT_SECRET);
    socket.data.user = payload;
    socket.join(`user:${payload.sub}`);
    next();
  } catch (error) {
    next(new Error("Invalid auth token"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id, "user:", socket.data.user?.sub);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`SochX API server listening on port ${PORT}`);
});

export { io };

