import { db } from "../db"
import * as schema from "../db/schema"
import { v4 as uuid } from "uuid";
import { type CreateChoicesInput } from "../db/schema/quiz-admin-schema"

export const createChoices = async (inp: CreateChoicesInput) => {
    const choice = await db.insert(schema.quizChoices)
        .values({
            itemId: inp.itemId,
            content: inp.content,
            isCorrect: inp.isCorrect
        })
        .returning()
    //เวลา drizzle return มัน return เป็น array เลยต้องเข้าถึง indexตัวแรกเพื่อให้เป็น object
    //เวลา drizzle return มันเป็น array เลยใช้ [] เข้าถึง indexที่0 แต่พอมันเข้าถึงแล้วมันคือ object
    console.log(choice)
    return choice
}