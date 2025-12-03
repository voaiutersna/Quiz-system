// src/services/quiz.service.ts
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../db/schema";

type Database = typeof db;

// submission: { [itemId]: answerValue }
export const gradeQuizSubmission = async (
  database: Database,
  materialId: string,
  submission: Record<string, string>,
) => {
  // 1) ดึง quiz ทั้งชุดของ material นี้
  const sections = await database.query.quizSections.findMany({
    columns: {
      materialId: false,
      displayIndex: false,
    },
    where: () => eq(schema.quizSections.materialId, materialId),
    with: {
      items: {
        columns: {
          displayIndex: false,
          sectionId: false,
        },
        with: {
          choices: {
            columns: {
              id: true,
              type: true,
              content: true,
              isCorrect: true,
            },
            where: () => and(eq(schema.quizChoices.isCorrect, true)),
          },
        },
      },
    },
  });

  let score = 0;
  let total = 0;

  for (const section of sections) {
    if (section.items.length === 0) {
      total += section.totalScore;
      continue;
    }

    let currentScore = 0;

    for (const item of section.items) {
      const itemId = item.id;

      if (item.choices.length === 0) continue;

      // มีสิทธิ์มีหลายคำตอบที่ถูก (multiple correct)
      for (const choice of item.choices) {
        const correctValue =
          choice.type === "choice"
            ? choice.id                       // MCQ -> เทียบด้วย choice.id
            : choice.content.trim();          // short-answer -> เทียบด้วยข้อความ

        if (submission[itemId] === correctValue) {
          currentScore += 1;                  // ข้อนี้ถูก
          break;                              // พอแล้ว ออกจาก loop choice ของข้อนี้
        }
      }
    }

    // 4) แปลงจำนวนข้อที่ถูกใน section -> คะแนนจริง โดยดูจาก totalScore ของ section
    // ตอนนี้ currentScore = จำนวนข้อที่ถูกใน section นี้
    // section.items.length = จำนวนข้อทั้งหมดใน section
    // เช่น ถูก 3/5, totalScore=10 => (3/5)*10 = 6 คะแนน
    score += (currentScore / section.items.length) * section.totalScore;
    total += section.totalScore;
  }

  // ปัดทศนิยม 2 ตำแหน่ง (เช่น 6.6667 -> 6.67)
  score = parseFloat(score.toFixed(2));

  return { score, total };
};
