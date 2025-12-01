import { createMiddleware } from "hono/factory";
import { auth } from "../../config/better-auth.config";

type AuthVariables = {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  } | null;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  } | null;
};

// Optional authentication (add user to context if logged in)
export const optionalAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    try {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });
      
      c.set("user", session?.user ?? null);
      c.set("session", session?.session ?? null);
    } catch (error) {
      c.set("user", null);
      c.set("session", null);
    }
    
    await next();
  }
);

// Required authentication (throw error if not logged in)
export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    try {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });
      
      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      c.set("user", session.user);
      c.set("session", session.session);
      
      await next();
    } catch (error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }
);

// Role-based authentication
export const requireRole = (roles: string[]) => {
  return createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    // Check role (you need to add role field to user schema)
    // const userRole = user.role;
    // if (!roles.includes(userRole)) {
    //   return c.json({ error: "Forbidden" }, 403);
    // }
    
    await next();
  });
};