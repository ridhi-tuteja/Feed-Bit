import {z} from "zod";

export const messageSchema=z.object(
    {
        content:z
            .string()
            .min(10,"Message must contain atleast 10 characters")
            .max(300,"Message must contain atmost 300 characters")
    }
)