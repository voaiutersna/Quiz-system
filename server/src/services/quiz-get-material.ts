import { db } from "../db";
import * as schema from "../db/schema";

export const getMaterial = async () => {
    // const material = await db.query.materials.findMany()
    const material = await db.select().from(schema.materials)
    // console.log(material)
    return material;
};

