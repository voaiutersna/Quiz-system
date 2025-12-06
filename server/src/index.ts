import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import examRoutes from "./routes/exam"
import quizAdminRouter from "./routes//quiz-admin"
const app = new Hono();

// ==================== Global Middleware ====================

// Security headers
app.use("*", secureHeaders());

// CORS
app.use(
  "*",
  cors({
    origin: process.env.NODE_ENV === "development" 
      ? (origin) => {
          // อนุญาตทุก localhost ใน dev mode
          if (origin?.startsWith("http://localhost:")) {
            return origin;
          }
          return "http://localhost:3001"; // default
        }
      : process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3001"],
    credentials: true,
  })
);

// Logger
app.use("*", logger());

// Pretty JSON (dev only)
if (process.env.NODE_ENV === "development") {
  app.use("*", prettyJSON());
}


// ==================== Routes ====================

// Health check
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (c) => {
  return c.json({ status: "healthy" });
});

// Mount routes
app.route("/", authRoutes);
app.route("/api/users", userRoutes);
app.route("/api/exam", examRoutes)
app.route("/api/admin/quiz", quizAdminRouter)

// ==================== Start Server ====================

const port = parseInt(process.env.PORT || "3000");

console.log(`🚀 Server starting on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};