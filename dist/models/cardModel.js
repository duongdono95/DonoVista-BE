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
const boardModel_1 = require("./boardModel");
const columnModel_1 = require("./columnModel");
exports.CARD_COLLECTION_NAME = 'cards';
const INVALID_UPDATED_FIELDS = ['_id', 'ownerId', 'createdAt'];
const createNew = (createCardRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdCardResult = yield (0, mongodb_2.GET_DB)().collection(exports.CARD_COLLECTION_NAME).insertOne(createCardRequest);
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }
        const updateColumnCardOrderIds = yield (0, mongodb_2.GET_DB)()
            .collection(columnModel_1.COLUMN_COLLECTION_NAME)
            .updateOne({ _id: new mongodb_1.ObjectId(createCardRequest.columnId) }, {
            $push: {
                cardOrderIds: createdCardResult.insertedId.toString(),
                cards: Object.assign({ _id: createdCardResult.insertedId }, createCardRequest),
            },
        });
        const updateBoardResult = yield boardModel_1.boardModel.updateAggregateColumns(new mongodb_1.ObjectId(createCardRequest.boardId));
        if (updateBoardResult.code !== 200 || updateColumnCardOrderIds.modifiedCount === 0)
            throw new Error('Create New Card Failed');
        return 'create New Card Successful';
    }
    catch (error) {
        throw new Error('Create New Card Failed');
    }
});
const deleteCard = (cardId, columnId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, mongodb_2.GET_DB)();
    try {
        const deleteCardResult = yield db.collection(exports.CARD_COLLECTION_NAME).deleteOne({ _id: new mongodb_1.ObjectId(cardId) });
        if (deleteCardResult.deletedCount === 0)
            throw new Error('Delete Card Failed');
        const updateColumnCardOrderIds = yield db.collection(columnModel_1.COLUMN_COLLECTION_NAME).updateOne({ _id: new mongodb_1.ObjectId(columnId) }, {
            $pull: { cardOrderIds: new mongodb_1.ObjectId(cardId) },
        });
        const arrangeCards = yield columnModel_1.columnModel.updateAggregateCards(columnId);
        const updateBoardResult = yield boardModel_1.boardModel.updateAggregateColumns(boardId);
        if (arrangeCards.code !== 200 || updateBoardResult.code !== 200 || updateColumnCardOrderIds.modifiedCount === 0)
            throw new Error('Delete Card Failed');
        return 'Remove Card Successful';
    }
    catch (error) {
        throw new Error('Delete Card Failed');
    }
});
const updateCard = (cardId, updateCard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.keys(updateCard).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updateCard[key];
            }
        });
        const updateCardResult = yield (0, mongodb_2.GET_DB)()
            .collection(exports.CARD_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new mongodb_1.ObjectId(cardId) }, {
            $set: Object.assign(Object.assign({}, updateCard), { updatedAt: new Date().toString() }),
        }, { returnDocument: 'after' });
        // const updateColumnResult = await columnModel.updateAggregateCards(new ObjectId(updateCard.columnId));
        // const updateBoardResult = await boardModel.updateAggregateColumns(new ObjectId(updateCard.boardId));
        // if (updateColumnResult.code !== 200 || updateBoardResult.code !== 200) throw new Error('Delete Card Failed');
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
