import { Hono } from "hono";
import { auth } from "../../config/better-auth.config";

const authRoutes = new Hono()
  // Better Auth handles these automatically
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default authRoutes;