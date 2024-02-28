import { z } from 'zod';

export const GUEST_ID = 'guestId';
export enum VisibilityTypeEnum {
  Private = 'private',
  Public = 'public',
  OnlyMe = 'only_me',
}

// --------------------------CARD-------------------------
export const CardSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  ownerId: z.union([z.string(), z.literal(GUEST_ID)]).default(GUEST_ID),
  columnId: z.string(),
  imgUrl: z.string().nullable().optional(),
  title: z.string().min(3).max(50).trim(),
  description: z.string().min(3).max(255).trim().optional(),
  createdAt: z.string().optional().default(new Date().toString()),
  updatedAt: z.string().optional().nullable().default(null),
  _destroy: z.boolean().optional().default(false),
});
export type CardInterface = z.infer<typeof CardSchema>;

// --------------------------COLUMN-------------------------

export const ColumnSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  ownerId: z.union([z.string(), z.literal(GUEST_ID)]).default(GUEST_ID),
  boardId: z.string(),
  title: z.string().min(3).max(50).trim(),
  cards: z.array(CardSchema).default([]),
  cardOrderIds: z.array(z.string()).default([]),
  createdAt: z.string().optional().default(new Date().toString()),
  updatedAt: z.string().optional().nullable().default(null),
  _destroy: z.boolean().optional().default(false),
});
export type ColumnInterface = z.infer<typeof ColumnSchema>;

// --------------------------BOARD-------------------------
export const BoardSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  ownerId: z.union([z.string(), z.literal(GUEST_ID)]).default(GUEST_ID),
  title: z.string().min(3).max(50).trim(),
  description: z.string().min(3).max(255).trim().optional(),
  visibilityType: z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private),
  slug: z.string().default('').default(''),
  memberIds: z.array(z.string()).default([]),
  columns: z.array(ColumnSchema).default([]),
  columnOrderIds: z.array(z.string()).default([]),
  createdAt: z.string().optional().default(new Date().toString()),
  updatedAt: z.string().optional().nullable().default(null),
  _destroy: z.boolean().optional().default(false),
});
export type BoardInterface = z.infer<typeof BoardSchema>;

// --------------------------Auth-------------------------
export const ValidateSignUpForm = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be between 6 and 50 characters' })
    .max(50, { message: 'Password must be between 6 and 50 characters' }),
  firstName: z
    .string()
    .min(3, { message: 'First Name must be between 3 and 50 characters' })
    .max(50, { message: 'First Name must be between 3 and 50 characters' }),
  lastName: z
    .string()
    .min(3, { message: 'Last Name must be between 3 and 50 characters' })
    .max(50, { message: 'Last Name must be between 3 and 50 characters' }),
});
export type SignUpFormInterface = z.infer<typeof ValidateSignUpForm>;

export const ValidateSignInForm = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be between 6 and 50 characters' })
    .max(50, { message: 'Password must be between 6 and 50 characters' }),
});
export type SignInFormInterface = z.infer<typeof ValidateSignInForm>;

export const userSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  createdAt: z.string().optional().default(new Date().toString()),
  updatedAt: z.string().optional().nullable().default(null),
});
export type UserInterface = z.infer<typeof userSchema>;

// -------------------------- Markdown -------------------------
export const markdownSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  cardId: z.string(),
  content: z.string(),
  createdAt: z.string().optional().default(new Date().toString()),
  updatedAt: z.string().optional().nullable().default(null),
  _destroy: z.boolean().optional().default(false),
});
export type MarkdownInterface = z.infer<typeof markdownSchema>;
