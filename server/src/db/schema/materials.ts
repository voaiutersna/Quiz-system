import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
export const materials = pgTable("materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  // ชนิดเนื้อหา ex "video", "quiz"
  contentType: text("content_type"),
  // URL หรือ path ไปยังไฟล์/วิดีโอ
  contentUrl: text("content_url"),
  displayIndex: integer("display_index"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
