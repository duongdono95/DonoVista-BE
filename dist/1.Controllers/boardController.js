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
exports.boardController = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const boardService_1 = require("../2.Services/boardService");
const mongodb_1 = require("mongodb");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedReq = generalTypes_1.BoardSchema.omit({ _id: true }).safeParse(req.body);
        if (!validatedReq.success)
            throw new Error(validatedReq.error.errors[0].message);
        const result = yield boardService_1.boardService.createNew(validatedReq.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Created Board successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
const allBoards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        if (!userId)
            throw new Error('User Id is required');
        const result = yield boardService_1.boardService.allBoards(userId);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Fetched All Board successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
const getBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardId = req.params.id;
        const result = yield boardService_1.boardService.getBoard(new mongodb_1.ObjectId(boardId));
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Fetched Board successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
const updateBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedBoard = generalTypes_1.BoardSchema.safeParse(req.body);
        if (!validatedBoard.success)
            throw new Error(validatedBoard.error.errors[0].message);
        const result = yield boardService_1.boardService.updateBoard(validatedBoard.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Board updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardId = req.params.id;
        const result = yield boardService_1.boardService.deleteBoard(boardId);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Board deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
const duplicate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newColumn = req.body;
        if (!newColumn)
            throw new Error('Missing required field');
        const result = yield boardService_1.boardService.duplicate(newColumn);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Board deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.boardController = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard,
    duplicate,
};
