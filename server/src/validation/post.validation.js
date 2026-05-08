import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5).max(150),
  summary: z.string().min(10).max(300),
  content: z.string().min(50),
  category: z.enum(["PC", "Console", "Mobile", "Esports", "Reviews"]),
});