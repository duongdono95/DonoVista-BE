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
exports.markdownModel = exports.INVALID_UPDATED_FIELDS = exports.MARKDOWN_COLLECTION_NAME = void 0;
const mongodb_1 = require("../config/mongodb");
const generalTypes_1 = require("../zod/generalTypes");
const boardModel_1 = require("./boardModel");
const cardModel_1 = require("./cardModel");
const columnModel_1 = require("./columnModel");
exports.MARKDOWN_COLLECTION_NAME = 'markdowns';
exports.INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const createNew = (markdown) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExist = yield (0, mongodb_1.GET_DB)().collection(exports.MARKDOWN_COLLECTION_NAME).findOne({ id: markdown.id });
        if (!isExist) {
            const md = yield (0, mongodb_1.GET_DB)().collection(exports.MARKDOWN_COLLECTION_NAME).insertOne(markdown);
            if (!md.insertedId)
                throw new Error('Create New Column Failed!');
            const card = yield (0, mongodb_1.GET_DB)().collection(cardModel_1.CARD_COLLECTION_NAME).findOne({ id: markdown.cardId });
            const updateCard = yield (0, mongodb_1.GET_DB)()
                .collection(cardModel_1.CARD_COLLECTION_NAME)
                .updateOne({ id: markdown.cardId }, {
                $set: {
                    markdown: markdown.id,
                },
            });
            if (!card)
                throw new Error(' Card not found ');
            if (updateCard.modifiedCount === 0)
                throw new Error('Update Board Failed!');
            yield columnModel_1.columnModel.updateColumnCards(card.columnId);
            yield boardModel_1.boardModel.updateBoardColumns(card.boardId);
            return Object.assign(Object.assign({}, markdown), { _id: md.insertedId });
        }
        else {
            const update = yield updateMarkdown(markdown);
            return update;
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const updateMarkdown = (markdown) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('tetstasdasdasdas');
        const validateMD = generalTypes_1.markdownSchema.omit({ _id: true }).safeParse(markdown);
        if (!validateMD.success)
            throw new Error('Invalid Markdown');
        const updateMD = yield (0, mongodb_1.GET_DB)()
            .collection(exports.MARKDOWN_COLLECTION_NAME)
            .updateOne({ id: markdown.id }, { $set: validateMD.data });
        if (updateMD.modifiedCount === 0)
            throw new Error('Update Markdown Failed!');
        return markdown;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const getMarkdown = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const md = yield (0, mongodb_1.GET_DB)().collection(exports.MARKDOWN_COLLECTION_NAME).findOne({ id: id });
        if (!md)
            throw new Error('Markdown Not Found!');
        return md;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.markdownModel = {
    createNew,
    updateMarkdown,
    getMarkdown,
};
