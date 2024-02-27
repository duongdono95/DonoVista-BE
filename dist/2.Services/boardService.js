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
const boardModel_1 = require("../3.Models/boardModel");
const createNew = (validatedReq) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield boardModel_1.boardModel.createNew(validatedReq);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const allBoards = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield boardModel_1.boardModel.allBoards(userId);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const getBoard = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield boardModel_1.boardModel.getBoard(boardId);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const updateBoard = (updatedBoard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield boardModel_1.boardModel.updateBoard(updatedBoard);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const deleteBoard = (board) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield boardModel_1.boardModel.deleteBoard(board);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.boardService = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard
};
