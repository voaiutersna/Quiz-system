import { db } from "../db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
export const getSectionDetail = async (id:string) => {
    // const material = await db.query.materials.findMany()
    const section = await db.select().from(schema.quizSections).where(eq(schema.quizSections.id,id))
    const quizItems = await db.select().from(schema.quizItems).where(eq(schema.quizItems.sectionId,id))
    // console.log(section)
    const response = {section,quizItems}
    return response;
};
