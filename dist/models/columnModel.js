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
exports.columnModel = exports.COLUMN_COLLECTION_NAME = void 0;
const mongodb_1 = require("../config/mongodb");
const mongodb_2 = require("mongodb");
const boardModel_1 = require("./boardModel");
const cardModel_1 = require("./cardModel");
exports.COLUMN_COLLECTION_NAME = 'columns';
const INVALID_UPDATED_FIELDS = ['_id', 'ownerId', 'createdAt'];
const createNew = (createColumnRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdColumnResult = yield (0, mongodb_1.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).insertOne(createColumnRequest);
        if (!createdColumnResult)
            throw new Error('Creating New Column Error - Insert To Database Failed');
        const updateBoardResult = yield (0, mongodb_1.GET_DB)()
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_2.ObjectId(createColumnRequest.boardId) }, {
            $push: {
                columns: Object.assign({ _id: createdColumnResult.insertedId }, createColumnRequest),
                columnOrderIds: createdColumnResult.insertedId.toString(),
            },
        });
        if (!updateBoardResult.acknowledged)
            throw new Error('Creating New Column Error - Update Board Failed');
        return 'Create New Column Successfully';
    }
    catch (error) {
        throw new Error('Create New Column Failed');
    }
});
const deleteColumnById = (columnId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, mongodb_1.GET_DB)();
    try {
        const column = yield db.collection(exports.COLUMN_COLLECTION_NAME).findOne({ _id: columnId });
        if (!column)
            throw new Error('Column not found');
        if (column.cardOrderIds && column.cardOrderIds.length > 0) {
            yield db.collection(cardModel_1.CARD_COLLECTION_NAME).deleteMany({
                _id: {
                    $in: column.cardOrderIds.map((id) => new mongodb_2.ObjectId(id)),
                },
            });
        }
        const deleteColumnResult = yield db.collection(exports.COLUMN_COLLECTION_NAME).deleteOne({ _id: columnId });
        if (deleteColumnResult.deletedCount === 0) {
            throw new Error('Delete Column Error - Column Not Found');
        }
        const updateBoardColumnsOrderIds = yield (0, mongodb_1.GET_DB)()
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .updateOne({ _id: boardId }, {
            $pull: {
                columnOrderIds: columnId.toString(),
            },
        });
        if (updateBoardColumnsOrderIds.modifiedCount === 0)
            throw new Error('Delete Column failed - Update Board Failed');
        const updateBoardColumns = yield boardModel_1.boardModel.updateAggregateColumns(new mongodb_2.ObjectId(boardId));
        if (updateBoardColumns.code !== 200)
            throw new Error('Delete Column failed - Update Board Failed');
        return 'Delete Column Successfully';
    }
    catch (error) {
        throw new Error('Delete Column Failed');
    }
});
const updateColumnById = (id, updateColumnRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.keys(updateColumnRequest).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updateColumnRequest[key];
            }
        });
        const updateColumnResult = yield (0, mongodb_1.GET_DB)()
            .collection(exports.COLUMN_COLLECTION_NAME)
            .findOneAndUpdate({
            _id: new mongodb_2.ObjectId(id),
        }, {
            $set: Object.assign(Object.assign({}, updateColumnRequest), { updatedAt: new Date().toString() }),
        }, { returnDocument: 'after' });
        yield boardModel_1.boardModel.updateAggregateColumns(new mongodb_2.ObjectId(updateColumnRequest.boardId));
        if (!updateColumnResult)
            throw new Error('Update Column Failed');
        return updateColumnResult;
    }
    catch (error) {
        throw new Error('Update Column failed');
    }
});
const arrangeCards = (startColumn, endColumn, activeCard) => __awaiter(void 0, void 0, void 0, function* () {
    const startColumnId = startColumn._id;
    const endColumnId = endColumn._id;
    const activeCardId = activeCard._id;
    try {
        Object.keys(startColumn).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete startColumn[key];
            }
        });
        Object.keys(endColumn).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete endColumn[key];
            }
        });
        Object.keys(activeCard).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete activeCard[key];
            }
        });
        if (startColumnId !== endColumnId) {
            const test = yield (0, mongodb_1.GET_DB)()
                .collection(exports.COLUMN_COLLECTION_NAME)
                .updateOne({ _id: new mongodb_2.ObjectId(endColumnId) }, {
                $set: {
                    cards: endColumn.cards,
                    cardOrderIds: endColumn.cardOrderIds,
                    updatedAt: new Date().toString(),
                },
            });
            const updateCard = yield (0, mongodb_1.GET_DB)()
                .collection(cardModel_1.CARD_COLLECTION_NAME)
                .findOneAndUpdate({ _id: new mongodb_2.ObjectId(activeCardId) }, {
                $set: Object.assign(Object.assign({}, activeCard), { updatedAt: new Date().toString() }),
            });
        }
        const updateStartedColumn = yield (0, mongodb_1.GET_DB)()
            .collection(exports.COLUMN_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new mongodb_2.ObjectId(startColumnId) }, {
            $set: Object.assign(Object.assign({}, startColumn), { updatedAt: new Date().toString() }),
        });
        const updateBoardResult = yield boardModel_1.boardModel.updateAggregateColumns(new mongodb_2.ObjectId(startColumn.boardId));
        if (updateBoardResult.code !== 200)
            throw new Error('Update Column Failed');
        return { message: 'Update Column Successfully' };
    }
    catch (error) {
        throw error;
    }
});
const duplicateColumn = (validatedRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { _id, ...adjustedRequest } = validatedRequest;
        // const newColumnData = {
        //     _id: new ObjectId(),
        //     ...adjustedRequest,
        //     title: `${adjustedRequest.title} - Copy`,
        //     createdAt: new Date(),
        //     updatedAt: null,
        // };
        // const createdColumnResult = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnData);
        // const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne(new ObjectId(validatedRequest.boardId));
        // if (!board) return '';
        // const updateBoardResult = await GET_DB()
        //     .collection(BOARD_COLLECTION_NAME)
        //     .updateOne(
        //         { _id: new ObjectId(validatedRequest.boardId) },
        //         {
        //             $set: {
        //                 ...board,
        //                 columns: [...board.columns, newColumnData],
        //                 columnOrderIds: [...board.columnOrderIds, createdColumnResult.insertedId.toString()],
        //             },
        //         },
        //     );
        return '';
    }
    catch (error) {
        throw new Error('Duplicate Column Failed');
    }
});
const updateAggregateCards = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cards = yield (0, mongodb_1.GET_DB)()
            .collection(exports.COLUMN_COLLECTION_NAME)
            .aggregate([
            {
                $match: {
                    _id: new mongodb_2.ObjectId(id),
                    _destroy: false,
                },
            },
            {
                $lookup: {
                    from: cardModel_1.CARD_COLLECTION_NAME,
                    let: { columnId: { $toString: '$_id' } },
                    as: 'cards',
                    pipeline: [{ $match: { $expr: { $eq: ['$columnId', '$$columnId'] } } }],
                },
            },
        ])
            .toArray();
        if (!cards[0])
            throw new Error('Column not found');
        const updateColumnResult = yield (0, mongodb_1.GET_DB)()
            .collection(exports.COLUMN_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_2.ObjectId(id) }, { $set: { cards: cards[0].cards } });
        if (updateColumnResult.modifiedCount === 0)
            throw new Error('Update Column Failed');
        return {
            code: 200,
            message: 'Update Column Cards Success',
        };
    }
    catch (error) {
        throw new Error('Get Board Failed');
    }
});
exports.columnModel = {
    COLUMN_COLLECTION_NAME: exports.COLUMN_COLLECTION_NAME,
    createNew,
    deleteColumnById,
    updateColumnById,
    arrangeCards,
    duplicateColumn,
    updateAggregateCards,
};
