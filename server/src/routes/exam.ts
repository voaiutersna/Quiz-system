// src/routes/exam.ts
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { gradeQuizSubmission } from "../services/quiz";
import { db } from "../db";
// import { requireAuth } from "@/middleware/auth.middleware"; // ถ้าจะล็อกอินก่อนทำข้อสอบค่อยใส่ทีหลัง

const examRoutes = new Hono();

const submitSchema = z.object({
  materialId: z.string().uuid(),
  // { [itemId]: answerValue }
  answers: z.record(z.string(), z.string()),
});

examRoutes.post(
  "/submit",
  zValidator("json", submitSchema),
  async (c) => {
    const { materialId, answers } = c.req.valid("json");

    const result = await gradeQuizSubmission(db, materialId, answers);

    return c.json(result);
  },
);

export default examRoutes;
