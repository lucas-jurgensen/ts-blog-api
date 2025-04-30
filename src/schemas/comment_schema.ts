import { z } from "zod";

export const commentSchema = z.object({
    content: z.string(),
    author: z.string(),
});

export const updateCommentSchema = commentSchema.omit({ author: true });
