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
exports.columnController = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const columnService_1 = require("../2.Services/columnService");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCol = generalTypes_1.ColumnSchema.safeParse(req.body);
        if (!validatedCol.success)
            throw new Error('Validate Column failed');
        const result = yield columnService_1.columnService.createNew(validatedCol.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    }
    catch (error) {
        next(error);
    }
});
const editColumn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCol = generalTypes_1.ColumnSchema.safeParse(req.body);
        if (!validatedCol.success)
            throw new Error('Validate Column failed');
        const result = yield columnService_1.columnService.editColumn(validatedCol.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Update Column Success',
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteColumn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colId = req.params.id;
        const result = yield columnService_1.columnService.deleteColumn(colId);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Delete Column Success',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.columnController = {
    createNew,
    editColumn,
    deleteColumn,
};
