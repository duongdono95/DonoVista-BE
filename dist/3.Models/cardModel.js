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
exports.CARD_COLLECTION_NAME = 'cards';
exports.INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const createNew = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return '';
    }
    catch (error) {
        throw error;
    }
});
exports.cardModel = {
    createNew,
};
