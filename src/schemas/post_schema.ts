import { z } from "zod";

export const postSchema = z.object({
    id: z.number().int().positive(),
    title: z.string(),
    content: z.string(),
    author: z.string(),
});

export const createPostSchema = postSchema.omit({ id: true });
export const updatePostSchema = postSchema.omit({ author: true }).partial();
