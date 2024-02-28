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
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const result = await userService.createNew(email, password);
        // res.status(200).json({
        //     data: result,
        // });
    }
    catch (error) {
        next(error);
    }
});
exports.cardService = {
    createNew,
};
