import { db } from "../db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
export const getMaterialDetail = async (id:string) => {
    // const material = await db.query.materials.findMany()
    const section = await db.select().from(schema.quizSections).where(eq(schema.quizSections.materialId,id))
    console.log(section)
    return section;
};
