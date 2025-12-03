import {pgTable,uuid,text,integer,real,boolean,index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { materials } from "./materials";


export type QuizItemType = "choice" | "short-answer";

// ==================== quizSections ====================

export const quizSections = pgTable("quiz_sections", {
  id: uuid("id").defaultRandom().primaryKey(),

  materialId: uuid("material_id")
    .notNull()
    .references(() => materials.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),

  title: text("title"),
  displayIndex: integer("display_index"),

  // คะแนนเต็มของ section นี้
  totalScore: real("total_score").notNull(),

  // ใช้ทำ section ย่อย (hierarchy) เช่น parent section / child section
  parentId: uuid("parent_id"),

  // อนุญาตสุ่มลำดับคำถามใน section นี้ไหม
  allowShuffle: boolean("allow_shuffle").notNull().default(false),

  // คำอธิบาย / เนื้อหาเสริมของ section เช่น introduction
  content: text("content"),
});

export const quizSectionsRelations = relations(
  quizSections,
  ({ one, many }) => ({
    material: one(materials, {
      fields: [quizSections.materialId],
      references: [materials.id],
    }),
    parentSection: one(quizSections, {
      fields: [quizSections.parentId],
      references: [quizSections.id],
    }),
    items: many(quizItems),
  }),
);

// ==================== quizItems ====================

export const quizItems = pgTable(
  "quiz_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sectionId: uuid("quiz_section_id")
      .notNull()
      .references(() => quizSections.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),

    // เนื้อหาคำถาม เช่น "2 + 2 = ?"
    content: text("content").notNull(),

    displayIndex: integer("display_index"),
  },
  (table) => ({
    idx_quiz_item_section_id: index("idx_quiz_item_section_id").on(
      table.sectionId,
    ),
  }),
);

export const quizItemsRelations = relations(quizItems, ({ one, many }) => ({
  section: one(quizSections, {
    fields: [quizItems.sectionId],
    references: [quizSections.id],
  }),
  choices: many(quizChoices),
}));

// ==================== quizChoices ====================

export const quizChoices = pgTable(
  "quiz_choices",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    itemId: uuid("quiz_item_id")
      .notNull()
      .references(() => quizItems.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),

    // เนื้อหาคำตอบ เช่น "4"
    content: text("content").notNull(),

    // ใช้ union type QuizItemType เพื่อบอกว่าเป็นข้อแบบไหน
    type: text("type").$type<QuizItemType>().notNull(),

    // เป็นคำตอบที่ถูกไหม (ใช้ตอน grading)
    isCorrect: boolean("is_correct").notNull().default(false),

    displayIndex: integer("display_index"),
  },
  (table) => ({
    idx_quiz_choices_item_type: index("idx_quiz_choices_item_type").on(
      table.itemId,
      table.type,
    ),
  }),
);

export const quizChoicesRelations = relations(quizChoices, ({ one }) => ({
  item: one(quizItems, {
    fields: [quizChoices.itemId],
    references: [quizItems.id],
  }),
}));
