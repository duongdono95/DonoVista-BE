import { z } from 'zod';

export enum VisibilityTypeEnum {
    Private = 'private',
    Public = 'public',
    OnlyMe = 'only_me',
}
export enum ComponentTypeEnum {
    Board = 'board',
    Column = 'column',
    Card = 'card',
}

// ----------------------------------Card --------------------------------------
export const NewCardRequestZod = z.object({
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    boardId: z.string(),
    columnId: z.string(),
    title: z.string().min(3).max(50).trim(),
    componentType: z.literal(ComponentTypeEnum.Card).default(ComponentTypeEnum.Card),
});
export type NewCardRequestType = z.infer<typeof NewCardRequestZod>;

export const CardSchemaZod = NewCardRequestZod.extend({
    description: z.string().min(3).max(255).trim().optional(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable().default(null),
    _destroy: z.boolean().default(false),
});
export type CardSchemaType = z.infer<typeof ColumnSchemaZod>;

// ----------------------------------Column --------------------------------------
export const NewColumnRequestZod = z.object({
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    boardId: z.string(),
    title: z.string().min(3).max(50).trim(),
    componentType: z.literal(ComponentTypeEnum.Column).default(ComponentTypeEnum.Column),
});
export type NewColumnRequestType = z.infer<typeof NewColumnRequestZod>;

export const ColumnSchemaZod = NewColumnRequestZod.extend({
    cards: z.array(CardSchemaZod).default([]),
    cardOrderIds: z.array(z.string()).default([]),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable().default(null),
    _destroy: z.boolean().default(false),
});
export type ColumnSchemaType = z.infer<typeof ColumnSchemaZod>;

// ----------------------------------Board --------------------------------------
export const NewBoardRequestZod = z.object({
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    title: z.string().min(3).max(50).trim(),
    description: z.string().min(3).max(255).trim().optional(),
    visibilityType: z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private),
    componentType: z.literal(ComponentTypeEnum.Board).default(ComponentTypeEnum.Board),
});
export type NewBoardRequestType = z.infer<typeof NewBoardRequestZod>;

export const BoardSchemaZod = NewBoardRequestZod.extend({
    slug: z.string().default(''),
    memberIds: z.array(z.string()).default([]),
    columns: z.array(ColumnSchemaZod).default([]),
    columnOrderIds: z.array(z.string()).default([]),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable().default(null),
    _destroy: z.boolean().default(false),
});
export type BoardSchemaType = z.infer<typeof BoardSchemaZod>;
