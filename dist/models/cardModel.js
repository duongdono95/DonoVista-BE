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
exports.cardModel = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../config/mongodb");
const generalTypes_1 = require("../zod/generalTypes");
const boardModel_1 = require("./boardModel");
const columnModel_1 = require("./columnModel");
const CARD_COLLECTION_NAME = 'cards';
const createNew = (createCardRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = generalTypes_1.CardSchemaZod.safeParse(createCardRequest);
    if (!validatedRequest.success) {
        throw new Error('Validate Add New Column To Database Failed');
    }
    const session = yield (0, mongodb_2.START_SESSION)();
    try {
        session.startTransaction();
        // validate the board
        const board = yield (0, mongodb_2.GET_DB)().collection(boardModel_1.BOARD_COLLECTION_NAME).findOne({
            _id: new mongodb_1.ObjectId(validatedRequest.data.boardId)
        });
        if (!board)
            throw new Error('Creating New Comlumn Error - Board Not Found');
        // Validate the columnId
        const column = yield (0, mongodb_2.GET_DB)().collection(columnModel_1.COLUMN_COLLECTION_NAME).findOne({ _id: new mongodb_1.ObjectId(validatedRequest.data.columnId) }, { session });
        if (!column)
            throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board');
        if (!board.columnOrderIds.toString().includes(column._id.toString()))
            throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board');
        // Create the new CARD
        const createdCardResult = yield (0, mongodb_2.GET_DB)().collection(CARD_COLLECTION_NAME).insertOne(validatedRequest.data, { session });
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }
        // Update the Column
        yield (0, mongodb_2.GET_DB)().collection(columnModel_1.COLUMN_COLLECTION_NAME).updateOne({ _id: new mongodb_1.ObjectId(createCardRequest.columnId) }, { $push: { cardOrderIds: createdCardResult.insertedId, cards: Object.assign(Object.assign({}, validatedRequest.data), { _id: createdCardResult.insertedId }) } }, { session });
        yield session.commitTransaction();
        return createdCardResult;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new Error('Create New Card Failed');
    }
    finally {
        session.endSession();
    }
});
exports.cardModel = {
    createNew,
    CARD_COLLECTION_NAME
};
