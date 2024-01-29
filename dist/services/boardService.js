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
exports.boardService = void 0;
const formatter_1 = require("../utils/formatter");
const boardModel_1 = require("../models/boardModel");
const createNew = (validatedRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBoard = Object.assign(Object.assign({}, validatedRequest), { slug: (0, formatter_1.slugify)(validatedRequest.title) });
        const createdBoard = yield boardModel_1.boardModel.createNew(newBoard);
        if (!createdBoard)
            throw new Error('Save New Board Failed');
        return yield boardModel_1.boardModel.findOneById(createdBoard.insertedId);
    }
    catch (error) {
        throw error;
    }
});
const getAllBoards = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield boardModel_1.boardModel.getAllBoards();
        return boards;
    }
    catch (error) {
        throw error;
    }
});
exports.boardService = {
    createNew,
    getAllBoards,
};
