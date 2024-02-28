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
exports.boardModel = exports.INVALID_UPDATED_FIELDS = exports.BOARD_COLLECTION_NAME = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../config/mongodb");
const columnModel_1 = require("./columnModel");
const cardModel_1 = require("./cardModel");
exports.BOARD_COLLECTION_NAME = 'boards';
exports.INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const createNew = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateUser = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).find({ _id: new mongodb_1.ObjectId(req.ownerId) });
        if (!validateUser)
            throw new Error('User not found');
        const newBoard = yield (0, mongodb_2.GET_DB)().collection('boards').insertOne(req);
        if (!newBoard.insertedId)
            throw new Error('Create New Board failed');
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: newBoard.insertedId
        };
    }
    catch (error) {
        throw error;
    }
});
const allBoards = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).find({ ownerId: userId }).toArray();
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: boards
        };
    }
    catch (error) {
        throw error;
    }
});
const getBoard = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).findOne({ _id: boardId });
        if (!boards)
            throw new Error('Board not found');
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: boards
        };
    }
    catch (error) {
        throw error;
    }
});
const updateBoard = (updatedBoard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).findOneAndUpdate({ _id: new mongodb_1.ObjectId(updatedBoard._id) }, { $set: Object.assign(Object.assign({}, updatedBoard), { updatedAt: new Date().toString() }) }, { returnDocument: 'after' });
        if (!result)
            throw new Error('Board not found');
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: result
        };
    }
    catch (error) {
        throw error;
    }
});
const deleteBoard = (board) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (board.columnOrderIds && board.columnOrderIds.length > 0) {
            const columns = yield (0, mongodb_2.GET_DB)()
                .collection(columnModel_1.COLUMN_COLLECTION_NAME)
                .find({
                _id: {
                    $in: board.columnOrderIds.map((id) => new mongodb_1.ObjectId(id)),
                },
            })
                .toArray();
            const allCardIds = columns.reduce((acc, column) => {
                if (column.cardOrderIds && column.cardOrderIds.length > 0) {
                    const cardIds = column.cardOrderIds.map((id) => new mongodb_1.ObjectId(id));
                    return acc.concat(cardIds);
                }
                return acc;
            }, []);
            if (allCardIds.length > 0) {
                yield (0, mongodb_2.GET_DB)().collection(cardModel_1.CARD_COLLECTION_NAME).deleteMany({
                    _id: { $in: allCardIds },
                });
            }
            yield (0, mongodb_2.GET_DB)().collection(columnModel_1.COLUMN_COLLECTION_NAME).deleteMany({
                _id: {
                    $in: board.columnOrderIds.map((id) => new mongodb_1.ObjectId(id)),
                },
            });
        }
        const result = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).deleteOne({ _id: new mongodb_1.ObjectId(board._id) });
        return result;
    }
    catch (error) {
        throw error;
    }
});
const aggregateColumn = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardColumns = yield (0, mongodb_2.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(boardId),
                    _destroy: false,
                },
            },
            {
                $lookup: {
                    from: columnModel_1.COLUMN_COLLECTION_NAME,
                    let: { boardId: { $toString: '$_id' } },
                    pipeline: [{ $match: { $expr: { $eq: ['$boardId', '$$boardId'] } } }],
                    as: 'columns',
                },
            },
        ])
            .toArray();
        if (!boardColumns[0])
            throw new Error('No Column was found');
        const updateBoardResult = yield (0, mongodb_2.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_1.ObjectId(boardId) }, { $set: { columns: boardColumns[0].columns } });
        if (updateBoardResult.modifiedCount === 0)
            throw new Error('Update Board Failed');
        return {
            code: 200,
            message: 'Update Board Columns Success',
            data: boardColumns[0],
        };
    }
    catch (error) {
        throw new Error('Get Board Failed');
    }
});
exports.boardModel = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard
};
