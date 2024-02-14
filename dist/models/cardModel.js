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
    try {
        const createdCardResult = yield (0, mongodb_2.GET_DB)().collection(exports.CARD_COLLECTION_NAME).insertOne(validatedRequest.data);
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }
        // Update the Column
        const updateColumnResult = yield (0, mongodb_2.GET_DB)()
            .collection(columnModel_1.COLUMN_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_1.ObjectId(createCardRequest.columnId) }, {
            $push: {
                cardOrderIds: createdCardResult.insertedId.toString(),
                cards: Object.assign(Object.assign({}, createCardRequest), { _id: createdCardResult.insertedId }),
            },
        });
        return 'create New Card Successful';
    }
    catch (error) {
        throw new Error('Create New Card Failed');
    }
});
const deleteCard = (cardId, columnId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, mongodb_2.GET_DB)();
    let operationResult = { success: false, message: '' };
    try {
        const board = yield db.collection(boardModel_1.BOARD_COLLECTION_NAME).findOne({ _id: new mongodb_1.ObjectId(boardId) });
        if (!board)
            throw new Error('Delete Card Failed - Board Not Found');
        const column = yield db.collection(columnModel_1.COLUMN_COLLECTION_NAME).findOne({ _id: new mongodb_1.ObjectId(columnId) });
        if (!column)
            throw new Error('Delete Card Failed - Column Not Found');
        const card = yield db.collection(exports.CARD_COLLECTION_NAME).findOne({ _id: new mongodb_1.ObjectId(cardId) });
        if (!card)
            throw new Error('Delete Card Failed - Column Not Found');
        if (!column.cardOrderIds.toString().includes(cardId))
            throw new Error('Delete Card Failed - Card Not Found In Required Column');
        const deleteCardResult = yield db.collection(exports.CARD_COLLECTION_NAME).deleteOne({ _id: new mongodb_1.ObjectId(cardId) });
        yield db.collection(columnModel_1.COLUMN_COLLECTION_NAME).updateOne({
            _id: new mongodb_1.ObjectId(columnId),
        }, {
            $pull: { cardOrderIds: cardId.toString(), cards: card },
        });
        if (deleteCardResult.deletedCount === 0)
            throw new Error('Delete Card Failed');
        operationResult = {
            success: true,
            message: 'Card deleted successfully',
        };
        return operationResult;
    }
    catch (error) {
        throw new Error('Delete Card Failed');
    }
});
const updateCard = (cardId, updateCard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateCardResult = yield (0, mongodb_2.GET_DB)()
            .collection(exports.CARD_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new mongodb_1.ObjectId(cardId) }, {
            $set: Object.assign(Object.assign({}, updateCard), { updatedAt: new Date().toString() }),
        }, { returnDocument: 'after' });
        columnModel_1.columnModel.getColumnById(updateCard.columnId);
        return updateCardResult;
    }
    catch (error) {
        throw error;
    }
});
exports.cardModel = {
    createNew,
    CARD_COLLECTION_NAME: exports.CARD_COLLECTION_NAME,
    deleteCard,
    updateCard,
};
