import { ObjectId } from 'mongodb';
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
export const columnSchemaType = z.object({});

export const createNewBoardRequestType = z.object({
    title: z.string().min(3).max(50).trim(),
    slug: z.string().default(''),
    description: z.string().min(3).max(255).trim().optional(),
    visibilityType: z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private).optional(),
    componentType: z.literal(ComponentTypeEnum.Board),
    ownerId: z.union([z.string(), z.literal('guestId')]).default('guestId'),
});

export const boardSchemaType = createNewBoardRequestType.extend({
    memberIds: z.array(z.string()).default([]),
    columnOrderIds: z.array(z.string()).default([]),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable().default(null),
    _destroy: z.boolean().default(false),
    columns: z.array(columnSchemaType).default([]),
});
