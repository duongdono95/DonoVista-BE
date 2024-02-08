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
const INVALID_UPDATED_FIELDS = ['_id', 'boardId', 'ownerId', 'createdAt'];
const createNew = (createColumnRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validate the board
        const board = yield (0, mongodb_1.GET_DB)()
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .findOne({
            _id: new mongodb_2.ObjectId(createColumnRequest.boardId),
        });
        if (!board)
            throw new Error('Creating New Comlumn Error - Board Not Found');
        // create the column
        const createdColumnResult = yield (0, mongodb_1.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).insertOne(createColumnRequest);
        if (!createdColumnResult)
            throw new Error('Creating New Column Error - Insert To Database Failed');
        // update the board
        const newColumn = yield (0, mongodb_1.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).findOne({ _id: createdColumnResult.insertedId });
        yield (0, mongodb_1.GET_DB)()
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_2.ObjectId(createColumnRequest.boardId) }, {
            $push: {
                columns: newColumn,
                columnOrderIds: createdColumnResult.insertedId,
            },
        });
        return createdColumnResult;
    }
    catch (error) {
        throw new Error('Create New Column Failed');
    }
});
const deleteColumnById = (columnId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!columnId)
        throw new Error('Delete Column Error - Column Id is required');
    const db = (0, mongodb_1.GET_DB)();
    const session = yield (0, mongodb_1.START_SESSION)();
    let operationResult = { success: false, message: '' };
    try {
        session.startTransaction();
        const column = yield db.collection(exports.COLUMN_COLLECTION_NAME).findOne({ _id: columnId }, { session });
        if (!column)
            throw new Error('Column not found');
        if (column.cardOrderIds && column.cardOrderIds.length > 0) {
            yield db.collection(cardModel_1.CARD_COLLECTION_NAME).deleteMany({
                _id: {
                    $in: column.cardOrderIds.map((id) => new mongodb_2.ObjectId(id)),
                },
            }, { session });
        }
        const deleteColumnResult = yield db
            .collection(exports.COLUMN_COLLECTION_NAME)
            .deleteOne({ _id: columnId }, { session });
        if (deleteColumnResult.deletedCount === 0) {
            throw new Error('Delete Column Error - Column Not Found');
        }
        yield db
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .updateOne({ _id: boardId }, { $pull: { columnOrderIds: columnId, columns: columnId } }, { session });
        operationResult = { success: true, message: 'Column deleted successfully' };
        yield session.commitTransaction();
        return operationResult;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new Error('Delete Column Failed');
    }
    finally {
        yield session.endSession();
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
            .findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, { $set: updateColumnRequest }, { returnDocument: 'after' });
        if (!columnUpdateResult)
            throw new Error('Update Column Failed');
        const board = yield boardModel_1.boardModel.findOneById(new mongodb_2.ObjectId(columnUpdateResult.boardId));
        if (!board)
            throw new Error('Update Column Failed - Board Not Found');
        const updatedBoard = board.columns.map((column) => (column._id.toString() === columnUpdateResult._id.toString() ? columnUpdateResult : column));
        const updatedBoardResult = yield (0, mongodb_1.GET_DB)().collection(boardModel_1.BOARD_COLLECTION_NAME).findOneAndUpdate({
            _id: new mongodb_2.ObjectId(columnUpdateResult.boardId),
        }, {
            $set: {
                columns: updatedBoard,
            },
        }, { returnDocument: 'after'
        });
        console.log(updatedBoard);
        console.log(updatedBoardResult);
        return columnUpdateResult;
    }
    catch (error) { }
});
exports.columnModel = {
    createNew,
    COLUMN_COLLECTION_NAME: exports.COLUMN_COLLECTION_NAME,
    deleteColumnById,
    updateColumnById,
};
