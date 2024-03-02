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
exports.markdownController = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const markdownService_1 = require("../2.Services/markdownService");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateMarkdown = generalTypes_1.markdownSchema.omit({ _id: true }).safeParse(req.body);
        if (!validateMarkdown.success)
            throw new Error('Markdown Validation failed');
        const result = yield markdownService_1.markdownService.createNew(validateMarkdown.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Markdown successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
const getMarkdown = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            throw new Error('Missing required Field');
        const result = yield markdownService_1.markdownService.getMarkdown(id);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Markdown successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.markdownController = {
    createNew,
    getMarkdown,
};
