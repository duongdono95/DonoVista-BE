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
const cardModel_1 = require("../3.Models/cardModel");
const createNew = (card) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cardModel_1.cardModel.createNew(card);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const editCard = (card) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cardModel_1.cardModel.editCard(card);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const deleteCard = (cardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cardModel_1.cardModel.deleteCard(cardId);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const moveCard = (originalColumn, movedColumn, activeCard) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cardModel_1.cardModel.moveCard(originalColumn, movedColumn, activeCard);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.cardService = {
    createNew,
    deleteCard,
    editCard,
    moveCard,
};
