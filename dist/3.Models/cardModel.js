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
exports.cardModel = exports.INVALID_UPDATED_FIELDS = exports.CARD_COLLECTION_NAME = void 0;
const mongodb_1 = require("../config/mongodb");
const generalTypes_1 = require("../zod/generalTypes");
const columnModel_1 = require("./columnModel");
const boardModel_1 = require("./boardModel");
exports.CARD_COLLECTION_NAME = 'cards';
exports.INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const createNew = (card) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCol = generalTypes_1.CardSchema.omit({ _id: true }).safeParse(card);
        if (!validatedCol.success)
            throw new Error('Invalid Column');
        const col = yield (0, mongodb_1.GET_DB)().collection(exports.CARD_COLLECTION_NAME).insertOne(validatedCol.data);
        if (!col.insertedId)
            throw new Error('Create New Column Failed!');
        const updateColumn = yield (0, mongodb_1.GET_DB)()
            .collection(columnModel_1.COLUMN_COLLECTION_NAME)
            .updateOne({ id: card.columnId }, {
            $push: {
                cards: Object.assign({ _id: col.insertedId }, card),
                cardOrderIds: card.id,
            },
        });
        if (updateColumn.modifiedCount === 0)
            throw new Error('Update Board Failed!');
        const updateBoard = boardModel_1.boardModel.updateBoardColumns(card.boardId);
        return Object.assign(Object.assign({}, card), { _id: col.insertedId });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const editCard = (card) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCard = generalTypes_1.CardSchema.omit({ _id: true }).safeParse(card);
        if (!validatedCard.success)
            throw new Error('Invalid Column');
        const updatedCard = yield (0, mongodb_1.GET_DB)()
            .collection(exports.CARD_COLLECTION_NAME)
            .updateOne({ id: card.id }, {
            $set: Object.assign(Object.assign({}, validatedCard.data), { updatedAt: new Date().toString() }),
        });
        if (updatedCard.modifiedCount === 0)
            throw new Error('Create New Column Failed!');
        yield columnModel_1.columnModel.updateColumnCards(card.columnId);
        yield boardModel_1.boardModel.updateBoardColumns(card.boardId);
        return updatedCard;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const deleteCard = (cardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const card = yield (0, mongodb_1.GET_DB)().collection(exports.CARD_COLLECTION_NAME).findOne({ id: cardId });
        if (!card)
            throw new Error('Card not found!');
        const deleteCard = yield (0, mongodb_1.GET_DB)().collection(exports.CARD_COLLECTION_NAME).deleteOne({ id: cardId });
        const updateColumn = yield (0, mongodb_1.GET_DB)()
            .collection(columnModel_1.COLUMN_COLLECTION_NAME)
            .updateOne({
            id: card.columnId,
        }, {
            $pull: {
                cards: { id: cardId },
                cardOrderIds: cardId,
            },
        });
        if (updateColumn.modifiedCount === 0)
            throw new Error('Delete Card Failed!');
        yield boardModel_1.boardModel.updateBoardColumns(card.boardId);
        return updateColumn;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const moveCard = (originalColumn, movedColumn, activeCard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valicatedOriginalColumn = generalTypes_1.ColumnSchema.omit({ _id: true, createdAt: true }).safeParse(originalColumn);
        const valicatedMovedColumn = generalTypes_1.ColumnSchema.omit({ _id: true, createdAt: true }).safeParse(movedColumn);
        const validatedActiveCard = generalTypes_1.CardSchema.omit({ _id: true, createdAt: true }).safeParse(activeCard);
        if (!valicatedOriginalColumn.success || !validatedActiveCard.success || !valicatedMovedColumn.success)
            throw new Error('Validation failed');
        if (valicatedOriginalColumn.data.id !== valicatedMovedColumn.data.id) {
            const updateOriginalCol = yield (0, mongodb_1.GET_DB)()
                .collection(columnModel_1.COLUMN_COLLECTION_NAME)
                .updateOne({ id: valicatedOriginalColumn.data.id }, { $set: Object.assign(Object.assign({}, valicatedOriginalColumn.data), { updatedAt: new Date().toString() }) });
            const updateCard = yield (0, mongodb_1.GET_DB)()
                .collection(exports.CARD_COLLECTION_NAME)
                .updateOne({ id: validatedActiveCard.data.id }, { $set: Object.assign(Object.assign({}, validatedActiveCard.data), { updatedAt: new Date().toString() }) });
            if (updateCard.modifiedCount === 0 || updateOriginalCol.modifiedCount === 0)
                throw new Error('Move Card failed');
        }
        const updateMovedCol = yield (0, mongodb_1.GET_DB)()
            .collection(columnModel_1.COLUMN_COLLECTION_NAME)
            .updateOne({ id: valicatedMovedColumn.data.id }, { $set: Object.assign(Object.assign({}, valicatedMovedColumn.data), { updatedAt: new Date().toString() }) });
        if (updateMovedCol.modifiedCount === 0)
            throw new Error('Move Card failed');
        yield boardModel_1.boardModel.updateBoardColumns(activeCard.boardId);
        return 'Move Card successfully';
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.cardModel = {
    createNew,
    deleteCard,
    editCard,
    moveCard,
};
