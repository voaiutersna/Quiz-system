import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

// Error handler

const app = new Hono();

// ==================== Global Middleware ====================

// Security headers
app.use("*", secureHeaders());

// CORS
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
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


// ==================== Start Server ====================

const port = parseInt(process.env.PORT || "3000");

console.log(`🚀 Server starting on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};