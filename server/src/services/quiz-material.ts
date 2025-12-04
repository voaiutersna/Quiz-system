import { db } from "../db";
import * as schema from "../db/schema";
import { type CreateMaterialInput } from "../db/schema/quiz-admin-schema"; // import type
import { v4 as uuid } from "uuid";

export const createMaterial = async (input: CreateMaterialInput) => {

  const material = await db.insert(schema.materials)
    .values({
      id: uuid(),
      title: input.title,
      description: input.description ?? null,
    })
    .returning();
  // console.log(res) 
  return material[0];
};


