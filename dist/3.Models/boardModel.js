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
const generalTypes_1 = require("../zod/generalTypes");
const columnModel_1 = require("./columnModel");
const cardModel_1 = require("./cardModel");
exports.BOARD_COLLECTION_NAME = 'boards';
exports.INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const createNew = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateUser = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).find({ id: req.ownerId });
        if (!validateUser)
            throw new Error('User not found');
        const newBoard = yield (0, mongodb_2.GET_DB)().collection('boards').insertOne(req);
        if (!newBoard.insertedId)
            throw new Error('Create New Board failed');
        return Object.assign(Object.assign({}, req), { _id: newBoard.insertedId });
    }
    catch (error) {
        throw error;
    }
});
const allBoards = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield (0, mongodb_2.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .find({ ownerId: userId })
            .sort({ createdAt: -1 })
            .toArray();
        return boards;
    }
    catch (error) {
        throw error;
    }
});
const getBoard = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const board = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).findOne({ _id: boardId });
        if (!board)
            throw new Error('Board not found');
        return board;
    }
    catch (error) {
        throw error;
    }
});
const updateBoard = (board) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedBoard = generalTypes_1.BoardSchema.omit({ _id: true, createdAt: true }).safeParse(board);
        if (!validatedBoard.success)
            throw new Error('Validated Board Failed');
        const result = yield (0, mongodb_2.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new mongodb_1.ObjectId(board._id) }, { $set: Object.assign(Object.assign({}, validatedBoard.data), { updatedAt: new Date().toString() }) }, { returnDocument: 'after' });
        if (!result)
            throw new Error('Board not found');
        return result;
    }
    catch (error) {
        throw error;
    }
});
const updateBoardColumns = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const board = yield (0, mongodb_2.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).findOne({ id: boardId });
        if (!board)
            throw new Error('Board not found');
        if (board.columnOrderIds.length > 0) {
            const columns = yield (0, mongodb_2.GET_DB)()
                .collection(columnModel_1.COLUMN_COLLECTION_NAME)
                .find({ id: { $in: board.columnOrderIds } })
                .toArray();
            board.columns = columns;
            const updateBoard = yield (0, mongodb_2.GET_DB)()
                .collection(exports.BOARD_COLLECTION_NAME)
                .updateOne({ _id: new mongodb_1.ObjectId(board._id) }, { $set: { columns: columns } });
            if (updateBoard.modifiedCount === 0)
                throw new Error('Board Update Failed');
            return board;
        }
        return null;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const deleteBoard = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const board = yield (0, mongodb_2.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .findOne({ _id: new mongodb_1.ObjectId(boardId) });
        if (!board)
            throw new Error('Board not found');
        if (board.columnOrderIds && board.columnOrderIds.length > 0) {
            const columns = yield (0, mongodb_2.GET_DB)()
                .collection(columnModel_1.COLUMN_COLLECTION_NAME)
                .find({
                id: {
                    $in: board.columnOrderIds,
                },
            })
                .toArray();
            const allCardIds = columns.reduce((acc, column) => {
                if (column.cardOrderIds && column.cardOrderIds.length > 0) {
                    const cardIds = column.cardOrderIds.map((id) => id);
                    return acc.concat(cardIds);
                }
                return acc;
            }, []);
            if (allCardIds.length > 0) {
                yield (0, mongodb_2.GET_DB)()
                    .collection(cardModel_1.CARD_COLLECTION_NAME)
                    .deleteMany({
                    id: { $in: allCardIds },
                });
            }
            yield (0, mongodb_2.GET_DB)()
                .collection(columnModel_1.COLUMN_COLLECTION_NAME)
                .deleteMany({
                id: {
                    $in: board.columnOrderIds,
                },
            });
        }
        const result = yield (0, mongodb_2.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .deleteOne({ _id: new mongodb_1.ObjectId(board._id) });
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
const duplicate = (newColumn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedNewCol = generalTypes_1.ColumnSchema.omit({ _id: true, createdAt: true }).safeParse(newColumn);
        if (!validatedNewCol.success)
            throw new Error('Validated Column Failed');
        const newCol = validatedNewCol.data;
        if (newCol.cards && newCol.cards.length > 0) {
            const insertAllCards = yield (0, mongodb_2.GET_DB)()
                .collection(cardModel_1.CARD_COLLECTION_NAME)
                .insertMany(newCol.cards.map((card) => (Object.assign(Object.assign({}, card), { _id: new mongodb_1.ObjectId() }))));
            if (insertAllCards.insertedCount !== newCol.cards.length)
                throw new Error('Create new Card(s) Failed');
            const insertNewCol = yield (0, mongodb_2.GET_DB)().collection(columnModel_1.COLUMN_COLLECTION_NAME).insertOne(newCol);
            if (!insertNewCol.insertedId)
                throw new Error('Create new Column Failed.');
            const updateBoard = yield (0, mongodb_2.GET_DB)()
                .collection(exports.BOARD_COLLECTION_NAME)
                .updateOne({ id: newCol.boardId }, {
                $push: {
                    columnOrderIds: newCol.id,
                    columns: Object.assign(Object.assign({}, newCol), { _id: new mongodb_1.ObjectId(insertNewCol.insertedId) }),
                },
            });
        }
        return '';
    }
    catch (error) {
        throw error;
    }
});
exports.boardModel = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard,
    aggregateColumn,
    updateBoardColumns,
    duplicate,
};
