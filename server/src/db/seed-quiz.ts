//quick post test system

import "dotenv/config";
import { db } from "../db";
import { materials, quizSections, quizItems, quizChoices } from "./schema";

async function seedQuiz() {
  console.log("🌱 Seeding quiz data...");

  // กำหนด id เองให้จำง่ายเวลาเทส
  const materialId = "11111111-1111-1111-1111-111111111111";
  const sectionId = "22222222-2222-2222-2222-222222222222";
  const item1Id = "33333333-3333-3333-3333-333333333333";
  const item2Id = "44444444-4444-4444-4444-444444444444";
  const choice1WrongId = "55555555-5555-5555-5555-555555555555";
  const choice1CorrectId = "66666666-6666-6666-6666-666666666666";
  const choice2WrongId = "77777777-7777-7777-7777-777777777777";
  const choice2CorrectId = "88888888-8888-8888-8888-888888888888";



  // 1) material
  await db.insert(materials).values({
    id: materialId,
    title: "Demo Quiz",
    description: "Quiz สำหรับเทส gradeQuizSubmission",
    contentType: "quiz",
    isPublished: true,
  });

  // 2) section
  await db.insert(quizSections).values({
    id: sectionId,
    materialId,
    title: "Part 1",
    totalScore: 10,       // คะแนนเต็มของ section นี้
    displayIndex: 1,
    allowShuffle: false,
  });

  // 3) items
  await db.insert(quizItems).values([
    {
      id: item1Id,
      sectionId,
      content: "2 + 2 = ?",
      displayIndex: 1,
    },
    {
      id: item2Id,
      sectionId,
      content: "เมืองหลวงของประเทศไทยคืออะไร?",
      displayIndex: 2,
    },
  ]);

  // 4) choices
  await db.insert(quizChoices).values([
    // ข้อ 1
    {
      id: choice1WrongId,
      itemId: item1Id,
      content: "3",
      type: "choice",
      isCorrect: false,
      displayIndex: 1,
    },
    {
      id: choice1CorrectId,
      itemId: item1Id,
      content: "4",
      type: "choice",
      isCorrect: true,
      displayIndex: 2,
    },
    // ข้อ 2
    {
      id: choice2WrongId,
      itemId: item2Id,
      content: "Tokyo",
      type: "choice",
      isCorrect: false,
      displayIndex: 1,
    },
    {
      id: choice2CorrectId,
      itemId: item2Id,
      content: "Bangkok",
      type: "choice",
      isCorrect: true,
      displayIndex: 2,
    },
  ]);

  console.log("✅ Seed quiz data complete!");
  console.log("materialId for testing:", materialId);
  console.log("item1Id:", item1Id);
  console.log("item2Id:", item2Id);
}

seedQuiz()
  .catch((err) => {
    console.error("❌ Seed quiz failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
