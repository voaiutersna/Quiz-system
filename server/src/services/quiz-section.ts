import { db } from "../db"
import * as schema from "../db/schema"
import { v4 as uuid } from "uuid";
import { type CreateSectionInput } from "../db/schema/quiz-admin-schema"
export const createSection  = async (inp: CreateSectionInput ) =>{ //(inp: z.infer<typeof Schema>;) if u use zod object
    const section = await db.insert(schema.quizSections)
    .values({
        materialId:inp.materialId,
        title:inp.title,
        totalScore:inp.totalScore,
        content:inp.content
    })
    .returning();
    return section[0]
}