"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardSchemaZod = exports.NewBoardRequestZod = exports.ColumnSchemaZod = exports.NewColumnRequestZod = exports.ComponentTypeEnum = exports.VisibilityTypeEnum = void 0;
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
// ----------------------------------Board --------------------------------------
exports.NewColumnRequestZod = zod_1.z.object({});
exports.ColumnSchemaZod = exports.NewColumnRequestZod.extend({});
// ----------------------------------Board --------------------------------------
exports.NewBoardRequestZod = zod_1.z.object({
    title: zod_1.z.string().min(3).max(50).trim(),
    description: zod_1.z.string().min(3).max(255).trim().optional(),
    visibilityType: zod_1.z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private).optional(),
    componentType: zod_1.z.literal(ComponentTypeEnum.Board),
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal('guestId')]).default('guestId'),
});
exports.BoardSchemaZod = exports.NewBoardRequestZod.extend({
    slug: zod_1.z.string().default(''),
    memberIds: zod_1.z.array(zod_1.z.string()).default([]),
    columnOrderIds: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().nullable().default(null),
    _destroy: zod_1.z.boolean().default(false),
    columns: zod_1.z.array(exports.ColumnSchemaZod).default([]),
});
