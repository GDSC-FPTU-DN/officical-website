import { ROLE } from '@prisma/client';
import { z } from 'zod';

export const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
export const REGEX_EMAIL = /^\S+@\S+\.\S+$/; // Email

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(REGEX_PASSWORD, 'Password must contain at least 8 characters, one uppercase, one lowercase and one number'),
});
export const RegisterSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z
    .string()
    .regex(REGEX_PASSWORD, 'Password must contain at least 8 characters, one uppercase, one lowercase and one number'),
  role: z.nativeEnum(ROLE),
  image: z.string().url().optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
