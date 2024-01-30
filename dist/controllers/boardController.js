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
const http_status_codes_1 = require("http-status-codes");
const boardService_1 = require("../services/boardService");
const formatter_1 = require("../utils/formatter");
const getAllBoards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield boardService_1.boardService.getAllBoards();
        if (!boards)
            res.status(200).json({ message: 'No Board was found' });
        return res.status(200).json({
            code: 200,
            message: 'Get All Boards Successfully',
            data: boards,
        });
    }
    catch (error) {
        next(error);
    }
});
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedBoard = yield generalTypes_1.NewBoardRequestZod.safeParseAsync(req.body);
        if (!validatedBoard.success) {
            return res.status(200).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Request Creating New Board Validation Failed',
                errors: validatedBoard.error.toString(),
            });
        }
        const createdBoard = yield boardService_1.boardService.createNew(validatedBoard.data);
        res.status(200).json({
            code: 200,
            message: 'Created New Board Successfully',
            data: createdBoard,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateBoardById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardId = req.params.id;
        const requestedBoard = Object.assign(Object.assign({}, req.body), { slug: (0, formatter_1.slugify)(req.body.title) });
        const validatedBoard = yield generalTypes_1.NewBoardRequestZod.safeParseAsync(requestedBoard);
        if (!validatedBoard.success) {
            return res.status(200).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Request Creating New Board Validation Failed',
                errors: validatedBoard.error.toString(),
            });
        }
        const updatedBoard = yield boardService_1.boardService.updateBoardById(boardId, validatedBoard.data);
        if (!updatedBoard)
            throw new Error('Update Board Failed');
        res.status(200).json({
            code: 200,
            message: 'Updated Board Successfully',
            data: updatedBoard,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.boardController = {
    getAllBoards,
    createNew,
    updateBoardById
};
