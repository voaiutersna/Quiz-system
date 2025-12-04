import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

//import zod validator (type checker)
import { createMaterialSchema ,createSectionSchema } from "../db/schema/quiz-admin-schema"

//import service
import { createMaterial } from "../services/quiz-material"
import { createSection } from "../services/quiz-section"
import { getMaterial } from "../services/quiz-get-material"
import { getMaterialDetail } from "../services/quiz-get-section"
//router
const quizAdminRouter = new Hono();

//(pathURL,validator,function)
quizAdminRouter.post("/material", zValidator("json", createMaterialSchema),
    async(c)=>{
        const body = c.req.valid("json")
        const meterial = await createMaterial(body)
        return c.json({message: true,meterial})
    }
)

quizAdminRouter.post("/section", zValidator("json", createSectionSchema),
    async(c)=>{
        const body = c.req.valid("json")
        const section = await createSection(body)
        return c.json({message: true,section})
    }
)

quizAdminRouter.get("/get-material",
    async(c)=>{
        const res = await getMaterial()
        return c.json({message:"Successfully get data",res})
    }
)

quizAdminRouter.get("/get-section/:id",
    async(c)=>{
        const materialid = c.req.param("id")
        const res = await getMaterialDetail(materialid)
        return c.json({message:"Successfully get data",res})
    }
)


export default quizAdminRouter;