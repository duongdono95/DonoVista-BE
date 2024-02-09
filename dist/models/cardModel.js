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
exports.cardModel = exports.CARD_COLLECTION_NAME = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../config/mongodb");
const generalTypes_1 = require("../zod/generalTypes");
const boardModel_1 = require("./boardModel");
const columnModel_1 = require("./columnModel");
exports.CARD_COLLECTION_NAME = 'cards';
const createNew = (createCardRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = generalTypes_1.CardSchemaZod.safeParse(createCardRequest);
    if (!validatedRequest.success) {
        throw new Error('Validate Add New Column To Database Failed');
    }
    const session = yield (0, mongodb_2.START_SESSION)();
    try {
        session.startTransaction();
        // validate the board
        const board = yield (0, mongodb_2.GET_DB)()
            .collection(boardModel_1.BOARD_COLLECTION_NAME)
            .findOne({
            _id: new mongodb_1.ObjectId(validatedRequest.data.boardId),
        });
        if (!board)
            throw new Error('Creating New Comlumn Error - Board Not Found');
        // Validate the columnId
        const column = yield (0, mongodb_2.GET_DB)()
            .collection(columnModel_1.COLUMN_COLLECTION_NAME)
            .findOne({ _id: new mongodb_1.ObjectId(validatedRequest.data.columnId) }, { session });
        if (!column)
            throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board');
        if (!board.columnOrderIds.toString().includes(column._id.toString()))
            throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board');
        // Create the new CARD
        const createdCardResult = yield (0, mongodb_2.GET_DB)()
            .collection(exports.CARD_COLLECTION_NAME)
            .insertOne(validatedRequest.data, { session });
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }
        // Update the Column
        yield (0, mongodb_2.GET_DB)()
            .collection(columnModel_1.COLUMN_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_1.ObjectId(createCardRequest.columnId) }, {
            $push: {
                cardOrderIds: createdCardResult.insertedId,
                cards: Object.assign(Object.assign({}, validatedRequest.data), { _id: createdCardResult.insertedId }),
            },
        }, { session });
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
const deleteCard = (cardId, columnId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, mongodb_2.GET_DB)();
    const session = yield (0, mongodb_2.START_SESSION)();
    let operationResult = { success: false, message: '' };
    try {
        const board = yield db.collection(boardModel_1.BOARD_COLLECTION_NAME).findOne({ _id: new mongodb_1.ObjectId(boardId) });
        if (!board)
            throw new Error('Delete Card Failed - Board Not Found');
        const column = yield db.collection(columnModel_1.COLUMN_COLLECTION_NAME).findOne({ _id: new mongodb_1.ObjectId(columnId) });
        if (!column)
            throw new Error('Delete Card Failed - Column Not Found');
        if (!column.cardOrderIds.toString().includes(cardId))
            throw new Error('Delete Card Failed - Card Not Found In Required Column');
        session.startTransaction();
        const deleteCardResult = yield db.collection(exports.CARD_COLLECTION_NAME).deleteOne({ _id: new mongodb_1.ObjectId(cardId) });
        yield db.collection(columnModel_1.COLUMN_COLLECTION_NAME).updateOne({
            _id: new mongodb_1.ObjectId(columnId),
        }, {
            $pull: { cardOrderIds: cardId, cards: { _id: cardId } },
        }, { session });
        if (deleteCardResult.deletedCount === 0)
            throw new Error('Delete Card Failed');
        operationResult = {
            success: true,
            message: 'Card deleted successfully',
        };
        yield session.commitTransaction();
        return operationResult;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new Error('Delete Card Failed');
    }
    finally {
        yield session.endSession();
    }
});
const updateCard = (cardId, updateCard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, mongodb_2.GET_DB)().collection(exports.CARD_COLLECTION_NAME).findOneAndUpdate({ _id: new mongodb_1.ObjectId(cardId) }, { $set: updateCard }, { returnDocument: 'after' });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.cardModel = {
    createNew,
    CARD_COLLECTION_NAME: exports.CARD_COLLECTION_NAME,
    deleteCard,
    updateCard
};
