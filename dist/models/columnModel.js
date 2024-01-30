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
exports.columnModel = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const mongodb_1 = require("../config/mongodb");
const mongodb_2 = require("mongodb");
const boardModel_1 = require("./boardModel");
const COLUMN_COLLECTION_NAME = 'columns';
const INVALID_UPDATED_FIELDS = ['_id', 'boardId', 'ownerId', 'createdAt'];
const createNew = (createColumnRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = generalTypes_1.ColumnSchemaZod.safeParse(createColumnRequest);
    if (!validatedRequest.success) {
        throw new Error('Validate Add New Column To Database Failed');
    }
    try {
        // validate the board
        const board = yield (0, mongodb_1.GET_DB)().collection(boardModel_1.BOARD_COLLECTION_NAME).findOne({
            _id: new mongodb_2.ObjectId(createColumnRequest.boardId),
        });
        if (!board)
            throw new Error('Creating New Comlumn Error - Board Not Found');
        // create the column
        const createdColumnResult = yield (0, mongodb_1.GET_DB)().collection(COLUMN_COLLECTION_NAME).insertOne(validatedRequest.data);
        if (!createdColumnResult)
            throw new Error('Creating New Column Error - Insert To Database Failed');
        // update the board
        yield (0, mongodb_1.GET_DB)().collection(boardModel_1.BOARD_COLLECTION_NAME).updateOne({ _id: new mongodb_2.ObjectId(validatedRequest.data.boardId) }, { $push: {
                columns: createdColumnResult.insertedId,
                columnOrderIds: createdColumnResult.insertedId
            } });
    }
    catch (error) {
        throw new Error('Create New Board Failed');
    }
});
exports.columnModel = {
    createNew,
};
