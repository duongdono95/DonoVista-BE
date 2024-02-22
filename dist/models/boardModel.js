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
exports.boardModel = exports.BOARD_COLLECTION_NAME = void 0;
const mongodb_1 = require("../config/mongodb");
const mongodb_2 = require("mongodb");
const columnModel_1 = require("./columnModel");
const cardModel_1 = require("./cardModel");
const userModel_1 = require("./userModel");
exports.BOARD_COLLECTION_NAME = 'boards';
const INVALID_UPDATED_FIELDS = ['_id', 'ownerId', 'createdAt'];
const getAllBoards = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, mongodb_1.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .find({ ownerId: userId })
            .sort({ createdAt: -1 })
            .toArray();
        return result;
    }
    catch (error) {
        throw new Error('Get All Boards Failed');
    }
});
const createNew = (board) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(board);
    try {
        const creatingResult = yield (0, mongodb_1.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).insertOne(board);
        if (!creatingResult.insertedId)
            throw new Error('Create New Board Failed');
        const createdBoard = yield getBoardById(new mongodb_2.ObjectId(creatingResult.insertedId));
        if (!createdBoard)
            throw new Error('Create new board - Created Board not found');
        const updateUser = yield (0, mongodb_1.GET_DB)()
            .collection(userModel_1.USER_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_2.ObjectId(board.ownerId) }, {
            $push: {
                boards: createdBoard,
            },
        });
        if (updateUser.modifiedCount === 0)
            throw new Error('Create new board - Update User Failed');
        return creatingResult;
    }
    catch (error) {
        throw error;
    }
});
const getBoardById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, mongodb_1.GET_DB)().collection(exports.BOARD_COLLECTION_NAME).findOne(id);
        if (!result)
            throw new Error('Board not found');
        return result;
    }
    catch (error) {
        throw new Error('Find required Board By Id Failed');
    }
});
const updateOneById = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.keys(updatedData).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updatedData[key];
            }
        });
        const result = yield (0, mongodb_1.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, { $set: Object.assign(Object.assign({}, updatedData), { updatedAt: new Date().toString() }) }, { returnDocument: 'after' });
        return result;
    }
    catch (error) {
        throw new Error('Update Board Failed');
    }
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, mongodb_1.GET_DB)();
    try {
        const board = yield db.collection(exports.BOARD_COLLECTION_NAME).findOne({ _id: new mongodb_2.ObjectId(id) });
        if (!board)
            throw new Error('Board not found');
        if (board.columnOrderIds && board.columnOrderIds.length > 0) {
            const columns = yield db
                .collection(columnModel_1.COLUMN_COLLECTION_NAME)
                .find({
                _id: {
                    $in: board.columnOrderIds.map((id) => new mongodb_2.ObjectId(id)),
                },
            })
                .toArray();
            const allCardIds = columns.reduce((acc, column) => {
                if (column.cardOrderIds && column.cardOrderIds.length > 0) {
                    const cardIds = column.cardOrderIds.map((id) => new mongodb_2.ObjectId(id));
                    return acc.concat(cardIds);
                }
                return acc;
            }, []);
            if (allCardIds.length > 0) {
                yield db.collection(cardModel_1.CARD_COLLECTION_NAME).deleteMany({
                    _id: { $in: allCardIds },
                });
            }
            yield db.collection(columnModel_1.COLUMN_COLLECTION_NAME).deleteMany({
                _id: {
                    $in: board.columnOrderIds.map((id) => new mongodb_2.ObjectId(id)),
                },
            });
        }
        const result = yield db.collection(exports.BOARD_COLLECTION_NAME).deleteOne({ _id: new mongodb_2.ObjectId(id) });
        return result;
    }
    catch (error) {
        throw new Error('Delete Board Failed');
    }
});
const updateAggregateColumns = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardColumns = yield (0, mongodb_1.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .aggregate([
            {
                $match: {
                    _id: new mongodb_2.ObjectId(boardId),
                    _destroy: false,
                },
            },
            {
                $lookup: {
                    from: columnModel_1.columnModel.COLUMN_COLLECTION_NAME,
                    let: { boardId: { $toString: '$_id' } },
                    pipeline: [{ $match: { $expr: { $eq: ['$boardId', '$$boardId'] } } }],
                    as: 'columns',
                },
            },
        ])
            .toArray();
        if (!boardColumns[0])
            throw new Error('Board not found');
        const updateBoardResult = yield (0, mongodb_1.GET_DB)()
            .collection(exports.BOARD_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_2.ObjectId(boardId) }, { $set: { columns: boardColumns[0].columns } });
        if (updateBoardResult.modifiedCount === 0)
            throw new Error('Update Board Failed');
        return {
            code: 200,
            message: 'Update Board Columns Success',
        };
    }
    catch (error) {
        throw new Error('Get Board Failed');
    }
});
exports.boardModel = {
    createNew,
    getAllBoards,
    updateOneById,
    deleteOneById,
    getBoardById,
    updateAggregateColumns,
};
