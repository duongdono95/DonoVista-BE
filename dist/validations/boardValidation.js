"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardValidation = void 0;
const zod_1 = require("zod");
const generalTypes_1 = require("../types/generalTypes");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = zod_1.z
        .object({
        title: zod_1.z.string().min(3).max(50).trim(),
        description: zod_1.z.string().min(3).max(255).trim().optional(),
        type: zod_1.z.nativeEnum(generalTypes_1.VisibilityTypeEnum).default(generalTypes_1.VisibilityTypeEnum.Private).optional(),
    })
        .strict();
    try {
        yield condition.safeParseAsync(req.body);
        next();
    }
    catch (error) {
        console.log(error);
    }
});
exports.boardValidation = {
    createNew,
};
