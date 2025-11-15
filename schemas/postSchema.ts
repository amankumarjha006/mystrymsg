import { z } from "zod";

// Schema for creating a new post
export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(500, "Post cannot exceed 500 characters")
    .trim(),
});

// Schema for sending a reply to a post
export const replySchema = z.object({
  content: z
    .string()
    .min(1, "Reply content is required")
    .max(300, "Reply cannot exceed 300 characters")
    .trim(),
});

// Schema for toggling accepting messages on a post
export const toggleAcceptingSchema = z.object({
  isAcceptingMessages: z.boolean(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type ReplySchema = z.infer<typeof replySchema>;
export type ToggleAcceptingSchema = z.infer<typeof toggleAcceptingSchema>;