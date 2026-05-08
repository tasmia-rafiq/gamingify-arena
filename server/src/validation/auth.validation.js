import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full Name must be at least 2 characters long.")
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .trim(),
  email: z.string().email("Invalid email format."),
  password: z
    .string()
    .min(8, "Password must be least 8 characters long.")
    .regex(/[A-Z]/, "At least 1 uppercase required in password.")
    .regex(/[0-9]/, "At least 1 number required in password.")
    .regex(/[^A-Za-z0-9]/, "At least 1 special char required."),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be least 8 characters long."),
});
