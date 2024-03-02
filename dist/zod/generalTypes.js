"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownSchema = exports.userSchema = exports.ValidateSignInForm = exports.ValidateSignUpForm = exports.BoardSchema = exports.ColumnSchema = exports.CardSchema = exports.VisibilityTypeEnum = exports.GUEST_ID = void 0;
const zod_1 = require("zod");
exports.GUEST_ID = 'guestId';
var VisibilityTypeEnum;
(function (VisibilityTypeEnum) {
    VisibilityTypeEnum["Private"] = "private";
    VisibilityTypeEnum["Public"] = "public";
    VisibilityTypeEnum["OnlyMe"] = "only_me";
})(VisibilityTypeEnum || (exports.VisibilityTypeEnum = VisibilityTypeEnum = {}));
// --------------------------CARD-------------------------
exports.CardSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    id: zod_1.z.string(),
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal(exports.GUEST_ID)]).default(exports.GUEST_ID),
    columnId: zod_1.z.string(),
    boardId: zod_1.z.string(),
    imgUrl: zod_1.z.string().nullable().optional(),
    title: zod_1.z.string().min(3).max(50).trim(),
    markdown: zod_1.z.string().nullable().optional(),
    createdAt: zod_1.z.string().optional().default(new Date().toString()),
    updatedAt: zod_1.z.string().optional().nullable().default(null),
    _destroy: zod_1.z.boolean().optional().default(false),
});
// --------------------------COLUMN-------------------------
exports.ColumnSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    id: zod_1.z.string(),
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal(exports.GUEST_ID)]).default(exports.GUEST_ID),
    boardId: zod_1.z.string(),
    title: zod_1.z.string().min(3).max(50).trim(),
    cards: zod_1.z.array(exports.CardSchema).default([]),
    cardOrderIds: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.string().optional().default(new Date().toString()),
    updatedAt: zod_1.z.string().optional().nullable().default(null),
    _destroy: zod_1.z.boolean().optional().default(false),
});
// --------------------------BOARD-------------------------
exports.BoardSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    id: zod_1.z.string(),
    ownerId: zod_1.z.union([zod_1.z.string(), zod_1.z.literal(exports.GUEST_ID)]).default(exports.GUEST_ID),
    title: zod_1.z.string().min(3).max(50).trim(),
    description: zod_1.z.string().min(3).max(255).trim().optional(),
    visibilityType: zod_1.z.nativeEnum(VisibilityTypeEnum).default(VisibilityTypeEnum.Private),
    slug: zod_1.z.string().default('').default(''),
    memberIds: zod_1.z.array(zod_1.z.string()).default([]),
    columns: zod_1.z.array(exports.ColumnSchema).default([]),
    columnOrderIds: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.string().optional().default(new Date().toString()),
    updatedAt: zod_1.z.string().optional().nullable().default(null),
    _destroy: zod_1.z.boolean().optional().default(false),
});
// --------------------------Auth-------------------------
exports.ValidateSignUpForm = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email' }),
    password: zod_1.z
        .string()
        .min(6, { message: 'Password must be between 6 and 50 characters' })
        .max(50, { message: 'Password must be between 6 and 50 characters' }),
    firstName: zod_1.z
        .string()
        .min(3, { message: 'First Name must be between 3 and 50 characters' })
        .max(50, { message: 'First Name must be between 3 and 50 characters' }),
    lastName: zod_1.z
        .string()
        .min(3, { message: 'Last Name must be between 3 and 50 characters' })
        .max(50, { message: 'Last Name must be between 3 and 50 characters' }),
});
exports.ValidateSignInForm = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email' }),
    password: zod_1.z
        .string()
        .min(6, { message: 'Password must be between 6 and 50 characters' })
        .max(50, { message: 'Password must be between 6 and 50 characters' }),
});
exports.userSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    id: zod_1.z.string(),
    firstName: zod_1.z.string().min(3).max(50),
    lastName: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(50),
    createdAt: zod_1.z.string().optional().default(new Date().toString()),
    updatedAt: zod_1.z.string().optional().nullable().default(null),
});
// -------------------------- Markdown -------------------------
exports.markdownSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    cardId: zod_1.z.string(),
    content: zod_1.z.string(),
    createdAt: zod_1.z.string().optional().default(new Date().toString()),
    updatedAt: zod_1.z.string().optional().nullable().default(null),
    _destroy: zod_1.z.boolean().optional().default(false),
});
