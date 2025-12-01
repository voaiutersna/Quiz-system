import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
type Variables = {
  user: NonNullable<Awaited<ReturnType<typeof import("../../config/better-auth.config").auth.api.getSession>>["user"]>;
  session: NonNullable<Awaited<ReturnType<typeof import("../../config/better-auth.config").auth.api.getSession>>["session"]>;
};

const userRoutes = new Hono<{ Variables: Variables }>()
  // Get current user profile
  .get("/me", async (c) => {
    const user = c.get("user");
    return c.json({ user });
  })
  
  // Update profile
  .patch(
    "/me",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).max(255).optional(),
        image: z.string().url().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const body = c.req.valid("json");
      
      const updated = await db
        .update(user)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(user.id, user.id))
        .returning();
      
      return c.json({ user: updated[0] });
    }
  )
  
  // Get user by ID
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    
    const user = await db.query.user.findFirst({
      where: eq(user.id, id),
    });
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json({ user });
  })
  
  // Delete account
  .delete("/me", async (c) => {
    const user = c.get("user");
    
    await db.delete(user).where(eq(user.id, user.id));
    
    return c.json({ message: "Account deleted" });
  });

export default userRoutes;