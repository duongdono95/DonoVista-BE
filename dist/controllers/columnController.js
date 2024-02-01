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
exports.columnController = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const columnService_1 = require("../services/columnService");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req);
        const validateRequest = yield generalTypes_1.NewColumnRequestZod.safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New Column Request Failed');
        }
        const createdColumn = yield columnService_1.columnService.createNew(validateRequest.data);
        console.log(createdColumn);
        res.status(200).json({
            code: 200,
            message: 'Created New Column Successfully',
            data: createdColumn
        });
    }
    catch (error) {
        next(error);
    }
});
exports.columnController = {
    createNew
};