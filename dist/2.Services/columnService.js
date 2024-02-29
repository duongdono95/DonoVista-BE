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
const columnModel_1 = require("../3.Models/columnModel");
const createNew = (column) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.createNew(column);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const editColumn = (column) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.editColumn(column);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const deleteColumn = (columnId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield columnModel_1.columnModel.deleteColumn(columnId);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.columnService = {
    createNew,
    editColumn,
    deleteColumn,
};
