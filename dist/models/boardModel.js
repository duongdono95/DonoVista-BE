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
exports.boardModel = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const mongodb_1 = require("../config/mongodb");
const errorHandlingMiddleware_1 = require("../middlewares/errorHandlingMiddleware");
const BOARD_COLLECTION_NAME = 'boards';
const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const createNew = (board) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedBoard = generalTypes_1.boardSchemaType.safeParse(board);
    try {
        if (!validatedBoard.success) {
            throw new Error(JSON.stringify({
                message: 'Validate Creating New Board Failed',
                error: validatedBoard.error.errors,
            }));
        }
        const createdBoard = yield (0, mongodb_1.GET_DB)().collection(BOARD_COLLECTION_NAME).insertOne(validatedBoard.data);
        return createdBoard;
    }
    catch (error) {
        (0, errorHandlingMiddleware_1.handleNewError)(error);
    }
});
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, mongodb_1.GET_DB)().collection(BOARD_COLLECTION_NAME).findOne(id);
        return result;
    }
    catch (error) {
        (0, errorHandlingMiddleware_1.handleNewError)(error);
    }
});
const getAllBoards = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, mongodb_1.GET_DB)().collection(BOARD_COLLECTION_NAME).find().toArray();
        return result;
    }
    catch (error) {
        (0, errorHandlingMiddleware_1.handleNewError)(error);
    }
});
exports.boardModel = {
    createNew,
    findOneById,
    getAllBoards,
};
