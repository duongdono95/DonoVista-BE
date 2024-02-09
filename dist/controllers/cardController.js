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
exports.cardController = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const cardService_1 = require("../services/cardService");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = yield generalTypes_1.CardSchemaZod.safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New Column Request Failed');
        }
        const createdCard = yield cardService_1.cardService.createNew(validateRequest.data);
        if (!createdCard)
            throw new Error('Create New Card Failed');
        res.status(200).json({
            code: 200,
            message: 'Created New Card Successfully',
            data: createdCard,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cardId = req.body.cardId;
        const columnId = req.body.columnId;
        const boardId = req.body.boardId;
        if (!cardId || !boardId || !columnId)
            throw new Error('Delete Card Request missing required fields');
        const result = yield cardService_1.cardService.deleteCard(cardId, columnId, boardId);
        if (!result)
            throw new Error('Delete Card Failed');
        res.status(200).json({
            code: 200,
            message: 'Delete New Card Successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id)
            throw new Error('Update Card Request missing required Id');
        const validateRequest = yield generalTypes_1.CardSchemaZod.safeParseAsync(req.body);
        if (!validateRequest.success)
            throw new Error('Validate Update Card Request Failed');
        const result = yield cardService_1.cardService.updateCard(req.params.id, validateRequest.data);
        if (!result)
            throw new Error('Update Card Failed');
        res.status(200).json({
            code: 200,
            message: 'Update Card Successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.cardController = {
    createNew,
    deleteCard,
    updateCard,
};
