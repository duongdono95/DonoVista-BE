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
exports.cardService = void 0;
const mongodb_1 = require("mongodb");
const cardModel_1 = require("../models/cardModel");
const createNew = (validatedRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cardModel_1.cardModel.createNew(validatedRequest);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const deleteCard = (cardId, columnId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cardModel_1.cardModel.deleteCard(new mongodb_1.ObjectId(cardId), new mongodb_1.ObjectId(columnId), new mongodb_1.ObjectId(boardId));
        return result;
    }
    catch (error) {
        throw error;
    }
});
const updateCard = (cardId, updateCard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cardModel_1.cardModel.updateCard(new mongodb_1.ObjectId(cardId), updateCard);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.cardService = {
    createNew,
    deleteCard,
    updateCard,
};
