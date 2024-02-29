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
const cardSerivce_1 = require("../2.Services/cardSerivce");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const card = req.body;
        if (!card)
            throw new Error('Missing required fields');
        const validatedCard = generalTypes_1.CardSchema.safeParse(card);
        if (!validatedCard.success)
            throw new Error('Validate Column failed');
        const result = yield cardSerivce_1.cardService.createNew(validatedCard.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    }
    catch (error) {
        next(error);
    }
});
const editCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const card = req.body;
        if (!card)
            throw new Error('Missing required fields');
        const validatedCard = generalTypes_1.CardSchema.safeParse(card);
        if (!validatedCard.success)
            throw new Error('Validate Column failed');
        const result = yield cardSerivce_1.cardService.editCard(validatedCard.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cardId = req.params.id;
        if (!cardId)
            throw new Error('Missing required fields');
        const result = yield cardSerivce_1.cardService.deleteCard(cardId);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    }
    catch (error) {
        next(error);
    }
});
const moveCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const originalColumn = req.body.originalColumn;
        const movedColumn = req.body.movedColumn;
        const activeCard = req.body.activeCard;
        if (!originalColumn || !movedColumn || !activeCard)
            throw new Error('Missing required fields');
        const result = yield cardSerivce_1.cardService.moveCard(originalColumn, movedColumn, activeCard);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.cardController = {
    createNew,
    deleteCard,
    editCard,
    moveCard,
};
