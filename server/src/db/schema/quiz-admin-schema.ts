import { z } from "zod";

export const createMaterialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const createSectionSchema = z.object({
  materialId: z.string(),
  title: z.string().min(1),
  totalScore: z.number().positive(),
  content: z.string().optional(),
});

export const createItemSchema = z.object({
  sectionId: z.string(),
  content: z.string().min(1),
});

export const createChoicesSchema = z.object({
  itemId: z.string(),
  content: z.string(),
  isCorrect: z.boolean()
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type CreateChoicesInput = z.infer<typeof createChoicesSchema>;
