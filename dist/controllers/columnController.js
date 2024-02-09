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
exports.columnController = exports.updateColumnById = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const columnService_1 = require("../services/columnService");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = yield generalTypes_1.ColumnSchemaZod.safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New Column Request Failed');
        }
        const createdColumn = yield columnService_1.columnService.createNew(validateRequest.data);
        res.status(200).json({
            code: 200,
            message: 'Created New Column Successfully',
            data: createdColumn,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteColumnById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletionResult = yield columnService_1.columnService.deleteColumnById(req.body.columnId, req.body.boardId);
        res.status(200).json({
            code: 200,
            message: 'Deleted Column Successfully',
            data: deletionResult,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateColumnById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = yield generalTypes_1.ColumnSchemaZod.safeParseAsync(req.body);
        if (!validateRequest.success)
            throw new Error('Validate Update Column Request Failed');
        const result = yield columnService_1.columnService.updateColumnById(req.params.id, validateRequest.data);
        if (!result)
            throw new Error('Update Column Failed');
        res.status(200).json({
            code: 200,
            message: 'Updated Column Successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateColumnById = updateColumnById;
const updateColumnInBulk = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        if (!req.body)
            throw new Error('Update Card In Bulk Request missing required fields');
        const validatedRequest = {
            originalColumn: yield generalTypes_1.ColumnSchemaZodWithId.safeParseAsync(req.body.originalColumn),
            overColumn: yield generalTypes_1.ColumnSchemaZodWithId.safeParseAsync(req.body.overColumn),
        };
        if (!validatedRequest.originalColumn.success || !validatedRequest.overColumn.success)
            throw new Error('Validate Update Card In Bulk Request Failed');
        console.log(validatedRequest.originalColumn.data, validatedRequest.overColumn.data);
        const result = yield columnService_1.columnService.updateColumnInBulk(validatedRequest.originalColumn.data, validatedRequest.overColumn.data);
        if (!result)
            throw new Error('Update Card In Bulk Failed');
        res.status(200).json({
            code: 200,
            message: 'Update Card In Bulk Successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.columnController = {
    createNew,
    deleteColumnById,
    updateColumnById: exports.updateColumnById,
    updateColumnInBulk
};
