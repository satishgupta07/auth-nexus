import { z } from "zod";

// Enforced both client-side (fast feedback) and server-side (never trust the client alone).
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a digit")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const signupSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Enter a valid email"),
    password: passwordSchema,
});

export type SignupInput = z.infer<typeof signupSchema>;
