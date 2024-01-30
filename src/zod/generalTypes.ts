
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
// ----------------------------------Board --------------------------------------
export const NewColumnRequestZod = z.object({})
export type NewColumnRequestType = z.infer<typeof NewColumnRequestZod>;
export const ColumnSchemaZod = NewColumnRequestZod.extend({})
export type ColumnSchemaType = z.infer<typeof ColumnSchemaZod>;

// ----------------------------------Board --------------------------------------
export const NewBoardRequestZod = z.object({
    title: z.string().min(3).max(50).trim(),
    description: z.string().min(3).max(255).trim().optional(),
    visibilityType: z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private).optional(),
    componentType: z.literal(ComponentTypeEnum.Board),
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
});
export type NewBoardRequestType = z.infer<typeof NewBoardRequestZod>;

export const BoardSchemaZod = NewBoardRequestZod.extend({
    slug: z.string().default(''),
    memberIds: z.array(z.string()).default([]),
    columnOrderIds: z.array(z.string()).default([]),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable().default(null),
    _destroy: z.boolean().default(false),
    columns: z.array(ColumnSchemaZod).default([]),
});
export type BoardSchemaType = z.infer<typeof BoardSchemaZod>;


