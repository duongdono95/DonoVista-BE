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

export const CardSchemaZod = z.object({
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    boardId: z.string(),
    columnId: z.string(),
    title: z.string().min(3).max(50).trim(),
    componentType: z.literal(ComponentTypeEnum.Card).default(ComponentTypeEnum.Card),
    description: z.string().min(3).max(255).trim().optional(),
    createdAt: z.string().default(() => new Date().toString()),
    updatedAt: z.string().nullable().default(null),
    _destroy: z.boolean().default(false),
});
export const CardSchemaZodWithID = z.object({
    _id: z.string(),
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    boardId: z.string(),
    columnId: z.string(),
    title: z.string().min(3).max(50).trim(),
    componentType: z.literal(ComponentTypeEnum.Card).default(ComponentTypeEnum.Card),
    description: z.string().min(3).max(255).trim().optional(),
    createdAt: z.string().default(() => new Date().toString()),
    updatedAt: z.string().nullable().default(null),
    _destroy: z.boolean().default(false),
});
// ----------------------------------Column --------------------------------------

export const ColumnSchemaZod = z.object({
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    boardId: z.string(),
    title: z.string().min(3).max(50).trim(),
    componentType: z.literal(ComponentTypeEnum.Column).default(ComponentTypeEnum.Column),
    cards: z.array(CardSchemaZod).default([]),
    cardOrderIds: z.array(z.string()).default([]),
    createdAt: z.string().default(() => new Date().toString()),
    updatedAt: z.string().nullable().default(null),
    _destroy: z.boolean().default(false),
});
export const ColumnSchemaZodWithId = z.object({
    _id: z.string(),
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    boardId: z.string(),
    title: z.string().min(3).max(50).trim(),
    componentType: z.literal(ComponentTypeEnum.Column).default(ComponentTypeEnum.Column),
    cards: z.array(CardSchemaZod).default([]),
    cardOrderIds: z.array(z.string()).default([]),
    createdAt: z.string().default(() => new Date().toString()),
    updatedAt: z.string().nullable().default(null),
    _destroy: z.boolean().default(false),
});

// ----------------------------------Board --------------------------------------

export const BoardSchemaZod = z.object({
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    title: z.string().min(3).max(50).trim(),
    description: z.string().min(3).max(255).trim().optional(),
    visibilityType: z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private),
    componentType: z.literal(ComponentTypeEnum.Board).default(ComponentTypeEnum.Board),
    slug: z.string().default(''),
    memberIds: z.array(z.string()).default([]),
    columns: z.array(ColumnSchemaZodWithId).default([]),
    columnOrderIds: z.array(z.string()).default([]),
    createdAt: z.string().default(() => new Date().toString()),
    updatedAt: z.string().nullable().default(null),
    _destroy: z.boolean().default(false),
});
export const BoardSchemaZodWithId = z.object({
    _id: z.string(),
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
    title: z.string().min(3).max(50).trim(),
    description: z.string().min(3).max(255).trim().optional(),
    visibilityType: z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private),
    componentType: z.literal(ComponentTypeEnum.Board).default(ComponentTypeEnum.Board),
    slug: z.string().default(''),
    memberIds: z.array(z.string()).default([]),
    columns: z.array(ColumnSchemaZodWithId).default([]),
    columnOrderIds: z.array(z.string()).default([]),
    createdAt: z.string().default(() => new Date().toString()),
    updatedAt: z.string().nullable().default(null),
    _destroy: z.boolean().default(false),
});