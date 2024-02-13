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
exports.columnService = void 0;
const mongodb_1 = require("mongodb");
const columnModel_1 = require("../models/columnModel");
const createNew = (validatedRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.createNew(validatedRequest);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const deleteColumnById = (columnId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.deleteColumnById(new mongodb_1.ObjectId(columnId), new mongodb_1.ObjectId(boardId));
        return result;
    }
    catch (error) {
        throw error;
    }
});
const updateColumnById = (id, validatedRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.updateColumnById(new mongodb_1.ObjectId(id), validatedRequest);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const updateColumnCards = (startColumn, endColumn, activeCard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.updateColumnCards(startColumn, endColumn, activeCard);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const duplicateColumn = (validatedRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.duplicateColumn(validatedRequest);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.columnService = {
    createNew,
    deleteColumnById,
    updateColumnById,
    updateColumnCards,
    duplicateColumn
};
