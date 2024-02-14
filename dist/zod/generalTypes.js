"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardSchemaZodWithId = exports.BoardSchemaZod = exports.ColumnSchemaZodWithId = exports.ColumnSchemaZod = exports.CardSchemaZodWithID = exports.CardSchemaZod = exports.ComponentTypeEnum = exports.VisibilityTypeEnum = void 0;
const zod_1 = require("zod");
var VisibilityTypeEnum;
(function (VisibilityTypeEnum) {
    VisibilityTypeEnum["Private"] = "private";
    VisibilityTypeEnum["Public"] = "public";
    VisibilityTypeEnum["OnlyMe"] = "only_me";
})(VisibilityTypeEnum || (exports.VisibilityTypeEnum = VisibilityTypeEnum = {}));
var ComponentTypeEnum;
(function (ComponentTypeEnum) {
    ComponentTypeEnum["Board"] = "board";
    ComponentTypeEnum["Column"] = "column";
    ComponentTypeEnum["Card"] = "card";
})(ComponentTypeEnum || (exports.ComponentTypeEnum = ComponentTypeEnum = {}));
// ----------------------------------Card --------------------------------------
exports.CardSchemaZod = zod_1.z.object({
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal('guestId')]).default('guestId'),
    boardId: zod_1.z.string(),
    columnId: zod_1.z.string(),
    title: zod_1.z.string().min(3).max(50).trim(),
    componentType: zod_1.z.literal(ComponentTypeEnum.Card).default(ComponentTypeEnum.Card),
    description: zod_1.z.string().min(3).max(255).trim().optional(),
    createdAt: zod_1.z.string().default(() => new Date().toString()),
    updatedAt: zod_1.z.string().nullable().default(null),
    _destroy: zod_1.z.boolean().default(false),
});
exports.CardSchemaZodWithID = zod_1.z.object({
    _id: zod_1.z.string(),
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal('guestId')]).default('guestId'),
    boardId: zod_1.z.string(),
    columnId: zod_1.z.string(),
    title: zod_1.z.string().min(3).max(50).trim(),
    componentType: zod_1.z.literal(ComponentTypeEnum.Card).default(ComponentTypeEnum.Card),
    description: zod_1.z.string().min(3).max(255).trim().optional(),
    createdAt: zod_1.z.string().default(() => new Date().toString()),
    updatedAt: zod_1.z.string().nullable().default(null),
    _destroy: zod_1.z.boolean().default(false),
});
// ----------------------------------Column --------------------------------------
exports.ColumnSchemaZod = zod_1.z.object({
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal('guestId')]).default('guestId'),
    boardId: zod_1.z.string(),
    title: zod_1.z.string().min(3).max(50).trim(),
    componentType: zod_1.z.literal(ComponentTypeEnum.Column).default(ComponentTypeEnum.Column),
    cards: zod_1.z.array(exports.CardSchemaZod).default([]),
    cardOrderIds: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.string().default(() => new Date().toString()),
    updatedAt: zod_1.z.string().nullable().default(null),
    _destroy: zod_1.z.boolean().default(false),
});
exports.ColumnSchemaZodWithId = zod_1.z.object({
    _id: zod_1.z.string(),
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal('guestId')]).default('guestId'),
    boardId: zod_1.z.string(),
    title: zod_1.z.string().min(3).max(50).trim(),
    componentType: zod_1.z.literal(ComponentTypeEnum.Column).default(ComponentTypeEnum.Column),
    cards: zod_1.z.array(exports.CardSchemaZod).default([]),
    cardOrderIds: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.string().default(() => new Date().toString()),
    updatedAt: zod_1.z.string().nullable().default(null),
    _destroy: zod_1.z.boolean().default(false),
});
// ----------------------------------Board --------------------------------------
exports.BoardSchemaZod = zod_1.z.object({
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal('guestId')]).default('guestId'),
    title: zod_1.z.string().min(3).max(50).trim(),
    description: zod_1.z.string().min(3).max(255).trim().optional(),
    visibilityType: zod_1.z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private),
    componentType: zod_1.z.literal(ComponentTypeEnum.Board).default(ComponentTypeEnum.Board),
    slug: zod_1.z.string().default(''),
    memberIds: zod_1.z.array(zod_1.z.string()).default([]),
    columns: zod_1.z.array(exports.ColumnSchemaZodWithId).default([]),
    columnOrderIds: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.string().default(() => new Date().toString()),
    updatedAt: zod_1.z.string().nullable().default(null),
    _destroy: zod_1.z.boolean().default(false),
});
exports.BoardSchemaZodWithId = zod_1.z.object({
    _id: zod_1.z.string(),
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal('guestId')]).default('guestId'),
    title: zod_1.z.string().min(3).max(50).trim(),
    description: zod_1.z.string().min(3).max(255).trim().optional(),
    visibilityType: zod_1.z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private),
    componentType: zod_1.z.literal(ComponentTypeEnum.Board).default(ComponentTypeEnum.Board),
    slug: zod_1.z.string().default(''),
    memberIds: zod_1.z.array(zod_1.z.string()).default([]),
    columns: zod_1.z.array(exports.ColumnSchemaZodWithId).default([]),
    columnOrderIds: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.string().default(() => new Date().toString()),
    updatedAt: zod_1.z.string().nullable().default(null),
    _destroy: zod_1.z.boolean().default(false),
});
