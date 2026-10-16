import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const AuthResponseSchema = z.object({
  user: UserProfileSchema,
  accessToken: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
