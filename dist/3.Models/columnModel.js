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
exports.columnModel = exports.INVALID_UPDATED_FIELDS = exports.COLUMN_COLLECTION_NAME = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../config/mongodb");
const generalTypes_1 = require("../zod/generalTypes");
const boardModel_1 = require("./boardModel");
const cardModel_1 = require("./cardModel");
exports.COLUMN_COLLECTION_NAME = 'columns';
exports.INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const createNew = (column) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCol = generalTypes_1.ColumnSchema.omit({ _id: true }).safeParse(column);
        if (!validatedCol.success)
            throw new Error('Invalid Column');
        const col = yield (0, mongodb_2.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).insertOne(validatedCol.data);
        if (!col.insertedId)
            throw new Error('Create New Column Failed!');
        const updateBoard = yield (0, mongodb_2.GET_DB)()
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .updateOne({ id: column.boardId }, {
            $push: {
                columns: Object.assign({ _id: col.insertedId }, column),
                columnOrderIds: column.id,
            },
        });
        if (updateBoard.modifiedCount === 0)
            throw new Error('Update Board Failed!');
        return Object.assign(Object.assign({}, column), { _id: col.insertedId });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const editColumn = (column) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCol = generalTypes_1.ColumnSchema.omit({ _id: true }).safeParse(column);
        if (!validatedCol.success)
            throw new Error('Invalid Column');
        const col = yield (0, mongodb_2.GET_DB)()
            .collection(exports.COLUMN_COLLECTION_NAME)
            .findOneAndUpdate({ id: validatedCol.data.id }, {
            $set: Object.assign(Object.assign({}, validatedCol.data), { updatedAt: new Date().toString() }),
        });
        if (!(col === null || col === void 0 ? void 0 : col._id))
            throw new Error('Create New Column Failed!');
        const updatteBoard = yield boardModel_1.boardModel.updateBoardColumns(column.boardId);
        return Object.assign(Object.assign({}, column), { _id: col.insertedId });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const deleteColumn = (columnId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(columnId);
    try {
        const column = yield (0, mongodb_2.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).findOne({ id: columnId });
        if (!column)
            throw new Error('Column not found');
        if (column.cardOrderIds && column.cardOrderIds.length > 0) {
            const result = yield (0, mongodb_2.GET_DB)()
                .collection(cardModel_1.CARD_COLLECTION_NAME)
                .deleteMany({
                id: { $in: column.cardOrderIds },
            });
            if (result.deletedCount === 0)
                throw new Error('Deleted Cards in Column unsucessful');
        }
        const deleteColumn = yield (0, mongodb_2.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).deleteOne({ id: columnId });
        if (deleteColumn.deletedCount === 0)
            throw new Error('Delete Column unsucessful');
        const updateBoard = yield (0, mongodb_2.GET_DB)()
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .updateOne({ id: column.boardId }, {
            $pull: {
                columns: { id: columnId },
                columnOrderIds: columnId,
            },
        });
        if (updateBoard.modifiedCount === 0)
            throw new Error('Delete Column unsucessful');
        return deleteColumn;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const updateColumnCards = (columnId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const column = yield (0, mongodb_2.GET_DB)().collection(exports.COLUMN_COLLECTION_NAME).findOne({ id: columnId });
        if (!column)
            throw new Error('Board not found');
        console.log(column.cardOrderIds);
        if (column.cardOrderIds.length > 0) {
            const cards = yield (0, mongodb_2.GET_DB)()
                .collection(cardModel_1.CARD_COLLECTION_NAME)
                .find({ id: { $in: column.cardOrderIds } })
                .toArray();
            column.cards = cards;
            console.log(cards);
            const updateColumn = yield (0, mongodb_2.GET_DB)()
                .collection(exports.COLUMN_COLLECTION_NAME)
                .updateOne({ _id: new mongodb_1.ObjectId(column._id) }, { $set: column });
            if (updateColumn.modifiedCount === 0)
                throw new Error('Board Update Failed');
            return column;
        }
        return null;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.columnModel = {
    createNew,
    editColumn,
    deleteColumn,
    updateColumnCards,
};
