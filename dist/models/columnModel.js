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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const getColumnById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const column = yield (0, mongodb_1.GET_DB)()
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
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ['$columnId', '$$columnId'] }, { $eq: ['$_destroy', false] }],
                                },
                            },
                        },
                    ],
                    as: 'cards',
                },
            },
        ])
            .toArray();
        const newColumn = column[0];
        updateColumnById(new mongodb_2.ObjectId(newColumn._id), newColumn);
        return newColumn;
    }
    catch (error) {
        throw new Error('Get Column By Id Failed');
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
        const deleteColumnResult = yield db
            .collection(exports.COLUMN_COLLECTION_NAME)
            .deleteOne({ _id: columnId });
        if (deleteColumnResult.deletedCount === 0) {
            throw new Error('Delete Column Error - Column Not Found');
        }
        const updateBoardResult = yield db
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .updateOne({ _id: boardId }, { $pull: { columnOrderIds: columnId.toString(), columns: column } });
        if (!updateBoardResult.acknowledged)
            throw new Error('Delete Column Error - Update Board Failed');
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
        const columnUpdateResult = yield (0, mongodb_1.GET_DB)()
            .collection(exports.COLUMN_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, { $set: Object.assign(Object.assign({}, updateColumnRequest), { updatedAt: new Date().toString() }) }, { returnDocument: 'after' });
        if (!columnUpdateResult)
            throw new Error('Update Column Failed');
        return columnUpdateResult;
    }
    catch (error) { }
});
const updateColumnCards = (startColumn, endColumn, activeCard) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongodb_1.START_SESSION)();
    const startColumnId = startColumn._id;
    const endColumnId = endColumn._id;
    const activeCardId = activeCard._id;
    try {
        session.startTransaction();
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
        if (startColumnId === endColumnId) {
            const test = yield (0, mongodb_1.GET_DB)()
                .collection(exports.COLUMN_COLLECTION_NAME)
                .findOneAndUpdate({ _id: new mongodb_2.ObjectId(startColumnId) }, {
                $set: Object.assign(Object.assign({}, startColumn), { updatedAt: new Date().toString() }),
            }, { session });
        }
        else {
            const updateStartedColumn = yield (0, mongodb_1.GET_DB)()
                .collection(exports.COLUMN_COLLECTION_NAME)
                .findOneAndUpdate({ _id: new mongodb_2.ObjectId(startColumnId) }, {
                $set: Object.assign(Object.assign({}, startColumn), { updatedAt: new Date().toString() }),
            }, { session });
            const updateEndColumn = yield (0, mongodb_1.GET_DB)()
                .collection(exports.COLUMN_COLLECTION_NAME)
                .findOneAndUpdate({ _id: new mongodb_2.ObjectId(endColumnId) }, {
                $set: Object.assign(Object.assign({}, endColumn), { updatedAt: new Date().toString() }),
            }, { session });
            const updateCard = yield (0, mongodb_1.GET_DB)()
                .collection(cardModel_1.CARD_COLLECTION_NAME)
                .findOneAndUpdate({ _id: new mongodb_2.ObjectId(activeCardId) }, {
                $set: Object.assign(Object.assign({}, activeCard), { updatedAt: new Date().toString() }),
            }, { session });
        }
        // boardModel.getBoardById(new ObjectId(endColumn.boardId));
        yield session.commitTransaction();
        return { message: 'Update Column Successfully' };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const duplicateColumn = (validatedRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = validatedRequest, adjustedRequest = __rest(validatedRequest, ["_id"]);
        const newColumnData = Object.assign(Object.assign({ _id: new mongodb_2.ObjectId() }, adjustedRequest), { title: `${adjustedRequest.title} - Copy`, createdAt: new Date(), updatedAt: null });
        if (validatedRequest.cardOrderIds.length === 0 && validatedRequest.cards.length === 0) {
            const updateBoardResult = yield (0, mongodb_1.GET_DB)().collection(boardModel_1.BOARD_COLLECTION_NAME).updateOne({ _id: new mongodb_2.ObjectId(validatedRequest.boardId) }, {
                $push: {
                    columnOrderIds: newColumnData._id.toString(),
                    columns: newColumnData
                },
            });
            const createNewColumnResult = yield (0, mongodb_1.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).insertOne(newColumnData);
            if (!createNewColumnResult.insertedId) {
                throw new Error('Failed to create a new column');
            }
            const test = yield (0, mongodb_1.GET_DB)().collection(boardModel_1.BOARD_COLLECTION_NAME).findOne({ _id: new mongodb_2.ObjectId(validatedRequest.boardId) });
            console.log(test);
            return '';
        }
    }
    catch (error) {
        throw new Error('Duplicate Column Failed');
    }
});
exports.columnModel = {
    COLUMN_COLLECTION_NAME: exports.COLUMN_COLLECTION_NAME,
    createNew,
    getColumnById,
    deleteColumnById,
    updateColumnById,
    updateColumnCards,
    duplicateColumn
};
