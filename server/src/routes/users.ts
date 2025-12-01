import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { user } from "../db/schema"; // 👈 table ชื่อ user
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.middleware";

// type ข้อมูลที่เก็บใน c.set("user") / c.set("session")
type Variables = {
  user: NonNullable<
    Awaited<
      ReturnType<
        typeof import("../../config/better-auth.config").auth.api.getSession
      >
    >["user"]
  >;
  session: NonNullable<
    Awaited<
      ReturnType<
        typeof import("../../config/better-auth.config").auth.api.getSession
      >
    >["session"]
  >;
};

const userRoutes = new Hono<{ Variables: Variables }>()
  // GET /api/users/me
  .get("/me", requireAuth, async (c) => {
    const currentUser = c.get("user"); // 👈 จาก Better Auth
    return c.json({ user: currentUser });
  })

  // PATCH /api/users/me
  .patch(
    "/me",
    requireAuth,
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).max(255).optional(),
        image: z.string().url().optional(),
      })
    ),
    async (c) => {
      const currentUser = c.get("user");
      const body = c.req.valid("json");

      const updated = await db
        .update(user) // 👈 ใช้ table user
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(user.id, currentUser.id)) // 👈 where ตาม id คนที่ล็อกอิน
        .returning();

      return c.json({ user: updated[0] });
    }
  )

  // GET /api/users/:id
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");

    const found = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!found) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user: found });
  })

  // DELETE /api/users/me
  .delete("/me", requireAuth, async (c) => {
    const currentUser = c.get("user");

    await db.delete(user).where(eq(user.id, currentUser.id));

    return c.json({ message: "Account deleted" });
  });

export default userRoutes;
