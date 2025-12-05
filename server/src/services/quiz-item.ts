import { db } from "../db"
import * as schema from "../db/schema"
import { v4 as uuid } from "uuid";
import { type CreateItemInput } from "../db/schema/quiz-admin-schema"

export const createItem = async (inp: CreateItemInput) => {
    const Item = await db.insert(schema.quizItems)
        .values({
            sectionId: inp.sectionId,
            content: inp.content
        })
        .returning();
    console.log(Item)
    return Item[0]
}